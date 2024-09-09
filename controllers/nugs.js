const Apples = require("../models/apples");
const Users = require("../models/users");
const expressError = require("../utils/javascripts/expressError");

module.exports.renderNewForm = async (req, res) => {
    const orchard = await Apples.findById(req.params.id);
    res.render("nug/new", { orchard });
}

module.exports.addNewLot = async (req, res) => {
    const { variety, marka, nugsInfo } = req.body;

    const orchard = await Apples.findById(req.params.id);
    if (!orchard) {
        return next(new expressError(404, "Record not found"));
    }

    const lot = { variety, marka, nugsInfo, submittedOn: Date.now() };
    orchard.lot.push(lot);
    await orchard.save();
    res.redirect(`/records/${orchard._id}/edit`);
}

module.exports.renderPersonInfoForm = async (req, res, next) => {
    const { id } = req.params;
    const orchard = await Apples.findById(id);
    if (!orchard) {
        return next(new expressError(404, "record does not exist"));
    }
    res.render("nug/editInfo.ejs", { orchard });
}

module.exports.updatePersonInfo = async (req, res, next) => {
    const { owner, age, contact, address } = req.body;
    const { id } = req.params;
    let orchard = await Apples.findById(id);
    if (!orchard) {
        return next(new expressError(400, "Not able to edit personal information"));
    }
    orchard.owner = owner;
    orchard.age = age;
    orchard.contact = contact;
    orchard.address = address;
    await orchard.save();
    res.redirect(`/records/${orchard._id}/edit`);
}

module.exports.renderLotDetailsForm = async (req, res, next) => {
    const { id, index } = req.params;
    const editIndex = parseInt(index);
    const orchard = await Apples.findById(id);
    if (isNaN(editIndex)) {
        return next(new expressError(400, "Unable to delete, invalid input"));
    }
    if (!orchard) {
        return next(new expressError(404, "Record not found"));
    }
    res.render("nug/edit", { orchard, editIndex });
}

module.exports.updateLotDetails = async (req, res) => {
    const { id, index } = req.params;
    const editIndex = parseInt(index);
    const orchard = await Apples.findById(id);
    if (isNaN(editIndex)) {
        return next(new expressError(400, "Unable to delete, invalid input"));
    }
    if (!orchard) {
        return next(new expressError(404, "Record not found"));
    }
    const { variety, marka, nugsInfo } = req.body;
    console.log(req.body);

    const lot = { variety, marka, nugsInfo };
    orchard.lot[editIndex] = lot;
    await orchard.save();
    res.redirect(`/records/${orchard._id}/edit`);
}

const updatePendingPayment = async (lot, aadtiId) => {
    const aadti = await Users.findById(aadtiId);
    aadti.pendingPayment -= lot.totalPayable;
    aadti.billsGenerated -= 1;
    await aadti.save();
}

module.exports.deleteLot = async (req, res, next) => {
    const { id, index } = req.params;
    const orchard = await Apples.findById(id);
    if (!orchard) {
        return next(new expressError(404, "Record not found"));
    }
    if (index < 0 && index > orchard.lot.length) {
        return next(new expressError(400, "Unable to delete"));
    }
    await updatePendingPayment(orchard.lot[index], req.user._id);
    orchard.lot.splice(index, 1);
    await orchard.save();

    res.redirect(`/records/${orchard._id}/edit`);
}

module.exports.toggleBillStatus = async (req, res, next) => {
    const { id, index } = req.params;

    const aadti = await Users.findById(req.user._id);
    const orchard = await Apples.findById(id);

    orchard.lot[index].isSettled = !orchard.lot[index].isSettled;
    if (orchard.lot[index].isSettled) {
        aadti.pendingPayment -= orchard.lot[index].totalPayable;
        aadti.billsSettled += 1;
    } else {
        aadti.pendingPayment += orchard.lot[index].totalPayable;
        aadti.billsSettled -= 1;
    }

    await orchard.save();
    await aadti.save();
    res.redirect(`/records/${id}`);
}

module.exports.generateInvoice = async (req, res, next) => {
    const { id, index } = req.params;
    const orchard = await Apples.findById(id).populate("aadti");

    const lot = orchard.lot[index];
    if (!lot) {
        req.flash("error", "unable to generate bill for the lot");
        return res.redirect(`/records/${id}`);
    }
    res.render("nug/invoice", { orchard, lot, index });
}

module.exports.saveInvoice = async (req, res, next) => {
    const { id, index } = req.params;
    let { totalPayable } = req.body;
    if (!totalPayable || totalPayable < 0) {
        req.flash("error", "bill amount is not valid");
        return res.redirect("back");
    }
    totalPayable = parseInt(totalPayable);

    const orchard = await Apples.findById(id);
    const lot = orchard.lot[index];

    const aadti = await Users.findById(req.user._id);
    if (lot.totalPayable) {
        if (!lot.isSettled) {
            aadti.pendingPayment += totalPayable - lot.totalPayable;
        } else {
            aadti.pendingPayment += totalPayable;
            lot.isSettled = false;
            aadti.billsSettled -= 1;
        }
    } else {
        if (!aadti.pendingPayment && aadti.pendingPayment !== 0) {
            aadti.pendingPayment = 0;
            aadti.billsGenerated = 0;
        }
        aadti.pendingPayment += totalPayable;
        aadti.billsGenerated += 1;
    }
    lot.totalPayable = totalPayable;
    lot.billingOn = Date.now();

    await orchard.save();
    await aadti.save();

    res.redirect(`/records/${id}`);
}