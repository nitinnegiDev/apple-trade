const Apples = require("../models/apples");
const { catchAsyncErrors } = require("../utils/javascripts/catchAsyncErrors");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.user) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "not logged in");
        return res.redirect("/user/login");
    }
    next();
}

module.exports.isAuthor = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const record = await Apples.findById(id);
    if (!record) {
        req.flash("error", "invalid input");
        return res.redirect("/records");
    }
    if (!record.aadti.equals(req.user._id)) {
        req.flash("error", "permission denied");
        return res.redirect("/records");
    }
    next();
})

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
