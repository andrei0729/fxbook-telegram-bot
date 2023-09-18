const { Telegraf, Extra, Markup } = require('telegraf')
const dotenv = require('dotenv')
require("util").inspect.defaultOptions.depth = null
dotenv.config()

const ERR_MSG = "☹️ Something went wrong. Error: "
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_ID

const bot = new Telegraf(TELEGRAM_BOT_TOKEN)

bot.telegram.setMyCommands([
    { command: "start", description: "Print this welcome message" },
])

bot.start(async (ctx) => {
    const { message_id: originalMessageId, from: { username }, chat: { id: chatId } } = ctx.update.message;
    const initString = `Start the bot`
    const id = ctx.message.chat.id
    await ctx.telegram.sendMessage(id, initString, {
        parse_mode: "HTML",
    });
});

bot.command('login', async (ctx) => {
    const { message_id: originalMessageId, from: { username }, chat: { id: chatId } } = ctx.update.message;

    try {

        if (ctx.message.chat.type !== "private") {
            return
        }

        const args = text.split(/[ ,\r\n\t]+/)
        const [_, login = '', password = '',] = args
        let replyMsg = ''
        if (!login || !password)
            replyMsg = `Usage: /join <b>[5 numbers, 1-30]</b>
        /join <b>lucky</b>`
        else {
            replyMsg = `Use Etherscan and call <b>connectAndApprove</b> on <b>BINGO</b> with the following value:
            `

            ctx.telegram.sendMessage(chatId, initString, {
                parse_mode: "HTML",
                reply_to_message_id: originalMessageId
            });
        }


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