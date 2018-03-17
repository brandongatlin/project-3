const express = require( "express" );
const methodOverride = require( "method-override" );
const bodyParser = require( "body-parser" );
const app = express();
const path = require( "path" );
const db = require( "./models" );
const router = require( "./controllers/controller.js" )
const sequelize = require( "sequelize" );
const chalkAnimation = require( 'chalk-animation' );
const jade = require( 'jade' );
const passport = require( "./config/passport" );
const session = require( "express-session" );

const PORT = process.env.PORT || 3000;

// =============================================================
// NEEDED FOR PASSPORT

// Creating express app and configuring middleware needed for authentication
app.use( bodyParser.urlencoded( {
  extended: false
} ) );
app.use( bodyParser.text() );
app.use( bodyParser.json( {
  type: "application/vnd.api+json"
} ) );
app.use( express.static( "public" ) );
app.set( 'view engine', 'jade' );
// We need to use sessions to keep track of our user's login status
app.use( session( {
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true
} ) );
app.use( passport.initialize() );
app.use( passport.session() );

// Requiring our routes
require( "./routes/html-routes.js" )( app );
require( "./routes/api-routes.js" )( app );

// =============================================================

// Routes
// =============================================================
const routes = require( "./config/routes.js" )
// app.use( "/", routes );
app.use( "/", router, routes );

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync( {
  // force: true,
  // force makes the db drop and recreate everytime you start the server
  logging: true

} ).then( function () {
  app.listen( PORT, function () {
    chalkAnimation.rainbow( "App listening on port " + PORT + "!" );
  } );
} );

db.Donation.belongsTo( db.Donor );
db.Donor.hasMany( db.Donation );
db.Comment.belongsTo( db.User );
db.User.hasMany( db.Comment );
db.Volunteer.belongsTo( db.User );
db.Donor.belongsTo( db.User );
db.Destination.belongsTo( db.User );
db.Volunteer.hasMany( db.Donation );
db.Destination.hasMany( db.Donation )