import { UserService } from "../repository/index.js";
import config from "../config/config.js";
import Mail from "../repository/index.js";


export const deleteUser = async (req, res) => {
    const uid = req.params.uid
    const deleted = await UserService.delete(uid)
    const mail = new Mail()
    mail.send(user.email, "Usuario Eliminado", html)
    res.json({status: "Success", deleted})
}

export const deleteUserInactiv = async (req, res) => {
    try {
        const users = await UserService.get()
        const Diff = date => {
            const today = new Date()
            const diff = today.getTime() - date.getTime()
            return diff / (1000 * 60 * 60 * 24)
        }
        const inactivUser = users.filter(({ lastConecction }) => !lastConecction || Diff(lastConecction) > 2)
        const emails = inactivUser.map(user => user.email)
        for (var i = 0; i < emails.length; i++) {
            const mail = new Mail()
            const html = `
            <h1>User deleted</h1>
            <a href=${config.BASE_URL}/session/register>Register</a>
            <a></a>
            `
            mail.send(emails[i], 'user deleted', html)
        }
        const conditions = {
            lastConecction: { $gt: 172800000 },
            role: { $ne: 'admin' }
        };
        const deletedUsers = await UserService.deleteMany(conditions)
        res.json({ status: 'success', deletedUsers })
    } catch (error) {
        res.json({ status: 'error', error })
    }
}

export const changeUserRoleAdm = async (req, res) => {
    const uid = req.params.uid;
    const user = await UserService.getOneByID(uid)
    const documents = user.documents
    if(!documents){
        console.log("Datos Vacios")
    }else{

        const identificacion = documents.find(({ name }) => name === "identificacion")
        const comprobanteEstadoCuenta = documents.find(({ name }) => name === "comprobanteEstadoCuenta")
        const comprobanteDomicilio = documents.find(({ name }) => name === "comprobanteDomicilio")
        
        if(!comprobanteDomicilio || !identificacion || !comprobanteEstadoCuenta){
          console.log("Faltan Datos")
        }else {
          await UserService.changeUserRole(user)
          res.redirect("/api/users")
        }
    }
}