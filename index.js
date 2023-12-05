var express = require('express');
var proxy = require("express-http-proxy");
const cookieParser = require('cookie-parser');
const utilHttp = require('./util/utilHttp');
const bodyParser = require('body-parser');
var path = require("path")
require('body-parser-xml')(bodyParser);
var useragent = require('express-useragent');
const variables = require("./variables");

require('body-parser-xml')(bodyParser);

var app = express();

app.use(cookieParser());
app.use(useragent.express());
app.use(cookieParser());
app.use(bodyParser({limit: '10MB'}));
app.use(bodyParser.xml());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
//app.use("*",utilHttp.setInitHeaders);

app.post('/constancia/:int_id', require("./reports/constancia_recepcion/business"));

app.use("/images",express.static(__dirname + '/images'))
app.use("/resources",express.static(__dirname + '/resources'))

app.listen(variables.PORT_APP, function () {
  console.log('Express server listening on port ' + variables.PORT_APP);
});

