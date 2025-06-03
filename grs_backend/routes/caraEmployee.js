const express = require('express');
const router = express.Router();
// import middlewares
const validateBody = require("../middlewares/express_validator/validateBody");
const { check } = require('express-validator');
const { checkNotNull } = require('../utils/commonFunc');

// import middlewares
//const { uploadPdfFile } = require('../middlewares/commons/fileUploadMiddlewares');

// import controller
const {
    grievanceMainController
} = require("../controllers/CaraEmployee");
const grievanceDashboardController = require("../controllers/Grievance/index");


//new
router.get("/grievanceDashboard", grievanceDashboardController.grievanceMainController.grievanceDashboard);


// mainController
router.get('/getAllResolvedGrievances', grievanceMainController.getAllResolvedGrievances);
router.get('/getAllUnResolvedGrievances', grievanceMainController.getAllUnResolvedGrievances);
router.get('/getAllClosedGrievances', grievanceMainController.getAllClosedGrievances);
router.post('/updateGrievanceStatusToResolved',
    [
        ...checkNotNull(['email_token']),
        //check('email_token').exists().isNumeric().withMessage('Invalid Department Id.'),
    ], validateBody, grievanceMainController.updateGrievanceStatusToResolved
);
router.post('/sendGrievanceReply',
    [
        ...checkNotNull(['email_token', 'reply_body']),
        //check('email_token').exists().isNumeric().withMessage('Invalid Department Id.'),
    ], validateBody, grievanceMainController.sendGrievanceReply
);

router.post('/grievanceReplyLog',
    [
        ...checkNotNull(['email_token']),
        check('email_token').exists().isNumeric().withMessage('Invalid email keyword.'),
    ], validateBody, grievanceMainController.grievanceReplyLog
);

router.post('/pushBackGrievanceFromConsultantLevel',
    [
        ...checkNotNull(['email_token']),
    ], validateBody, grievanceMainController.pushBackGrievanceFromConsultantLevel
);

router.get('/getgrievanceUploadedPdf/:filename', grievanceMainController.getgrievanceUploadedPdf);


module.exports = router;