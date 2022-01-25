const express = require("express");
const dotenv = require("dotenv");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const logger = require("morgan");

// Database Connection integration
const { connectDB } = require("./config/connection");

//load config
dotenv.config({ path: "./config/config.env" });

//database connection establishing
connectDB();

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//setting up logger
app.use(logger("dev"));

//view engine setting
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.set("layout", "./layouts/layout");
app.set("view engine", ".hbs");
app.set("views", "./views");

//setting default static folder as public folder
app.use(express.static("./public"));

//sessions
app.use(
  session({
    secret: "top secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
//cache controller
// setting no cache
app.use((req, response,next) => {
  response.set("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  next();
});
//route setting
app.use("/", userRouter);
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 3200;
app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
