const express = require("express");
const nugsRouter = express.Router({ mergeParams: true });
const { catchAsyncErrors } = require("../utils/javascripts/catchAsyncErrors");
const { isLoggedIn, isAuthor } = require("./middleware");
const nugs = require("../controllers/nugs");

nugsRouter.get("/new", isLoggedIn, isAuthor, catchAsyncErrors(nugs.renderNewForm))
nugsRouter.post("/", isLoggedIn, isAuthor, catchAsyncErrors(nugs.addNewLot));

nugsRouter.route("/personInfo")
    .get(isLoggedIn, isAuthor, catchAsyncErrors(nugs.renderPersonInfoForm))
    .put(isLoggedIn, isAuthor, catchAsyncErrors(nugs.updatePersonInfo))

nugsRouter.route("/:index")
    .get(isLoggedIn, isAuthor, catchAsyncErrors(nugs.renderLotDetailsForm))
    .put(isLoggedIn, isAuthor, catchAsyncErrors(nugs.updateLotDetails))
    .delete(isLoggedIn, isAuthor, catchAsyncErrors(nugs.deleteLot))

nugsRouter.route("/:index/toggleBillStatus")
    .get(isLoggedIn, isAuthor, catchAsyncErrors(nugs.toggleBillStatus));

nugsRouter.route("/:index/generateInvoice")
    .get(isLoggedIn, isAuthor, catchAsyncErrors(nugs.generateInvoice))

nugsRouter.route("/:index/saveInvoice")
    .post(isLoggedIn, isAuthor, catchAsyncErrors(nugs.saveInvoice));

module.exports = nugsRouter;