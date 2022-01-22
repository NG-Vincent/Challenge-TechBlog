// config
require("dotenv").config();
// express server general
const express = require("express");
const path = require("path");
const routes = require("./controllers");
// database
const sequelize = require("./config/connection");
// handlebars
const exphbs = require("express-handlebars");
const helpers = require("./utils/helpers");
const hbs = exphbs.create({ extname: ".hbs", helpers });
// session
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
   secret: process.env.SESSION_SECRET,
   cookie: {},
   resave: false,
   saveUninitialized: true,
   store: new SequelizeStore({
      db: sequelize,
   }),
};

// ----------------------------------------------------------------
// run server
const app = express();
const PORT = process.env.PORT || 3001;
// session
app.use(session(sess));
// general
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

// handlebars
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// turn on connection to database and server
sequelize.sync({ force: false }).then(() => {
   app.listen(PORT, () => console.log("Now listening"));
});
