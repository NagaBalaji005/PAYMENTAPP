const express = require('express')
const router = express.Router();
const {body} = require('express-validator')
const controller  = require('../controller/user.controller')


router.post('/register',[
    body('email').isEmail().withMessage("invalid Email"),
    body('name').isLength({min:3}).withMessage("Name must be at least 3 characters long"),
    body('password').isLength({min:6}).withMessage("password must be at least  6 characters long  "), 
],
controller.registerUser
)

router.post('/login',[
    body('email').isEmail().withMessage("in valid Email"),
    body('password').isLength({min:6}).withMessage("password must be at least  6 characters long  "), 


],  
 controller.loginUser

)


router.get('/user/:upi_id', controller.fetchUserDetailsByUpi);





module.exports = router;


