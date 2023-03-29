import MessageModel from "./models/message.model.js"

export default class Product {
    constructor() {}

    get = async() => {
        return await MessageModel.find().lean().exec()
    }


    create = async(data) => {
        await MessageModel.create(data)
        return true
    }

    
}