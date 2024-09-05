const Users = require("../models/users")
const Apples = require("../models/apples");
const { expressError } = require("../utils/javascripts/expressError");

module.exports.viewProfilePage = async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    res.render("user/profile", { user });
}

module.exports.renderEditProfilePage = async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    res.render("user/editProfile", { user });
}

module.exports.editProfile = async (req, res, next) => {
    const { name, age, phone, email, address } = req.body;
    const user = await Users.findById(req.user._id);
    if (!user) {
        return next(new expressError(401, "unable to edit the profile"))
    }
    user.name = name;
    user.age = age;
    user.phone = phone;
    user.email = email;
    user.address = address;

    await user.save();

    req.flash("success", "Profile info saved");
    res.redirect("/user/profile");
}

module.exports.renderRegForm = (req, res) => {
    res.render("user/register");
}

module.exports.register = async (req, res, next) => {
    const { firstName, lastName, age, phone, email, shopNo, city, state, username, password } = req.body;

    const user = new Users({
        name: `${firstName} ${lastName}`,
        age,
        phone,
        email,
        address: `${shopNo}, ${city}, ${state}`,
        username
    });
    const registeredUser = await Users.register(user, password);

    req.login(registeredUser, async (err) => {
        if (err) {
            return next(new expressError(401, "Failed to login !!! Please try again."))
        }
        req.flash("success", `Welcome ${user.name}, Please add a record to proceed`);
        return res.redirect("/records/new");
    })
}

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login");
}

module.exports.login = async (req, res) => {
    const { username } = req.body;
    req.flash("success", `welcome back ${username}`);

    const redirectUrl = res.locals.returnTo || "/records";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "Logged out");
            res.redirect("/user/login");
        }
    });
}

module.exports.renderPassUpdateForm = (req, res) => {
    res.render("user/resetPassword");
}

module.exports.updatePassword = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });
    console.log("updating password for username ", username);
    await user.setPassword(password);
    await user.save();
    req.flash("success", "password updated, login with new credentials");
    res.redirect("/user/login");
}