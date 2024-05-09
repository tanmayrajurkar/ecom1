const express = require('express');
const mongoose = require("mongoose");
const { connectToDatabase } = require("../connect")

const cartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users' // Reference to the User collection
    },
    productInfo: [{
      productId: Number,
      quantity: Number
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

const AddToCart = async (userId, productId, quantity) => {
    try{

        await connectToDatabase();
        
        if (await doesUserExist(userId, productId, quantity)) {
            
            return null;
        }
        else{
            if ( await doesProductExist(userId, productId, quantity)){
                console.log("Product Updated");
            }
            else{
                const updatedUser = await Cart.findOneAndUpdate(
                    { userId: userId},
                    { $push: { productInfo: { productId: productId, quantity: quantity } } },
                    { new: true }
                );
                //console.log('User updated:', updatedUser);
            }
            return null;
        }
        

    } catch (error) {
        console.error('Error retrieving products:', error);
        return null;
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
        console.log('Connection closed');
    }
}

const doesUserExist = async (userId, productId, quantity) => {
    try {
        const user = await Cart.findOne({ userId: userId });
        // console.log(user);
        if(user !== null) return false;
        else{
            let cartData = {
                userId: userId,
                productInfo: [{productId: productId, quantity:quantity}]
            }
            const newCart = new Cart(cartData);
            const savedUser = await newCart.save();
            //console.log("User created", savedUser);
            return true;
        }
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
}


const doesProductExist = async (userId, productId, quantity) => {
    try {
        const user = await Cart.findOne({userId: userId, productInfo: { $elemMatch: { productId: productId } } });
        if( user !== null ){
            for(let i=0; i<user["productInfo"].length; i++){
                if(user["productInfo"][i]["productId"] === productId){
                    user["productInfo"][i]["quantity"] = user["productInfo"][i]["quantity"] + quantity;
                    break;
                }
            }
            // console.log(user);
            await user.save();
        }
        return user !== null;
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
}


const removeFromCart = async (userid , productid) => {
    try{

        await connectToDatabase();
        
        const updatecart = await Cart.updateOne(
            { userId: userid },
            { $pull: { 'productInfo': { productId: productid } } },
            { new: true }
        )
        //console.log(updatecart);
        console.log("Cart Updated");

    } catch (error) {
        console.error('Error retrieving products:', error);
        return null;
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
        console.log('Connection closed');
    }
}

const deleteUser = async (userId) => {
    try{

        await connectToDatabase();
        const UserId = { userId: userId }
        const deleteelm = await Cart.findOneAndDelete(UserId);
        console.log("User Deleted");

    } catch (error) {
        console.error('Error retrieving products:', error);
        return null;
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
        console.log('Connection closed');
    }
}


// removeFromCart('64d4b8af57d83c5b832799c0', 2);

// AddToCart('64d4b8af57d83c5b832799c0', 3, 5);
module.exports = { 
    Cart,
    AddToCart,
    doesUserExist,
    removeFromCart,
    deleteUser
};