import UserDTO from '../dao/DTO/users.dto.js'

export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    get = async() => {
        return await this.dao.get()
    }

    getOneByID = async(id) => {
        return await this.dao.getOneByID(id)
    }

    getOneByEmail = async(email) => {
        return await this.dao.getOneByEmail(email)
    }

    create = async(data) => {
        const dataToInsert = new UserDTO(data)

        return await this.dao.add(dataToInsert)
    }

    updateUser = async (id, password) => {
        return await this.dao.updatePass(id, password)
    }

    updateUserConection = async (id, date) => {
        return await this.dao.updateUserConection(id, date)
    }

    changeUserRole = async(uid) => {
        return await this.dao.changeUserRole(uid)
    }

    delete = async (id) => {
        return await this.dao.delete(id)
    }

    deleteMany = async (cond) => {
        return await this.dao.deleteMany(cond)
    }

    sendMail = async (email) => {
        const user = await this.getOneByEmail(email)
        
        const token = generateToken(user._id, "1h")

        const html = `<h1>Password restore</h1>
        <a href=${config.BASE_URL}/session/forgotPassword/${user.id || user._id}/${token}>restore pass</a>
        <br>`

        return await this.mail.send(email, "Restauración de contraseña", html)
    }

    addDocs = async (id, docName, path)=>{
        try {
            const user = await this.dao.getOneByID(id);
            const idx = user.documents.findIndex( doc => doc.name == docName);
            if(idx != -1) {
                return this.dao.updateDoc(id, idx, docName, path);
            }else{
                return await this.dao.addDoc(id, docName, path);
            }
        } catch (error) {
            console.log(error);
        }
    }
}