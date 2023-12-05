//const { default: collect } = require("collect.js");
// const db = require("../../integrations/db");
// const utilHttp = require("../../util/utilHttp");
const utilReport = require("../../util/utilReport");
const collect =  require("collect.js");
const moment = require("moment");
//import collect from "collect.js";

var pathTemplate = __dirname + '/template.html';


var formatDate = utilReport.formatDate;

module.exports = async function (req, res, next) {
    //req.trace.str_api_process = "FORMATO_PDF_eXPENSES";
    try {
       
        var obj_datos = req.body;
        console.log('obj_datos', obj_datos)
        //eturn obj_datos;
        //var data = {cab:obj_constancia , muestras : arr_muestras}

        var pathTemplateHeaderFooter = __dirname + "/footer_template.html";
        var formatResult = await utilReport.pdf(pathTemplate, obj_datos, {
            landscape: true,
            format: "A4",
            displayHeaderFooter: false,
            marginBottom: "50px",
            paddingBottom: "10px",
            marginTop: "160px",
        }, pathTemplateHeaderFooter);

        var nombre_file = "archivo_node";
        res.set({ 'Content-Disposition': 'inline; filename=' +  (nombre_file+".pdf") });
        formatResult.stream.pipe(res);
        // res.status(200)
        // res.json(obj_datos);
    } catch (error) {
        console.log('error', error)
        //utilHttp.resError(req, res, error);
        res.status(500)
        res.json(error);
    }
}