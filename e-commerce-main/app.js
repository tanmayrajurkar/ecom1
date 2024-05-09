const express = require('express');
const passport = require('passport');
const session = require('cookie-session');
require('dotenv').config();

const app = express();


// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define routes and middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));



// Set up routes
require('./auth');
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
    passport.authenticate('google', { 
        successRedirect: '/product',
        failureRedirect: '/contact'
     }),
 
);

// app.get('/profile', (req, res) => {
//     // Access user data from req.user and render the profile page
//     if(req.isAuthenticated()){
//      //console.log("This is user: ", req.user);
//       res.render('profile', { user: req.user });
//     }
//     else{
//       res.redirect('/product')
//     }
// });

app.get('/login', (req, res) => {

    res.render("signin", { message: null });

})

app.post('/auth/login', 
    passport.authenticate('local'),
    function(req, res) {
      // console.log(req.user);
      if(req.user["message"]){
        message = req.user
        // console.log(message);
        res.redirect('/product');
        // res.render("signin", { message });
      }
      else{
       //console.log("User data at line 66: ", req.user);
        res.redirect('/product');
      }
});


// Render the home page from views
const ProductRouter = require("./routes/product");
app.use("/product", ProductRouter);

app.get("/", (req, res) => {
  res.redirect('/product')
})


const CartRouter = require("./routes/userCart");
app.use("/cart", CartRouter);


const RegisterRouter = require("./routes/userRegister");
app.use("/register", RegisterRouter);

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/product');
})

app.get("/about", (req, res) => {
  const user = req.user;
  res.render('about', { user })
})


app.get("/contact", (req, res) => {
  const user = req.user;
  res.render('contact', { user })
})


const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
