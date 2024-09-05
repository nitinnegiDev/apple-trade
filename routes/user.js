const express = require("express");
const userRouter = express.Router({ mergeParams: true });
const { catchAsyncErrors } = require("../utils/javascripts/catchAsyncErrors");
const passport = require("passport");
const { storeReturnTo, isLoggedIn } = require("./middleware");
const user = require("../controllers/user");

userRouter.get("/profile", isLoggedIn, catchAsyncErrors(user.viewProfilePage));

userRouter.route("/profile/edit")
    .get(isLoggedIn, catchAsyncErrors(user.renderEditProfilePage))
    .post(isLoggedIn, catchAsyncErrors(user.editProfile))

userRouter.route("/register")
    .get(user.renderRegForm)
    .post(catchAsyncErrors(user.register))

userRouter.route("/login")
    .get(user.renderLoginForm)
    .post(storeReturnTo, passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/user/login"
    }), user.login)

userRouter.get("/logout", user.logout)

userRouter.get("/resetPassword", user.renderPassUpdateForm);
userRouter.post("/resetPassword", catchAsyncErrors(user.updatePassword));

module.exports = userRouter;