const pg = require('pg');
const express=require("express");
var bodyParser=require('body-parser');
const search=require('./search.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const search-put = require('./search-put-controller.js');
module.exports.bcrypt = bcrypt;

const app = express();

const connection = {
    host	: 'moonwalk-db.cciaciynavwo.us-east-2.rds.amazonaws.com',
    user: process.env.USER,
    password: process.env.PASS,
    database: 'postgres',
    port: 5432,
    ssl: true
};


const client = new pg.Client(connection);

client.connect(function(err){
    if(!err) {
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database" + err);
    }
});

module.exports = client;

//Require all of our controllers
var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');
var searchController=require('./controllers/search-controller');
var getSearchController = require("./controllers/get-search-controller.js");
var tripPutController = require("./controllers/trip-put-controller.js");

//So we can parse body data of http requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var router = express.Router();

//test route
router.get('/', function(req, res) {
        res.json({ message: 'welcome to our upload module apis' });
    }
);

/* routes to handle api requests using above controllers*/
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticateLogin);

app.post('/api/authenticate',authenticateController.authenticateLogin);

// TODO: pass all API calls through middleware authenticateController.authenticateApi
// to verify JWT before continuing, done to secure endpoints
// TODO: login can also be verified this way, authenitcateLogin2
app.post('/api/search', authenticateController.authenticateApi,searchController.search);
app.listen(8012);

//Calls search every 5 minutes
//TODO: Implement functions to:
//     -order Users based on who is dropped off first.
//     -respond to get requests from the frontend

setInterval(function(){
    var group = search.searchMatrix(getSearchController.getSearchData(), 1);
    if(group.length > 0){
    	//TODO: Order the group before putting it in the trip table
        tripPutController.addTrips(group);
    }
}, 300000);

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAsn8mQ2wJcM2jQWD8ByBQ1_0aoW4gARP0'
});

// Geocode an address.
googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
  if (!err) {
    console.log(response.json.results);
  }
});
