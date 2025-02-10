if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
// console.log(process.env.SECRETE);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const { isLoggedIn, isOwner, valiadteListing } = require("./middleware.js");
const famaily = require("./models/famaily");
const commu = require("./models/communication.js");


const passport = require('passport');
const LocalStrategy = require('passport-local');
const  User = require('./models/user.js');


//require routes
const listingsRouter = require('./routes/listings.js');
const userRouter = require('./routes/user.js');
const wrapAsync = require('./utils/wrapAsync.js');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); //to parse data
app.set("view engine", "ejs"); //set view engine
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); //set ejs engine
app.use(express.static(path.join(__dirname, "/public"))); //serve static files

//connect database
const MONGO_URL = "mongodb://127.0.0.1:27017/homeheavens"; //use url of your database

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

//associate session
const sessionOptions ={
  secret: "mysecretecode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+ 7*24*60*60*1000,  //after 7*24*60*60*1000 ms from now i.e. 7 days
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  }
};

// //home route
// app.get("/", (req, res) => {
//   res.send("hello from backend");
// });

app.use(session(sessionOptions));
app.use(flash());

//authentication and authorization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//create res.local variable
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

//routes
app.use('/listings',listingsRouter);
app.use('/',userRouter);
app.use("/start",(req,res)=>{
  res.render("start.ejs")
})
app.post("/listings/start",(req,res)=>{
  res.redirect("/login")
})
app.post("/listings/task",isLoggedIn,(req,res)=>{
  res.render("task.ejs");
})
app.post("/listings/health",isLoggedIn,(req,res)=>{
  res.render("health.ejs");
})
app.post("/listings/emergency",isLoggedIn,async(req,res)=>{
  const allFamilies = await famaily.find({});
  console.log(allFamilies);
  res.render("emergency.ejs",{allFamilies});
})

app.post("/listings/emergency/new",isLoggedIn, async (req,res)=>{
  let {name,relation,phone} = req.body;
  let newListing = new famaily();
  newListing.name = name;
  newListing.relation = relation;
  newListing.phone = phone;
  await newListing.save();
  req.flash("success", "New Listing Saved"); //create flash for temporory message
  res.redirect("/listings");
})

app.get("/listings/emergency",isLoggedIn,async(req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id)
  console.log("emergency.ejs");
})
app.post("/listings/communication",isLoggedIn,async(req,res)=>{
  const allcommus = await commu.find({});
  res.render("communication.ejs",{allcommus});
})

app.post("/listings/communication/new",isLoggedIn,async(req,res)=>{
  let {name,phone} = req.body;
  let newListing = new commu();
  newListing.name = name;
  newListing.phone = phone;
  await newListing.save();
  res.redirect("/listings/communication");
})
//invalid page request
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message)
});

app.listen(8080, () => {
  console.log(`Server ruuning on http://localhost:8080`);
});
