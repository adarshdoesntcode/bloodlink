const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require("bcryptjs");

//Defining the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
    },
    age: {
        type: Number,
        // required: [true, "Please, enter your age!"],
    },
    sex: {
        type: String,
        // required: [true, "Please enter your sex!"],
    },
    phoneNumber: {
        type: Number,
        required: [true, "Please enter your phone number!"],
    },
    bloodGroup: {
        type: String,
        required: [true, "Please enter your blood group!"],
    },
    
    address: {
        type: String,
            // required: true
        },
    longitude: {
        type: String,
            // required: true
    },
    latitude: {
        type: String,
            // required: true
    },
    
    //need to add verificationRecord report , photo of citizenship card or license or passport

    email: {
        type: String,
        required: [true, "Please your calid email address!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!!!'],
    },
    photo: String,
    role: {
        type: String,
        required: [true, 'Please enter your role'],
        default: 'recipient',
        enum: ['recipient', 'donor']
    },
    status: {
        type: String,
        required: true,
        default: 'UNVERIFIED',
        enum: ['UNVERIFIED', 'VERIFIED']
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        // required: [true, "Please confirm your password!"],
        // validate: {
        //     validator: function(el) {
        //         return el === this.password;
        //     },
        //     message: "Password are not same"
        // }
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    timeStamps: {
        type: Date,
        timestamps: true,
    },
}, {
    timestamps: true,
});

//Password encryption is important and is related to the data-model so we define a pre-save middleware that handles the password-encryption 
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    console.log('password hashing successful');

    //delete passwordCoform field 
    this.passwordConfirm = undefined;
    next();
});



//To check whether the the given provided candidatePassword and user-password in the database are same or not
//also useful while changing the password where we provide the current password and new password where the current password is matched to the password in the database before updating with the new password 
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

//creating a model
const User = mongoose.model('User', userSchema);
module.exports = User;