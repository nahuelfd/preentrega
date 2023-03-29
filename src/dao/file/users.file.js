import FileManager from "./file_manager.js"

export default class User {

    constructor(){
        this.fileManager = new FileManager("db_file/carts.json")
    }

    get = async() => {
        return await this.FileManager.get()
    }

    getOneByID = async(id) => {
        return await this.fileManager.getOneByParam("id", id)
    }

    getOneByEmail = async(email) => {
        return await this.fileManager.getOneByParam("email", email)
    }

    create = async(data) => {
        return await this.fileManager.add(data)
    }
    
}
