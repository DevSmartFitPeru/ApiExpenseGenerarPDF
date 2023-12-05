const axios = require("axios").default;
const variables = require("../variables");
const qs = require('querystring');
const ex = require('../util/utilException');

var obtenerToken = function(){
    return new Promise(function (resolve, reject) {
        try {
            var URLToken = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/realms/" + variables.KEYCLOAK_REALM + "/protocol/openid-connect/token";
            var datos = {
                "username": variables.KEYCLOAK_USER,
                "password": variables.KEYCLOAK_PASS,
                "grant_type": "password",
                "client_id": "admin-cli"
             };
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            axios.post(URLToken,qs.stringify(datos),headers)
            .then(function(resultToken){
                resolve(resultToken.data.access_token);
            })
            .catch(reject);
        } catch (error) {
            reject(error)
        }
    });
}

var crear_usuario = function(obj_usuario){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users";
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.post(URL,obj_usuario,{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var editar_usuario = function(id_usuario,obj_usuario){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario;
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.put(URL,obj_usuario,{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var asignar_usuario_groups = function(id_usuario,id_grupo){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario+"/groups/"+id_grupo;
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.put(URL,{},{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var actualizar_clave_usuario = function(id_usuario,str_password){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario+"/reset-password";
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.put(URL,{type: "password", value: str_password },{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var desasignar_usuario_groups = function(id_usuario,id_grupo){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario+"/groups/"+id_grupo;
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.delete(URL,{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var cerrar_sesion = function(id_usuario){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario+"/logout";
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.post(URL,{},{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var eliminar_usuario = function(id_usuario){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario;
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.delete(URL,{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var listar_usuarios = function(){
    return new Promise(async function(resolve,reject){
        try {
            var URL_COUNT = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/count";
            var URL_USERS = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users?first=0&max=";
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response_count  = await axios.get(URL_COUNT,{ headers: headers });
            var response_users  = await axios.get(URL_USERS+response_count.data,{ headers: headers });
            resolve(response_users.data);
        } catch (error) {
            reject(error)
        }
    });
}

var obtener_por_usuario = function(usuario){
    return new Promise(async function(resolve,reject){
        try {

            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };

            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users?username="+usuario;
            
            var response  = await axios.get(URL,{ headers: headers });
            console.log('response', response)

            var obj_usuario = response.data[0];
            if (!obj_usuario) {
                throw new ex.ValidationBusinessError2('El usuario no existe');
            }
            console.log('obj_usuario', obj_usuario)

            var id_usuario = obj_usuario.id;
            
            var URL_GRUPOS = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario+"/groups";
            
            var response_groups  = await axios.get(URL_GRUPOS,{ headers: headers });

            obj_usuario.groups = response_groups.data;

            resolve(obj_usuario);
        } catch (error) {
            reject(error)
        }
    });
}


var obtener_usuario = function(id_usuario){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario;
            console.log('URL', URL)
            var URL_GRUPOS = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario+"/groups";
            console.log('URL_GRUPOS', URL_GRUPOS)
            var URL_SESSIONS = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/users/"+id_usuario+"/sessions";
            console.log('URL_SESSIONS', URL_SESSIONS)
            
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.get(URL,{ headers: headers });
            var response_groups  = await axios.get(URL_GRUPOS,{ headers: headers });
            var response_sessions  = await axios.get(URL_SESSIONS,{ headers: headers });
            response.data.groups = response_groups.data;
            response.data.sessions = response_sessions.data;
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}


var obtener_grupo = function(id_grupo){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/groups/"+id_grupo;
            var URL_MEMBERS = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/groups/"+id_grupo+"/members";
            
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.get(URL,{ headers: headers });
            var response_members  = await axios.get(URL_MEMBERS,{ headers: headers });
            response.data.members = response_members.data;
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var listar_grupos = function(){
    return new Promise(async function(resolve,reject){
        try {
            var URL_COUNT = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/groups/count";
            var URL_DATA = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/groups?first=0&max=";
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response_count  = await axios.get(URL_COUNT,{ headers: headers });
            var response_users  = await axios.get(URL_DATA+response_count.data.count,{ headers: headers });
            resolve(response_users.data);
        } catch (error) {
            reject(error)
        }
    });
}

var crear_grupo = function(obj_grupo){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/groups";
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.post(URL,obj_grupo,{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var editar_grupo = function(id_usuario,obj_usuario){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/groups/"+id_usuario;
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.put(URL,obj_usuario,{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

var eliminar_grupo = function(id_usuario){
    return new Promise(async function(resolve,reject){
        try {
            var URL = variables.KEYCLOAK_PROTOCOL + variables.KEYCLOAK_HOST + "/auth/"+variables.KEYCLOAK_USER+"/realms/" + variables.KEYCLOAK_REALM + "/groups/"+id_usuario;
            var token = await obtenerToken();
            var headers = { 'Authorization': ('Bearer ' + token) };
            var response  = await axios.delete(URL,{ headers: headers });
            resolve(response.data);
        } catch (error) {
            reject(error)
        }
    });
}

exports.crear_usuario = crear_usuario;
exports.editar_usuario = editar_usuario;
exports.asignar_usuario_groups = asignar_usuario_groups;
exports.actualizar_clave_usuario = actualizar_clave_usuario;
exports.desasignar_usuario_groups = desasignar_usuario_groups;
exports.eliminar_usuario = eliminar_usuario;
exports.listar_usuarios = listar_usuarios;
exports.obtener_usuario = obtener_usuario;
exports.obtener_grupo = obtener_grupo;
exports.listar_grupos = listar_grupos;
exports.crear_grupo = crear_grupo;
exports.editar_grupo = editar_grupo;
exports.eliminar_grupo = eliminar_grupo;
exports.cerrar_sesion = cerrar_sesion;
exports.obtener_por_usuario = obtener_por_usuario;
