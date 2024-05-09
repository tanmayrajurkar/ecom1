const express = require('express');
const router = express.Router();
const passport = require('passport');
const { CreateUser } = require('../models/user')



router.post('/', async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    console.log(firstname, lastname, username, email, password);

    const userData = {
        DisplayName: username,
        UserName: username,
        Password: password,
        FirstName: firstname,
        LastName: lastname,
        email: email,
    }

    const createuser = await CreateUser(userData);
    if(createuser === null ){
        const message = {message: "User or email already exists"}
        res.render("signin", { message });
    }

    else {
        req.login(createuser, err => {
            if (err) {
                return next(err);
            }
            return res.redirect('/'); // Redirect to the user's profile or dashboard
        });
    }

});




module.exports = router