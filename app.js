const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/cart', (req, res) => {
    res.render('cart');
});

app.post('/signup', (req, res) => {
    console.log(req.body);
});
app.post('/login', (req, res) => {
    console.log(req.body);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started at port 3000");
});

