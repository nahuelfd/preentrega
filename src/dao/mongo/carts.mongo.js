import CartModel from "./models/cart.model.js"

export default class Product {
    constructor() {}

    get = async() => {
        return await CartModel.find().lean().exec()
    }


    create = async(data) => {
        await CartModel.create(data)
        return true
    }

    getById = async (id) => {
        return await CartModel.findOne({_id: id})
    }

    getByIdLean = async (id) => {
        return await CartModel.findOne({_id: id}).lean()
    }

    createTik = async(data) => {
        return await TicketModel.create(data)     
    }

    getTik = async(code) => {
        return await TicketModel.findOne({code}).lean().exec()
    }

}