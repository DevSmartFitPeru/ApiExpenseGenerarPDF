const validate = require("validate.js");
const utilEX  = require("./utilException");
var _ = require('lodash');

validate.validators.array = (arrayItems, itemConstraints) => {
    if (arrayItems) {
        const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
            const error = validate(item, itemConstraints)
            if (error) errors[index] = { error: error }
            return errors
        }, {})

        return _.isEmpty(arrayItemErrors) ? null : { errors: arrayItemErrors }
    }

}

module.exports = function (params, constraints, isInput = true) {
    var whitelist = {};
    Object.keys(constraints).forEach(function (key) {
        whitelist[key] = true;
    });
    var paramsClean = validate.cleanAttributes(params, whitelist);
    var errors = validate(paramsClean, constraints, { format: "flat" });
    if (errors) {
        if(isInput){
            throw new utilEX.ValidationServiceInputParamsError(errors);
        }else{
            throw new utilEX.ValidationServiceOutParamsError(errors);
        }
    }else{
        return paramsClean;
    }
}