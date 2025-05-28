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
} = require("../controllers/CaraAdmin");


// routes

// mainController
router.get('/getAllUserLevels', grievanceMainController.getAllUserLevels);
router.get('/getAllCaraDepts', grievanceMainController.getAllCaraDepts);
router.get('/getAllCaraGrievanceUsers', grievanceMainController.getAllCaraGrievanceUsers);
router.get('/getAllGrievances', grievanceMainController.getAllGrievances);
router.get('/getAllResolvedGrievances', grievanceMainController.getAllResolvedGrievances);
router.get('/getAllClosedGrievances', grievanceMainController.getAllClosedGrievances);
router.get('/getAllDistGrievances', grievanceMainController.getAllDistGrievances);

router.post('/registerNewGrievance',
    [
        ...checkNotNull(['grievance_type', 'grievance_subject_id', 'grievance_dept_code', 'grievance_category',
            'grievance_mail_subject', 'applicant_email_id', 'grievance_mail_body'])
    ], validateBody, grievanceMainController.registerNewGrievance
);

router.post('/moveGrievanceBetweenCaraDepts',
    [
        ...checkNotNull(['grievance_token', 'dept_move_to']),
        check('dept_move_to').exists().isNumeric().withMessage('Invalid Department Id.'),
    ], validateBody, grievanceMainController.moveGrievanceBetweenCaraDepts
);


module.exports = router;