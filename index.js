const { Telegraf, Extra, Markup } = require('telegraf')
const dotenv = require('dotenv')
const { FxLogin, GetAccountInfo } = require('./src/fxapi')
const fs=require('fs')
require("util").inspect.defaultOptions.depth = null
dotenv.config()

const ERR_MSG = "☹️ Something went wrong. Error: "
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_ID

const bot = new Telegraf(TELEGRAM_BOT_TOKEN)
const adEmail=process.env.ADMIN_EMAIL
const adPassword=process.env.ADMIN_PASSWORD
let session_g = ''
let isSignIn=false;
let accountId_g=''

bot.telegram.setMyCommands([
    { command: "start", description: "Print this welcome message" },
])

bot.start(async (ctx) => {
    const { message_id: originalMessageId, from: { username }, chat: { id: chatId } } = ctx.update.message;
    try {
        await ConnectFXBook()
        const initString = `session:${session_g}\naccount ID:${accountId_g}`
        const id = ctx.message.chat.id
    await ctx.telegram.sendMessage(id, initString, {
        parse_mode: "HTML",
    });
    } catch (err) {
        ctx.telegram.sendMessage(chatId, ERR_MSG + err.message, {
            parse_mode: "HTML",
            reply_to_message_id: originalMessageId
        });
    }
    
});

bot.command('login', async (ctx) => {
    const { message_id: originalMessageId, from: { username }, chat: { id: chatId }, text } = ctx.update.message;

    try {

        if (ctx.message.chat.type === "private") {
            return
        }

        const args = text.split(/[ ,\r\n\t]+/)
        const [_, email = '', password = '',] = args
        let replyMsg = ''
        if (!email || !password)
            replyMsg = `You need to provide Username and Password
/login [username] [password]`
        else {
            const loginResult = await FxLogin(email, password)
            if (!loginResult.error) {
                const accountInfo = await GetAccountInfo(loginResult.session)
                if (!accountInfo.error) {
                    const getOrders = await getOrders(loginResult.session, accountInfo.accounts.id)
                    if (!getOrders.error) {
                        const { openOrders } = getOrders
                        if (openOrders.length) {
                            replyMsg = `${openOrders.map(order => `${order.action} ${order.symbol} ${order.openPrice}\n"TP":${order.tp}\n"SL":${order.sl}\n`)}`
                        } else replyMsg = `No open orders`
                    }
                    else replyMsg = `${getOrders.error}`
                } else {
                    replyMsg = `${accountInfo.message}`
                }
            }
            else
                replyMsg = `${loginResult.message}`


        }
        ctx.telegram.sendMessage(chatId, replyMsg, {
            parse_mode: "HTML",
            reply_to_message_id: originalMessageId
        });

    } catch (err) {
        ctx.telegram.sendMessage(chatId, ERR_MSG + err.message, {
            parse_mode: "HTML",
            reply_to_message_id: originalMessageId
        });
    }
})

bot.on('message', async (ctx) => {
    const { message_id: originalMessageId, from: { username }, chat: { id: chatId } } = ctx.update.message;

    try {

    } catch (error) {
        ctx.telegram.sendMessage(chatId, ERR_MSG + err.message, {
            parse_mode: "HTML",
            reply_to_message_id: originalMessageId
        });
    }
})
bot.launch()

const LoadLastSession=()=> {
    return new Promise((resolve, reject) => {
        fs.readFile('./session.txt', 'utf8', async (err, jsonData) => {
            if (err) {
                if (err.code === 'ENOENT') { // file does not exist
                    const wjsonData = JSON.stringify('kJX1fSfAhplFe3WDqTf33427495');
                    return new Promise((resolve, reject) => {
                        fs.writeFile('./session.txt', wjsonData, err => {
                            if (err) {
                                console.error(err);
                                reject('kJX1fSfAhplFe3WDqTf33427495')
                            }
                            console.log('Last session has been saved to file');
                            resolve('kJX1fSfAhplFe3WDqTf33427495');
                        });
                    })

                } else { // other error
                    console.error(err);
                    reject(err)
                }
            } else{
                const session=JSON.parse(jsonData)
             
                console.log('Last session loaded from file:', session);
                resolve(session)
            }


        });
    })

}
const SaveLastSession=(session='')=>{
    const wjsonData = JSON.stringify(session);
    return new Promise((resolve, reject) => {
        fs.writeFile('./session.txt', wjsonData, err => {
            if (err) {
                console.error(err);
                reject('')
            }
            console.log('Last session has been saved to file');
            resolve(session);
        });
    })
}
const ConnectFXBook=async()=>{
    session_g=await LoadLastSession()
    if(!session_g){
        const loginResult = await FxLogin(adEmail, adPassword)
            if (!loginResult.error) {
                session_g=loginResult.session
                await SaveLastSession(session_g)
            }
            else {
                console.log('Invalid credential')
                return 
            }
    }

    const accountInfo = await GetAccountInfo(session_g)
    if (!accountInfo.error) {
        isSignIn=true
        accountId_g=accountInfo.accounts.id
        console.log(accountId_g,session_g)
    } else{
        isSignIn=false
        session_g=''
                await SaveLastSession(session_g)
                await ConnectFXBook()
    }
}