const fs = require("fs")
const moment = require('moment');
const handlebars2 = require("handlebars")
var html_to_pdf = require('html-pdf-node');

var pdfUtils = require('jsreport-pdf-utils')();
var scripts = require('jsreport-scripts')();
var handlebars = require('jsreport-handlebars')();
var chrome_pdf = require('jsreport-chrome-pdf')();

const jsreport = require('jsreport-core')({
    templatingEngines: { 
        numberOfWorkers: 5,
        strategy: 'dedicated-process',
        templateCache: {
			max: 100, //LRU cache with max 100 entries, see npm lru-cache for other options
			enabled: true //disable cache
		}
    },
    extensions: {
        "scripts": {
            "allowedModules": ["*"],
            "timeout": 120000
        },
        "tasks": {
            "strategy": "in-process",
            "timeout": 120000,
            "allowedModules": []
        },
        'chrome-pdf': {
            timeout: 120000, // 60 segundos
            chrome: {
                launchOptions: {
                    args: ['--no-sandbox']
                  }
            },
        },
    },
    
    logger: {
		silent: false // when true, it will silence all transports defined in logger
	}
});
//jsreport.use(require('jsreport-static-resources')())
jsreport.use(handlebars);
jsreport.use(chrome_pdf);
jsreport.use(pdfUtils);
jsreport.use(scripts);

jsreport.init();


// function generateEventAfter(content){
//     return (async function afterRender(req, res){
//         const jsreport = require('jsreport-proxy')
//         const $pdf = await jsreport.pdfUtils.parse(res.content, true);
//         const mergeRes = await jsreport.render({
//             template: {
//                 content: `{{content}}`,
//                 engine: 'handlebars',
//                 recipe: 'chrome-pdf'
//             },
//             data: {
//                 ...req.data,
//                 $pdf
//             }
//         });

//         res.content = await jsreport.pdfUtils.merge(res.content, mergeRes.content,true)
        
//     }).toString('utf8').replace("{{content}}",content);
// }

function generateHelperGetPage(){
    return (function getPageNumber(currentIndex){
        return currentIndex + 1;
    }).toString("utf8")+ " ";

    
}


function generateEventAfter(content,options = {}){
    var helpersString = "";
    helpersString = helpersString + " " + generateHelperGetPage();
    return  (async function afterRender(req, res){
        const jsreport = require('jsreport-proxy')
        const $pdf = await jsreport.pdfUtils.parse(res.content, true);
        req.data.$pdf = $pdf ;
        const mergeRes = await jsreport.render({
            template: {
                content: `{{content}}`,
                engine: 'handlebars',
                recipe: 'chrome-pdf',
                helpers: `{{helpers}}`,
                chrome: JSON.parse(`{{chrome}}`)
            },
            data: req.data
        });

        res.content = await jsreport.pdfUtils.merge(res.content, mergeRes.content,true)
        
    }).toString('utf8').replace("{{content}}",content).replace("{{helpers}}",helpersString).replace("{{chrome}}",JSON.stringify(options)).replace("{{chrome}}",JSON.stringify(options));
}



var generateFormatPDF = function (pathTemplate, data, options, pathTemplateHeaderFooter) {
    return new Promise(async function (resolve, reject) {
        try {
            var contentTemplate = fs.readFileSync(pathTemplate).toString("utf8");
            var contentTemplateHeader = "";
            if (pathTemplateHeaderFooter) {
                contentTemplateHeader = fs.readFileSync(pathTemplateHeaderFooter).toString("utf8");
            }

            var requestPDF = {
                template: { content: contentTemplate, engine: 'handlebars', recipe: 'chrome-pdf', "chrome": options,
                scripts: [{
                    content: generateEventAfter(contentTemplateHeader, {
                        landscape: options.landscape,
                        format: options.format
                    })
                }] },
                data: data
            }
            var result = await jsreport.render(requestPDF);
           
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

var generateFormatPDFDirect = function (pathTemplate, data, options, pathTemplateHeaderFooter) {
    return new Promise(async function (resolve, reject) {
        try {
            var contentTemplate = fs.readFileSync(pathTemplate).toString("utf8");
            var contentTemplateHeader = "";
            if (pathTemplateHeaderFooter) {
                contentTemplateHeader = fs.readFileSync(pathTemplateHeaderFooter).toString("utf8");
            }

            var template  = handlebars2.compile(contentTemplate)
            var html = template(data);
            let file = { content: html };

            var pdfBuffer =  await html_to_pdf.generatePdf(file, options);

            resolve(pdfBuffer);
        } catch (error) {
            reject(error);
        }
    });
}


var formatDate = function (utcTime, formatString = "DD/MM/YYYY HH:mm:ss") {
    if (!utcTime) {
        return "";
    }
    var offset = moment().utcOffset();
    var localText = moment.utc(utcTime).utcOffset(offset).format(formatString);
    return localText;
}

var formatDateSinH = function (utcTime, formatString = "DD/MM/YYYY") {
    if (!utcTime) {
        return "";
    }
    var offset = moment().utcOffset();
    var localText = moment.utc(utcTime).utcOffset(offset).format(formatString);
    return localText;
}

 async function generarPDFs(datosArray,template) {
    try {
      // Leer el contenido de la plantilla HTML
      const plantillaHTML = fs.readFileSync(template).toString("utf8");
  
      // Compilar la plantilla utilizando Handlebars
      const plantillaCompilada = handlebars.compile(plantillaHTML);
  
      // Configurar las opciones para jsreport
      const opcionesJsreport = {
        template: {
          content: plantillaCompilada(datosArray),
          engine: 'handlebars',
          recipe: 'chrome-pdf',
        },
      };
  
      // Generar el PDF
      const resultado = await jsreport.render(opcionesJsreport);
  
      // Guardar el PDF en un archivo
      var pathTemplate = __dirname + '/salida.pdf';
      fs.writeFileSync(pathTemplate, resultado.content);
      
      console.log('PDF generado exitosamente.');
      return resultado;
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    } finally {
      // Cerrar jsreport
      await jsreport.close();
    }
  }


exports.pdf = generateFormatPDF;
exports.pdfd = generateFormatPDFDirect;
exports.formatDate = formatDate;
exports.formatDateSinH = formatDateSinH;
exports.pdfnew = generarPDFs;