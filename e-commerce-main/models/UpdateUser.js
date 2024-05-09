const mongoose = require("mongoose");
const { connectToDatabase } = require("../connect")
const { User } = require('./user')

const UpdateUser = async (userId, fieldsToUpdate) => {

    await connectToDatabase();

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id : userId },
            fieldsToUpdate,
            { new: true }
        );
        //console.log('User updated:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    } finally {
        // Close the Mongoose connection
        mongoose.connection.close();
        console.log('Connection closed');
    }
}

module.exports = {
    UpdateUser,
}

// const firstName = 'Pratik';
// const lastName = 'Pal';
// const userEmail = 'john@example.com';
// const fieldsToUpdate = {
//     UserName: 'a',
//     Password: 'a',
// };

// UpdateUser(firstName, lastName, userEmail, fieldsToUpdate);