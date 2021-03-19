const dotenv = require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

mongoose.set('useCreateIndex', true);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cors());
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.set('useFindAndModify', false);

function connectDB(){
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@cityexpress.1vkul.mongodb.net/cityExpressDb?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
      if(err){
        console.log(`Mongo Connection Error:\n\t${err}`);
        connectDB();
      }
    });
}
connectDB();

let rand;
function genRandom(){
    rand = Math.floor(Math.random()*1000000 + 9999999);
    if(rand.toString().length === 8){
        return rand;
    }else{
        genRandom();
    }
}

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    cart: Array,
    forms: Array
});
userSchema.plugin(passportLocalMongoose);
const formSchema = new mongoose.Schema({
    service: String,
    responses: Array
});

const User = new mongoose.model("User", userSchema);
const Form = new mongoose.model("Form", formSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let redirect = '/';
let arr = ['bank', 'bills', 'business', 'contact', 'donation', 'insurance', 'jobs', 'pickdrop', 'property', 'repair', 'ticket'];

app.get("/", (req, res) => {
    res.render("index");
});
app.get('/login', (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/userProfile');
    }
    res.render('login', {alreadyExists: false});
});
app.get('/userProfile', (req, res) => {
    User.findOne({email: req.user.email}, (err, result) => {
        if(err){
            console.log(`Dashboard data fetching error: \n\t${err}`)
            res.redirect('/500');
        }else{
            console.log(result);
            res.render('userProfile', {data: result});
        }
    });
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});
app.get('/500', (req, res) => {
    res.render('errors/serverError');
});
app.get('/404', (req, res) => {
    res.render('errors/notFound');
})
app.get('/:service', (req, res) => {
    if(!arr.includes(req.params.service)){
        return res.redirect('/404');
    }
    if(!req.isAuthenticated()){
        redirect = `/${req.params.service}`;
        return res.redirect('/login');
    }
    res.render(req.params.service);
});
app.get('*', (req, res) => {
    res.redirect('/404');
});


app.post('/signup', (req, res) => {
    User.exists({email: req.body.email}, (err, result) => {
        if(err){
          console.log(`Checking of DB for checking if User Already Exists Error: \n\t${err}`);
          return res.redirect('/500');
        }else{
            if(result){
                return res.render('login', {alreadyExists: true});
            }else{
                User.register({email: req.body.email, cart: [], forms: [], username: req.body.username}, req.body.password, (err, user) => {
                    if(err){
                      console.log(`User Registration Through Passport Error: \n\t${err}`);
                      res.redirect("/500");
                    }else{
                      passport.authenticate('local')(req, res, () => {
                        res.redirect(redirect);
                      });
                    }
                });
            }
        }
    });
});
app.post('/login', (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect("/");
    }
    User.findOne({username: req.body.username}, (err, result) => {
        if(err){
          console.log(`Searching of DB at the time of Login Error: \n\t${err}`);
          return res.redirect('/500');
        }else{
          if(!result){
            return res.render('login', {userNotFound: true})
        }else{
            const user = new User({
              username: req.body.username,
              password: req.body.password
            });
            req.login(user, (err) =>  {
              if(err){
                console.log(`Login with req.login method of Passport Error: \n\t${err}`);
                res.redirect('/500');
              }else{
                passport.authenticate('local')(req, res, () => {
                  res.redirect(redirect);
                });
              }
            });   
          }
        }
    });
});

app.post('/:service', (req, res) => {
    let today = new Date();
    console.log(today);
    Form.exists({service: req.params.service}, (err, result) => {
        if(err){
            console.log(`Searching of DB at the time of posting Services Data: \n\t${err}`);
            return res.redirect('/500');
        }else{
            if(result){
                Form.findOneAndUpdate({service: req.params.service}, {$push: {responses: {userId: req.user.id, serviceId: genRandom(), date: `${today.getDay()}/${today.getMonth()}/${today.getFullYear()}`, ...req.body}}}, (error) => {
                    if(error){
                        console.log(`Data Updation Error During Create New Response: ${error}`);
                        res.redirect('/500');
                      }else{
                        User.findOneAndUpdate({email: req.user.email}, {$push: {forms: {serviceId: rand, date: `${today.getDay()}/${today.getMonth()}/${today.getFullYear()}`, ...req.body}}}, (error) => {
                            if(error){
                                console.log(`Data Updation Error During Create New Response: ${error}`);
                                res.redirect('/500');
                            }else{
                                res.redirect('/');
                            }
                        });
                    }
                });
            }else{
                Form.create({service: req.params.service, responses: [{userId: req.user.id, serviceId: genRandom(), date: `${today.getDay()}/${today.getMonth()}/${today.getFullYear()}`, ...req.body}]},(error, id) => {
                    if(error){
                      console.log(`Data Creation Error During Create New Msg: ${error}`);
                      res.redirect('/500');
                    }else{
                        User.findOneAndUpdate({email: req.user.email}, {$push: {forms: {serviceId: rand, date: `${today.getDay()}/${today.getMonth()}/${today.getFullYear()}`, ...req.body}}}, (error) => {
                            if(error){
                                console.log(`Data Updation Error During Create New Response: ${error}`);
                                res.redirect('/500');
                            }else{
                                res.redirect('/');
                            }
                        });
                    }
                })
            }
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started at port 3000");
});

