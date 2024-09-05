const express = require("express");
const recordsRouter = express.Router();
const { catchAsyncErrors } = require("../utils/javascripts/catchAsyncErrors");
const { expressError } = require("../utils/javascripts/expressError");
const { isLoggedIn, isAuthor } = require("./middleware");
const orchards = require("../controllers/orchards");
const Joi = require("joi");

const validateRecord = (req, res, next) => {
    console.log(req.body);
    const appleSchema = Joi.object({
        orchard: Joi.object({
            owner: Joi.string().required(),
            age: Joi.number().min(5).max(120),
            contact: Joi.number().required().min(1000000000),
            address: Joi.string().required(),
        }).required(),
        marka: Joi.string().required(),
        variety: Joi.string().required(),
        nugsInfo: Joi.object().keys({
            xl: Joi.string().min(0).optional(),
            l: Joi.string().min(0).optional(),
            m: Joi.string().min(0).optional(),
            s: Joi.string().min(0).optional(),
            xs: Joi.string().min(0).optional(),
            xxs: Joi.string().min(0).optional(),
            "6l": Joi.string().min(0).optional(),
            "7l": Joi.string().min(0).optional()
        }).required(),
    })

    const { error } = appleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new expressError(400, msg);
    } else {
        return next();
    }
}

recordsRouter.route("/")
    .get(isLoggedIn, catchAsyncErrors(orchards.index))
    .post(isLoggedIn, validateRecord, catchAsyncErrors(orchards.createRecord))

recordsRouter.get("/new", isLoggedIn, orchards.renderNewForm);

recordsRouter.route("/:id")
    .get(isLoggedIn, isAuthor, catchAsyncErrors(orchards.showRecord))
    .delete(isLoggedIn, isAuthor, catchAsyncErrors(orchards.deleteRecord))

recordsRouter.get("/:id/edit", isLoggedIn, isAuthor, catchAsyncErrors(orchards.renderEditPage))


module.exports = recordsRouter;