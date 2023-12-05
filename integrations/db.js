const axios = require("axios").default;
const variables = require("../variables");
const utilException = require("../util/utilException");
const host_url = variables.DB_HOST_APP;
const host_url_servicio = variables.HOST_FACT_SERV;

var findAllBatchDb = function (params, req) {
    return new Promise(async function (resolve, reject) {
        try {
            result = await axios.post(host_url + "/batch", params);
            resolve(result.data);
        } catch (error) {
            reject(new utilException.DataBaseError(error))
        }
    });
}

var findAllDb = function (tabla, campos = ["*"], condicion = null, req) {
    return new Promise(async function (resolve, reject) {
        try {
            var url = host_url + "/all/" + tabla;
             
            result = await axios.post(url, {
                campos: campos,
                condicion: condicion
            });
            resolve(result.data);
        } catch (error) {
             
            reject(new utilException.DataBaseError(error.response.data))
        }
    });
}

var findOneDb = function (tabla, id, req) {
    return new Promise(async function (resolve, reject) {
        try {
            result = await axios.get(host_url + "/one/" + tabla + "/" + id);
            resolve(result.data);
        } catch (error) {
            reject(new utilException.DataBaseError(error))
        }
    });
}

var insertDb = function (tabla, datos, req) {
    return new Promise(async function (resolve, reject) {
        try {
             
            if (Array.isArray(datos)) {
                datos.forEach(function (item) {
                    item.str_creacion_uuid = req.trace.str_uuid;
                    item.str_creacion_user = req.trace.str_user;
                })
            } else {
                datos.str_creacion_uuid = req.trace.str_uuid;
                datos.str_creacion_user = req.trace.str_user;
                  
            }
             
            result = await axios.post(host_url + "/insert/" + tabla, datos);
            resolve(result.data);
        } catch (error) {
            reject(new utilException.DataBaseError(error.response.data))
        }
    });
}

var updateDb = function (tabla, datos, condicion, req) {
    return new Promise(async function (resolve, reject) {
        try {
            if (Array.isArray(datos)) {
                datos.forEach(function (item) {
                    item.str_edicion_uuid = req.trace.str_uuid;
                    item.str_edicion_user = req.trace.str_user;
                })
            } else {
                datos.str_edicion_uuid = req.trace.str_uuid;
                datos.str_edicion_user = req.trace.str_user;
            }
            result = await axios.put(host_url + "/update/" + tabla, {
                datos: datos,
                condicion: condicion,
            });
            resolve(result.data);
        } catch (error) {
            reject(new utilException.DataBaseError(error.response.data))
        }
    });
}

var deleteDb = function (tabla, ids, req) {
    return new Promise(async function (resolve, reject) {
        try {
            result = await axios.put(host_url + "/update/" + tabla, {
                datos: {
                    str_borrado_uuid: req.trace.str_uuid,
                    str_borrado_user: req.trace.str_user,
                    bit_borrado: true,
                    dt_borrado_fecha: new Date()
                },
                condicion: { int_id: ids },
            });
            resolve(result.data);
        } catch (error) {
            reject(new utilException.DataBaseError(error.response.data))
        }
    });
}

var findAllServXFact = function (id, req) {
    return new Promise(async function (resolve, reject) {
        try {
            var url =host_url_servicio + "/solicitud/consultar_servicios_factura/" + id;
            result = await axios.post(url, {
                campos: {},
                condicion: {}
            });
             
             
            resolve(result.data);
        } catch (error) {
             
            reject(new utilException.DataBaseError(error.response.data))
        }
    });
}

module.exports = {
    findAllBatch: findAllBatchDb,
    findAll: findAllDb,
    findOne: findOneDb,
    insert: insertDb,
    update: updateDb,
    delete: deleteDb,
    findAllServXFact : findAllServXFact,
    host_url: host_url,
    host_url_servicio:host_url_servicio
};