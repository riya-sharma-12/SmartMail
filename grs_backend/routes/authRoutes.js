const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
// import middlewares
const validateBody = require("../middlewares/express_validator/validateBody");
// import controller
const authmainController = require("../controllers/Auth/index")

// routes
router.post("/login",
    [
        check('user_id').exists().withMessage('Invalid user_id'),
        check('password').exists().withMessage('Invalid password'),
    ], validateBody, authmainController.login
);

router.post('/changepassword',
    [
        check('user_id').exists().isEmail().withMessage('Invalid user_id'),
    ], validateBody, authmainController.forgetPassword
);


//temp
router.get('/getgrievanceUploadedPdf/:filename', authmainController.getgrievanceUploadedPdf);
//


module.exports = router;