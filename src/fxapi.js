const axios = require('axios')

const FxLogin = (username = '', password = '') => {
    if (username.length === 0 || password.length === 0)
    return { error: true, message: "Invalid Inputs" }
    return new Promise((resolve, reject) => {
        axios.get(`https://www.myfxbook.com/api/login.json?email=${username}&password=${password}`)
            .then(function (response) {
                console.log("Login data", response.data);
                resolve(response.data)
            })
            .catch(function (error) {
                console.log("Login failed!", error);
                reject({ error: true, message: "Network ERR" })
            });
    }
    )
}

const GetAccountInfo = (session='') => {
    if (session.length === 0)
    return { error: true, message: "Invalid Inputs" }
    return new Promise((resolve, reject) => {
        axios.get(`https://www.myfxbook.com/api/get-my-accounts.json?session=${session}`)
            .then(function (response) {
                console.log("Get Account Info data", response.data);
                resolve(response.data)
            })
            .catch(function (error) {
                console.log("Get Account Info failed!", error);
                reject({ error: true, message: "Network ERR" })
            });
    }
    )
}

const GetOrder = (session='',accountId='') => {
    if (session.length === 0||accountId.length!==0)
        return { error: true, message: "Invalid Inputs" }
    return new Promise((resolve, reject) => {
        axios.get(`https://www.myfxbook.com/api/get-open-orders.json?session=${session}&id=${accountId}`)
            .then(function (response) {
                console.log("Get Orders data", response.data);
                resolve(response.data)
            })
            .catch(function (error) {
                console.log("Get Orders failed!", error);
                reject({ error: true, message: "Network ERR" })
            });
    }
    )
}

module.exports = {
    FxLogin,
    GetAccountInfo,
    GetOrder
}