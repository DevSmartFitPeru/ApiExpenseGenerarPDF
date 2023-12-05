//const { default: collect } = require("collect.js");
// const db = require("../../integrations/db");
// const utilHttp = require("../../util/utilHttp");
const utilReport = require("../../util/utilReport");
const collect =  require("collect.js");
const moment = require("moment");
//import collect from "collect.js";

var pathTemplate = __dirname + '/template.html';


module.exports = async function (req, res, next) {
    //req.trace.str_api_process = "FORMATO_PDF_eXPENSES";
    try {
       
        var obj_datos = req.body;
        console.log('obj_datos', obj_datos)
        //eturn obj_datos;
        
        // obj_datos.arr_cabecera[0].forEach(item => {
        //     item.dt_fecha_movilidad = !item.dt_fecha_movilidad ? null : moment(item.dt_fecha_movilidad).format('DD/MM/YYYY');
        // });
        // var obj_cabecera = obj_datos.arr_cabecera[0];

        obj_datos.arr_detalles.forEach(item => {
            item.dt_fecha_comprobante = !item.dt_fecha_comprobante ? null : moment(item.dt_fecha_comprobante).format('DD/MM/YYYY');
        });
        var data = {cab:obj_datos.arr_cabecera , detalles : obj_datos.arr_detalles, aprobador :obj_datos.arr_aprobador }

        var pathTemplateHeaderFooter = __dirname + "/footer_template.html";
        var formatResult = await utilReport.pdf(pathTemplate, data, {
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