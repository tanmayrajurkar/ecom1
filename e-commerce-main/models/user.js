const mongoose = require("mongoose");
const { connectToDatabase } = require('../connect');


const userSchema = new mongoose.Schema({
    DisplayName: {
        type: String,
        required: true,
    },
    UserName: {
        type: String,
    },
    Password: {
        type: String,
    },
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    PhoneNumber: {
        type: String,
    },
    AddressLine1: {
        type: String,
    },
    AddressLine2: {
        type: String,
    },
    PostalCode: {
        type: String,
    },
    Town: {
        type: String,
    },
});

const User = mongoose.model('User', userSchema);


const CreateUser = async (userData) => {
    try{

        await connectToDatabase();

        if(userData["UserName"] !== undefined){
            if(await doesUserNameExist(userData["UserName"], userData["email"])) {
                return null;
            }
        }

        else{
            const douserexist = await doesUserExist(userData["FirstName"],userData["LastName"], userData["email"]);
            if(douserexist !== null){
                return douserexist;
            }
        }
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        console.log('User created:');
        return savedUser;

        
        

    } catch (error) {
        console.error('Error retrieving products:', error);
        return null;
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
        console.log('Connection closed');
    }
}



const doesUserExist = async (firstname,lastname, email) => {
    try {
        const user = await User.findOne({ $and: [{ FirstName: firstname }, { LastName: lastname }, { email: email }] });
        // console.log(user);
        return user;
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
}


const doesUserNameExist = async (username, email) => {
    try {
        const user = await User.findOne({ $or: [{ UserName: username }, { email: email }] });
        // console.log(user);
        return user !== null;
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
}
// const userData = {
    //     DisplayName: 'Pratik PAl',
    //     FirstName: 'Pratik',
    //     LastName: 'Pal',
    //     email: 'john@example.com',
    //   };
    
    // CreateUser(userData);
module.exports = { 
    User,
    CreateUser
};
