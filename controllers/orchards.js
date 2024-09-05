const Users = require("../models/users");
const Apples = require("../models/apples");
const { expressError } = require("../utils/javascripts/expressError");

module.exports.index = async (req, res, next) => {
    const { owner } = req.query;
    const aadti = await Users.findById(req.user._id).populate("accounts");
    let orchards;
    if (owner) {
        orchards = aadti.accounts.filter((acc) => acc.owner === owner);
        if (!orchards.length) {
            return next(new expressError(404, "No records found, make sure to search with full name"));
        }
    } else {
        orchards = aadti.accounts;
    }
    res.render("index", { orchards, aadti });
}

module.exports.renderNewForm = (req, res) => {
    res.render("new");
}

module.exports.createRecord = async (req, res) => {
    const { orchard, variety, marka, nugsInfo } = req.body;
    const lot = { variety, marka, nugsInfo, submittedOn: Date.now() }

    let newLot = new Apples({ ...orchard, aadti: req.user._id });
    newLot.lot.push(lot);
    await newLot.save();

    const user = await Users.findById(req.user._id);
    user.accounts.push(newLot);
    await user.save();

    res.redirect(`/records/${newLot._id}`);
}

module.exports.showRecord = async (req, res, next) => {
    const { id } = req.params;
    const orchard = await Apples.findById(id);
    if (!orchard) {
        return next(new expressError(404, "Record does not exist"));
    }
    res.render("show", { orchard });
}

module.exports.renderEditPage = async (req, res) => {
    const orchard = await Apples.findById(req.params.id);
    if (!orchard) {
        return next(new expressError(404, "Record not found"));
    }
    res.render("edit", { orchard });
}


const updateAadtiInfo = async (recordId, aadti) => {
    const orchard = await Apples.findById(recordId);

    let totalPayment = 0;
    let totalBills = 0;
    orchard.lot.forEach((lot) => {
        if (lot.totalPayable) {
            totalPayment += lot.totalPayable;
            totalBills += 1;
        }
    })
    aadti.pendingPayment -= totalPayment;
    aadti.billsGenerated -= totalBills;
}

module.exports.deleteRecord = async (req, res, next) => {
    const { id } = req.params;
    const aadti = await Users.findById(req.user._id);

    await updateAadtiInfo(id, aadti);

    const index = aadti.accounts.indexOf(id);
    if (index >= 0) {
        aadti.accounts.splice(index, 1);
    } else {
        return next(new expressError(400, "invalid action"))
    }

    await Apples.findByIdAndDelete(id);
    await aadti.save();
    res.redirect("/records");
}