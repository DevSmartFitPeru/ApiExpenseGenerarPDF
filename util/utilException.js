const utili18n = require("./utilI18n");

class ValidationServiceInputParamsError extends Error {
    constructor(errors) {
        var codeError = "50001";
        var mensaje = utili18n.msg("codes.system_error."+ codeError) + errors.join("\n-");
        super(mensaje); // (1)
        this.name = "ValidationServiceInputParamsError"; // (2)
        this.errors = errors;
        this.isBusinessError = false;
        this.isSystemError = true;
        this.code = codeError;
        this.message = mensaje;
    }
}

class ValidationServiceOutParamsError extends Error {
    constructor(errors) {
        var codeError = "50002";
        var mensaje = utili18n.msg("codes.system_error."+ codeError) + errors.join("\n-");
        super(mensaje); // (1)
        this.name = "ValidationServiceOutParamsError"; // (2)
        this.errors = errors;
        this.isBusinessError = false;
        this.isSystemError = true;
        this.code = codeError;
        this.message = mensaje;
    }
}

class SessionTimeOutError extends Error {
    constructor() {
        var codeError = "50003";
        var mensaje = utili18n.msg("codes.system_error."+ codeError);
        super(mensaje); // (1)
        this.name = "SessionTimeOutError"; // (2)
        this.isSessionExpired = true;
        this.isSystemError = true;
        this.isBusinessError = false;
        this.code = codeError;
        this.message = mensaje;
    }
}

class ValidationBusinessError extends Error {
    constructor(codeI18n, params) {
        var mensaje = utili18n.msg("codes.business." + codeI18n, params);
        super(mensaje); // (1)
        this.name = "ValidationBusinessError"; // (2)
        this.code = codeI18n;
        this.isBusinessError = true;
        this.isSystemError = false;
        this.message = mensaje;
    }
}

class ValidationBusinessError2 extends Error {
    constructor(mensaje) {
        super(mensaje); // (1)
        this.name = "ValidationBusinessError"; // (2)
        this.code = "00002";
        this.isBusinessError = true;
        this.isSystemError = false;
        this.message = mensaje;
    }
}


class DataBaseError extends Error {
    constructor(oError) {
        var codeError = "50004";
        super(oError.toString()); // (1)
        this.name = "DataBaseError"; // (2)
        this.code = codeError;
        this.isBusinessError = true;
        this.isSystemError = false;
        this.message = oError.message;
    }
}

exports.ValidationServiceInputParamsError = ValidationServiceInputParamsError;
exports.ValidationServiceOutParamsError = ValidationServiceOutParamsError;
exports.ValidationBusinessError = ValidationBusinessError;
exports.SessionTimeOutError = SessionTimeOutError;
exports.DataBaseError = DataBaseError;
exports.ValidationBusinessError2 = ValidationBusinessError2;