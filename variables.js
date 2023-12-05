
if(!process.env.DEPLOYED){
    var localEnv = require("./local_env.json");
    Object.assign(process.env,localEnv);
}
module.exports = process.env