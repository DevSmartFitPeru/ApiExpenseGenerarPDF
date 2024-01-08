var express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var useragent = require('express-useragent');
const variables = require("./variables");
const cors = require('cors');
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
app.use(cors()); 

app.post('/generearpdf', require("./reports/expenses/business"));

app.use("/images",express.static(__dirname + '/images'))
app.use("/resources",express.static(__dirname + '/resources'))

app.listen(variables.PORT_APP, function () {
  console.log('Express server listening on port ' + variables.PORT_APP);
});

