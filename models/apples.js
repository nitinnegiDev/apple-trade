const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applesSchema = new Schema({
    owner: {
        type: String,
        required: [true, "name is required"]
    },
    age: Number,
    contact: {
        type: Number,
        required: [true, "contact number is required"]
    },
    address: String,
    lot: [{
        _id: { _id: false },
        marka: {
            type: String,
            required: [true, "marka is required"]
        },
        variety: String,
        nugsInfo: {
            xl: { type: Number, min: [1, "number of boxes must be greater than 1"] },
            l: { type: Number, min: [1, "number of boxes must be greater than 1"] },
            m: { type: Number, min: [1, "number of boxes must be greater than 1"] },
            s: { type: Number, min: [1, "number of boxes must be greater than 1"] },
            xs: { type: Number, min: [1, "number of boxes must be greater than 1"] },
            xxs: { type: Number, min: [1, "number of boxes must be greater than 1"] },
            "6l": { type: Number, min: [1, "number of boxes must be greater than 1"] },
            "7l": { type: Number, min: [1, "number of boxes must be greater than 1"] }
        },
        billingOn: Date,
        totalPayable: {
            type: Number,
            min: [0, "invoice amount can't be negative"]
        },
        isSettled: {
            type: Boolean,
            default: false
        }
    }],
    aadti: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    }
});

applesSchema.pre("findOneAndDelete", function (next) {
    console.log("deleting a record...");
    next();
})

module.exports = mongoose.model("Apples", applesSchema);