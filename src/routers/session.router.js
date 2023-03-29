import { Router } from "express"
import passport from "passport"
//import UserModel from "../dao/models/user.model.js"
import { passportCall, authorization } from "../utils.js"

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
    
    res.redirect('/sessions/login')
})

// vista de Login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

router.get('/register', (req, res) => {
    res.render('sessions/register')
})


router.post('/register', passport.authenticate('register'), async (req, res) => {
    res.redirect('/session/login')
})

router.get('/current', passportCall('jwt'), authorization('user'), async (req, res)=>{
    const id = req.user.user._id
    const user = await UserService.getOneByID(id)
    res.render('sessions/profile', {user: user})
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

// login con github

router.get(
    '/github',
    passport.authenticate('github', {scope: ['user:email']}),
    async(req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/login'}),
    async(req, res) => {
        console.log("Callback: ", req.user);

        req.session.user = req.user
        console.log("User Session: ", req.session.user);
        res.redirect('/products')
    }
)

export default router