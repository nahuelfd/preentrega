import { Router } from "express"
import UserModel from "../dao/models/user.model.js"

const router = Router()

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios e la DB
router.post('/register', async(req, res) => {
    const userNew = req.body
    console.log(userNew);

    const user = new UserModel(userNew)
    await user.save()

    res.redirect('/session/login')
})

// vista de Login
router.get('/login', (req, res) => {
    res.render('session/login')
})

// API para login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await UserModel.findOne({email, password}).lean().exec()
    if(!user) {
        return res.status(401).render('errors/base', {
            error: 'error en email y o password'
        })
    }

    req.session.user = user

    res.redirect('/products')
})
// cerrar sesion
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.status(500).render('errors/base', {error: err})
        } else res.redirect('/session/login')
    })
})

export default router