const axios = require("axios").default;
const variables = require("../variables");

var register = function (data) {
    return new Promise(async function (resolve, reject) {
        try {
            var URL = variables.LOG_HOST_APP + "/register";
            result  = await axios.post(URL,data,{
                headers:{ "Bypass-Tunnel-Reminder": "1" }
            });
            resolve(result);
        } catch (error) {
            reject(error)
        }
    });
}

module.exports = register;