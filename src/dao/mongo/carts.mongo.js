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


}