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

    update = async (id, data) => {
        return await UserModel.updateOne({_id: id}, data)
    }

    updatePass = async (id, password) => {
        return await UserModel.updateOne({_id: id}, {$set: {password: password}})
    }

    updateUserConection = async (id, date) => {
        return await UserModel.updateOne({_id: id}, {$set: {lastConecction: date}})
    }

    changeUserRole = async (uid) => {
        const user = await UserModel.findOne({_id: uid});
        await UserModel.updateOne({_id: uid}, {$set: {role: "premium"}});
        return {status: "success", newRole: "premium"};
    };

    delete = async (id) => {
        return await UserModel.deleteOne({_id: id})
    }

    deleteMany = async (cond) => {
        return await UserModel.deleteMany(cond)
    }

    addDoc = async (uid, docName, path) =>{
        try {
            const user = await UserModel.findOne({_id: uid});
            user.documents.push({name: docName, reference: path});
            user.save();
        } catch (error) {
            console.log(error);
        }
    }

    updateDoc = async (uid, index, docName, path) =>{
        try {
            const user = await UserModel.findOne({_id: uid});
            user.documents[index] = {name: docName, reference: path};
            user.save();
        } catch (error) {
            console.log(error);
        }
    }
}