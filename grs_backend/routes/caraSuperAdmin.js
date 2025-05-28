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
} = require("../controllers/CaraSuperAdmin/index");


// routes

// mainController
router.get("/getAllGrievances", grievanceMainController.getAllGrievances);
router.post("/getGrievanceData", grievanceMainController.getGrievanceData);
router.post("/updateGrievanceData", grievanceMainController.updateGrievanceData);

router.post("/getAllGrievancesforDepts", grievanceMainController.getAllGrievancesforDepts);

router.get("/getAllStates", grievanceMainController.getAllStates);
//router.post("/getallgrievancesubjects", grievanceMainController.getAllGrievanceSubj);


//new
router.post('/registerNewuser',
    [
        ...checkNotNull(['user_id', 'password', 'user_dept', 'user_name', 'user_level'])
    ], validateBody, grievanceMainController.registerNewUser
);

router.post('/blockunblockCurrUser',
    [
        ...checkNotNull(['user_id'])
    ], validateBody, grievanceMainController.blockunblockCurrUser
);

module.exports = router;