const express = require('express');
const mongoose = require("mongoose");
const { connectToDatabase } = require("../connect")
const { product } = require('./productarr')


const getProducts = async () => {
    try {
        // Connect to the database
        // await connectToDatabase();

        // Directly access the "pratik" collection and retrieve data
        // const pratikCollection = mongoose.connection.collection('product');
        // const pratikData = await pratikCollection.find({}).toArray();

        const pratikData = product;

        return pratikData;
    } catch (error) {
        console.error('Error retrieving products:', error);
        return null;
    } finally {
        // Close the Mongoose connection
        // mongoose.connection.close();
        console.log('Connection closed');
    }
};


const getCategoryProducts = async (category) => {
    try{

        await connectToDatabase();
        const pratikCollection = mongoose.connection.collection('product');
        const categoryProducts = await pratikCollection.find({category}).toArray();

        return categoryProducts;


    } catch (error) {
        console.error('Error retrieving products:', error);
        return null;
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
        console.log('Connection closed');
    }
};



module.exports = {
    getProducts,
    getCategoryProducts
};