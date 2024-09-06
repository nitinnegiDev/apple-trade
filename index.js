require("dotenv").config();

const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");

const { connectDb, dbUrl } = require("./connectDb");
connectDb();

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const secret = process.env.SECRET || "thisismynotsogoodsecret";
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on("error", function (err) {
    console.log("SESSION STORE ERROR!!!", err);
})

const sessionConfig = {
    store,
    name: "session",
    cookie: {
        httpOnly: true, //for xss security
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 100 * 60 * 60 * 24
    },
    secret,
    saveUninitialized: true,
    resave: false
}

const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");

const recordsRouter = require("./routes/orchards");
const nugsRouter = require("./routes/nugs");
const userRouter = require("./routes/user")

const Users = require("./models/users");
const { expressError } = require("./utils/javascripts/expressError");
const e = require("connect-flash");
const appPort = 3000;

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use((req, res, next) => {
    res.locals.path = req.path;
    res.locals.originalUrl = req.originalUrl;
    res.locals.activeUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/", (req, res, next) => {
    res.redirect("/user/login");
})
app.use("/user", userRouter);
app.use("/records", recordsRouter);
app.use("/records/:id/nugs", nugsRouter);

app.use((req, res, next) => {
    return next(new expressError(404, "PAGE NOT FOUND"));
})

app.use((err, req, res, next) => {
    console.log(err.status, err);
    res.render("error", { err });
})

app.listen(appPort, (err) => {
    if (err) console.log(err);
    console.log(`listening on port ${appPort}`)
})
