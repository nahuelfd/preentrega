import ProductModel from "./models/products.model.js"

export default class Product {
    constructor() {}

    get = async() => {
        return await ProductModel.find().lean().exec()
    }

    getPaginate = async(search, options) => {
        return await ProductModel.paginate(search, options)
    }

    create = async(data) => {
        await ProductModel.create(data)
        return true
    }

    getById = async (id) => {
        return await ProductModel.findOne({_id: id})    
    }

    delete = async (id) => {
        return await ProductModel.deleteOne({_id: id})
    }

    
}