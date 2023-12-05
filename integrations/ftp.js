const axios = require("axios").default;
const variables = require("../variables");
const ex = require("../util/utilException");
var upload = function (data, trace) {
    return new Promise( function (resolve, reject) {
        try {
            
            var headers = JSON.parse(JSON.stringify(trace));
            headers.str_http_body = null;
            headers["Bypass-Tunnel-Reminder"] = "1";
            var URL = variables.FTP_HOST_APP;
            result  =  axios.post(URL,data,{ headers: headers })
            .then(function(result){
                if(result.data.code === "00001"){
                    resolve(result.data.result);
                }else{
                    reject(new ex.ValidationServiceFtpError(result.data.message));
                };
            })
            .catch(function(err){
                console.log("err",err.toString())
                reject(err)
            });
            
        } catch (error) {
            reject(error)
        }
    });
}

module.exports = upload;