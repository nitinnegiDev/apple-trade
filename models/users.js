const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const usersSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    age: Number,
    phone: {
        type: Number,
        required: [true, "phone number is required"]
    },
    email: String,
    address: {
        type: String,
        required: [true, "address is required"]
    },
    accounts: [{
        type: Schema.Types.ObjectId,
        ref: "Apples"
    }],
    pendingPayment: Number,
    billsGenerated: Number,
    billsSettled: {
        type: Number,
        default: 0
    }
})

usersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Users", usersSchema);
