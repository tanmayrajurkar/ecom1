const mongoose = require("mongoose");
const  { Cart } = require("./cart")
const { connectToDatabase } = require("../connect")


const retriveProducts = async (ids) => {

    try{

        const pratikCollection = mongoose.connection.collection('product');
        const query = { id: { $in: ids } };
        const categoryProducts = await pratikCollection.find(query).toArray();

        // console.log(categoryProducts);
        return categoryProducts;


    } catch (error) {
        console.error('Error retrieving products:', error);
        return null;
    }

}

const getItemIds = async (userId) => {
    try{

        
        await connectToDatabase();

        const user = await doesUserExist(userId);
        
        if(user === null) return null;
        else{
            let idarr = [];
            user["productInfo"].forEach(element => {
                idarr.push(element["productId"]);
            });
            
            const cartProducts = await retriveProducts(idarr);
            
            cartProducts.forEach(element => {
                for(let i=0; i < user["productInfo"].length; i++){
                    if(element["id"] === user["productInfo"][i]["productId"]){
                        element["quantity"] = user["productInfo"][i]["quantity"];
                        break;
                    }
                }

            });
            
            return cartProducts;
        }

    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
        console.log('Connection closed');
    }
}


const doesUserExist = async (userId) => {
    try {
        const user = await Cart.findOne({ userId: userId });
        // console.log(user);
        return user;
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
}


module.exports = { 
    getItemIds,
};