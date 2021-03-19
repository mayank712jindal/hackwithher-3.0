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
app.get('/bank', (req, res) => {
    res.render('bank');
});
app.get('/bills', (req, res) => {
    res.render('bills');
});
app.get('/business', (req, res) => {
    res.render('business');
});
app.get('/donation', (req, res) => {
    res.render('donation');
});
app.get('/insurance', (req, res) => {
    res.render('insurance');
});
app.get('/jobs', (req, res) => {
    res.render('jobs');
});
app.get('/pickdrop', (req, res) => {
    res.render('pickdrop');
});
app.get('/property', (req, res) => {
    res.render('property');
});
app.get('/repair', (req, res) => {
    res.render('repair');
});
app.get('/ticket', (req, res) => {
    res.render('ticket');
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

