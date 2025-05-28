const express = require('express');
const router = express.Router();
// import middlewares
const validateBody = require("../middlewares/express_validator/validateBody");
const { checkNotNull } = require('../utils/commonFunc');

// import middlewares
//const { uploadPdfFile } = require('../middlewares/commons/fileUploadMiddlewares');

// import controller
const {
    grievanceMainController
} = require("../controllers/CaraUsers");


// routes

// mainController
router.get('/getAllStates', grievanceMainController.getAllStates);
router.post('/getAllDistrictsOfState',
    [
        ...checkNotNull(['state_lgd_code'])
    ], validateBody, grievanceMainController.getAllDistrictsOfState
);
router.post('/getAllGrievanceSubj',
    [
        ...checkNotNull(['subject_category'])
    ], validateBody, grievanceMainController.getAllGrievanceSubj
);

module.exports = router;