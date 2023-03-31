import UserModel from "./models/user.model.js"
import { Router } from "express";
import CustomError from "../../services/errors/custom.error.js";
import EErrors from "../../services/errors/enums.js";
import { FirstNameError, LastNameError, EmailError } from "../../services/errors/info.js";

export default class User {
    constructor() {}

    get = async() => {
        return await UserModel.find()
    }

    create = async(data) => {
        if(!data.first_name){
            CustomError.createError({
                name: "FirstName error",
                cause: FirstNameError(),
                message: "Invalid or incomplete info",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        if(!data.last_name){
            CustomError.createError({
                name: "LastName error",
                cause: LastNameError(),
                message: "Invalid or incomplete info",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        if(!data.email){
            CustomError.createError({
                name: "Email error",
                cause: EmailError(),
                message: "Invalid or incomplete info",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        
        await UserModel.create(data)
        return true
    }

    getOneByID = async(id) => {
        return await UserModel.findById(id)
    }

    getOneByEmail = async(email) => {
        return await UserModel.findOne({ email }).lean().exec()
    }
}