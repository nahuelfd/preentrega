import { Router } from "express"
import passport from "passport"
//import UserModel from "../dao/models/user.model.js"
import { passportCall, authorization } from "../utils.js"
import { addLogger } from "../logger.js"
import {changePassword, sendRecoveryMail, changeUserRole} from "../controller/session.controller.js"


const router = Router()

router.use(addLogger)

router.get("/changeUserRole", passportCall("jwt"), changeUserRole);

router.post("/forgotPassword", sendRecoveryMail);

router.post("/forgotPassword/:uid/:token", changePassword);

router.get('/forgotPassword/:uid/:token', (req, res) => {
    const uid = req.params.uid
    const token = req.params.token
    res.render('sessions/changePassword', {
        uid: uid,
        token: token
    })
})

//Vista para registrar usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

// API para crear usuarios e la DB

router.post('/register', async(req, res) => {
    const userNew = req.body
    req.logger.info(userNew);
    
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
            req.logger.error(err);
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
        req.logger.info("User Session: ", req.session.user);
        res.redirect('/products')
    }
)

export default router