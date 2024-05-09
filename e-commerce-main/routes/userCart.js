const express = require('express');
const router = express.Router();
const { AddToCart, removeFromCart, deleteUser } = require('../models/cart');
const { getItemIds } = require('../models/cartitems')
const { UpdateUser } = require('../models/UpdateUser');



router.post('/', async (req, res) => {
    console.log(req.body);
    console.log(req.user);
    const userId = req.user["_id"];
    const productId = parseInt(req.body["productId"]);
    const quantity = parseInt(req.body["quantity"]);
    const addedtocart = await AddToCart(userId, productId, quantity);
    res.redirect('/product?category=smartphones');
    // res.render("cart")
})

router.get('/items', async (req, res) => {
    const user = req.user;
    // console.log("user from line 21 of userCart", user);
    if(req.isAuthenticated()){
        let CartItems = await getItemIds(req.user["_id"]);
        // console.log(Object.keys(CartItems).length);
        if((CartItems !== null) && Object.keys(CartItems).length === parseInt(0)){
          CartItems = null;
          // console.log(CartItems);
        }
        res.render("cart", { user, CartItems });
      }
      else{
        res.redirect('/product')
      }
});


router.get('/remove?', async (req,res) => {
    const productId = req.query.id;
    if(productId){
        const user = req.user;
        await removeFromCart(user["_id"], productId);
        res.redirect('/cart/items');
    }
})


router.get('/checkout', async (req, res) => {
    if(req.isAuthenticated()){
      const user = req.user;
      console.log("user from line 35 of userCart", user);
      const CartItems = await getItemIds(req.user["_id"]);
      if(CartItems === null ){
        res.render("cart", { user, CartItems });
      }
      else if(CartItems.length === 0 ){
        res.render("cart", { user, CartItems });
      }
      else{
        res.render("checkout", { user, CartItems });
      }
    }
    else{
      res.render("signin");
    }
})


router.post('/order', async (req, res) => {
    const user = req.user;
    const { phonenumber, AddressLine1, AddressLine2, postcode, town } = req.body
    console.log( phonenumber, AddressLine1, AddressLine2, postcode, town );
    const fieldsToUpdate = {
      PhoneNumber: phonenumber,
      AddressLine1: AddressLine1,
      AddressLine2: AddressLine2,
      PostalCode: postcode,
      Town: town
    };
    const userUpdated = await UpdateUser( user["_id"], fieldsToUpdate );

    req.login(userUpdated, async (err) => {
      if (err) {
          return res.redirect('/product');
      }
      else{

        const deletelement = await deleteUser(user["_id"]);

        return res.render('order_confirmation', { user }); // Redirect to the user's profile or dashboard
      }
  });

})


module.exports = router