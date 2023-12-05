const utili18n = require("./utilI18n");
const { uuid } = require('uuidv4');
const variables = require("../variables");
const logs = require("../integrations/logs");
const moment = require("moment");

exports.setInitHeaders = function (req, res, next) {
    req.setTimeout(60000);
    req.headers["Bypass-Tunnel-Reminder"] = "1";
    try {
        if (req.originalUrl.indexOf('/auth/loginHtml5') < 0) {

            var req_query = req.query ? JSON.stringify(req.query) : "";
            var req_query_bytes = Buffer.byteLength(JSON.stringify(req_query), 'utf8');

            var req_body = req.body ? JSON.stringify(req.body) : "";
            var req_body_bytes = Buffer.byteLength(JSON.stringify(req_body), 'utf8');
            
            var dataTrace = {
                "str_uuid": uuid(),
                "str_trace_uuid": req.headers["str_trace_uuid"] ? req.headers["str_trace_uuid"]  : uuid(),
                "str_type_process": req.headers["str_type_process"],
                "str_user": req.headers["str_user"],
                "dt_init_front_end": req.headers["dt_init_front_end"] ? req.headers["dt_init_front_end"] : null,
                "dt_fin_front_end": null,
                "int_duration_front_end": null,
                "str_type_client_app": req.headers["str_type_client_app"],
                "str_client_app": req.headers["str_client_app"],
                "int_orden_exec": req.headers["int_orden_exec"] ? (parseInt(req.headers["int_orden_exec"]) + 1) : 1,
                "str_url": req.originalUrl,
                "str_method": req.method,
                "str_http_query": req_query,
                "int_http_query_bytes": req_query_bytes,
                "str_http_body": req_body,
                "int_http_body_bytes": req_body_bytes,
                "str_http_response": null,
                "int_http_response_bytes": null,
                "int_http_code": null,
                "str_system_code": null,
                "str_system_message": null,
                "str_os_front_end": req.useragent.os,
                "str_platform_front_end": req.useragent.platform,
                "str_browser_front_end": req.useragent.browser + ":" + req.useragent.version,
                "bit_is_mobile_front_end": req.useragent.isMobile,
                "bit_is_browser_front_end": req.useragent.isChrome,
                "str_remote_address": req.connection.remoteAddress,
                "str_remote_port": req.connection.remotePort,
                "str_local_address": req.connection.localAddress,
                "str_local_port": req.connection.localPort,
                "str_stack_error": null,
                "dt_init_api": new Date(),
                "dt_fin_api": null,
                "int_duration_api": null,
                "str_api_process": null,
                "str_api_name": variables.NAME_APP,
                "str_api_host_name": variables.COMPUTERNAME,
                "str_api_lang": "NODEJS",
                "str_api_lang_version": process.version,
                "str_api_process_id": process.pid,
                "str_api_server_platform": process.platform,
                "str_api_server_arch": process.arch,
                "str_api_server_dir_location": process.mainModule.filename,
                "str_metadata": ""
            }
            req.trace = dataTrace;
        }

        next();

    } catch (error) {
        console.error("error", error);
        res.send({ error: error.message });
        res.status(500)
    }

}

exports.resSuccess = function (req, res, obj_result = null) {
    try {
        var statusCodeHttp = 200;
        var statusCodeSys = "00001";
        var messageSys = utili18n.msg("codes.00001");
        var finishDate = new Date();

        var response = { trace_uuid: req.trace.str_trace_uuid, result: obj_result, code: statusCodeSys, message: messageSys };

        res.status(statusCodeHttp)
        res.json(response);


        var reponse_body = JSON.stringify(response);
        var response_body_bytes = Buffer.byteLength(JSON.stringify(reponse_body), 'utf8');

        req.trace.str_http_response = reponse_body;
        req.trace.int_http_response_bytes = response_body_bytes;
        req.trace.int_http_code = statusCodeHttp;
        req.trace.str_system_code = statusCodeSys;
        req.trace.str_system_message = messageSys;
        req.trace.str_status = "success";
        req.trace.dt_fin_api = finishDate;
        req.trace.int_duration_api = (finishDate.getTime() - req.trace.dt_init_api.getTime());
        req.trace.dt_init_api = req.trace.dt_init_api;
        req.trace.str_stack_error = "";
        req.trace.str_api_process = req.trace.str_api_process ? req.trace.str_api_process : req.originalUrl;

        logs(req.trace)
        .then(function (data) {  })
            .catch(function (err) {  })
    } catch (error) {
        console.log("error al registrar log")
    }

}

exports.resError = function (req, res, oError) {
    console.error("oError", oError);
    try {
        var statusCodeHttp = 500;
        var statusCodeSys = oError.code ? oError.code : '9999';
        var messageSys = oError.message;
        var finishDate = new Date();
        var bit_is_error = false;
        var stackError = "";
        var result = null;
        if (oError.name === "ValidationServiceInputParamsError") {
            statusCodeHttp = 400;
            bit_is_error = true;
            result = oError.errors;
        }

        if (oError.name === "DataBaseError") {
            statusCodeHttp = 400;
            bit_is_error = true;
            result = oError.message;
        }

        else if (oError.name === "SessionTimeOutError") {
            statusCodeHttp = 503;
        }

        else if (oError.name === "ValidationBusinessError") {
            statusCodeHttp = 200;
        }

        else {
            stackError = oError.stack;
            bit_is_error = true;
            statusCodeHttp = 500;
        }

        var response = { trace_uuid: req.trace.str_trace_uuid, result: result, code: statusCodeSys, message: messageSys, name: oError.name, bit_is_error: bit_is_error };

        res.status(statusCodeHttp)
        res.json(response);

        if (req.originalUrl.indexOf('/auth/loginHtml5') < 0 && statusCodeHttp !== 503) {

            var reponse_body = JSON.stringify(response);
            var response_body_bytes = Buffer.byteLength(JSON.stringify(reponse_body), 'utf8');

            req.trace.str_http_response = reponse_body;
            req.trace.int_http_response_bytes = response_body_bytes;
            req.trace.int_http_code = statusCodeHttp;
            req.trace.str_system_code = statusCodeSys;
            req.trace.str_system_message = messageSys;
            req.trace.str_status = bit_is_error ? 'error' : 'warn';
            req.trace.dt_fin_api = finishDate;
            req.trace.int_duration_api = (finishDate.getTime() - req.trace.dt_init_api.getTime());
            req.trace.dt_init_api = req.trace.dt_init_api;
            req.trace.str_stack_error = stackError;
            req.trace.str_api_process = req.trace.str_api_process ? req.trace.str_api_process : req.originalUrl;


            logs(req.trace)
                .then(function (data) {  })
                .catch(function (err) {  })

        }
    } catch (error) {
        console.log("error al registrar log")
    }

}