const { env } = process;
const Sequelize = require('sequelize');
const fs = require('fs');
const { Op, literal, fn } = require('sequelize');
const sequelizedbConnection = require("../../config/db_connection");
const logger = require("../../config/app_logger");
const { userDetailsModel, grievanceEntryModel, statesModel } = require("../../models/index"); //Models
// const path = require('path');
// const SecretKey = env.SECRET_KEY
const { decryptValue, createHashPasswordViaBcrypt } = require("../../utils/commonFunc");


// register new user
const registerNewUser = async (req, res) => {
    try {
        const { user_id, user_level, user_dept, password, user_name } = req.body;
        const user_creater_id = req.user.user_id;
        const decryptUserId = decryptValue(user_id);
        const decryptPassword = decryptValue(password);
        const checkNewUser = await userDetailsModel.findByPk(decryptUserId);
        if (checkNewUser) { return res.status(409).send({ status: env.s409, msg: "User already exist in the system." }); }
        //console.log("decryptPassword", decryptPassword)
        const user_hashpassword = await createHashPasswordViaBcrypt(decryptPassword);
        //console.log("user_hashpassword", user_hashpassword)
        const newUserData = {
            user_id: decryptUserId,
            user_level: user_level,
            user_dept: user_dept,
            user_hashpassword: user_hashpassword,
            user_name: user_name,
            user_creater_id: user_creater_id,
            user_created_at: new Date(),
            creater_ip: req.userIp
        }
        await userDetailsModel.create(newUserData);
        return res.status(200).send({ status: env.s200, msg: "New User Registered Successfully" });
    } catch (error) {
        logger.error(`server error inside registerNewUser model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

// block current user
const blockunblockCurrUser = async (req, res) => {
    try {
        const { user_id } = req.body;
        const decryptUserId = decryptValue(user_id);
        const user = await userDetailsModel.findByPk(decryptUserId);
        if (!user) { return res.status(404).send({ status: env.s404, msg: "User Not Found" }) };
        let action = ""
        if (user.user_status === 1) {
            user.user_status = 0
            action = "Blocked";
        } else {
            user.user_status = 1
            action = "Un-Blocked"
        }
        await user.save();
        return res.status(200).send({ status: env.s200, msg: `User ${action} Successfully` });
    } catch (error) {
        logger.error(`server error inside blockunblockCurrUser model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const getAllGrievances = async (req, res) => {
    try {
        // const userType = 4; // req.xyzName
        // if (userType < 3 || userType > 5) {
        //     return res.status(401).send({ status: env.s401, msg: "Not Allowed" });
        // }
        const allGrievances = await grievanceEntryModel.findAll({
            order: [['grievance_entry_date', 'DESC']],
        });
        //console.log("get allGrievances", allGrievances)
        return res.status(200).send({ status: env.s200, msg: "All Grievances Successfully", allGrievances: allGrievances });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const getGrievanceData = async (req, res) => {
    try {
        const { grievance_token } = req.body;
        const getGrievanceData = await grievanceEntryModel.findOne({
            where: {
                grievance_token: grievance_token
            }
        });
        return res.status(200).send({ status: env.s200, msg: "All Grievances Successfully", getGrievanceData: getGrievanceData });
    } catch (error) {
        logger.error(`server error inside getGrievanceData funtion with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

//

const updateGrievanceData = async (req, res) => {
    try {
        const { grievance_token, applicant_state_code, grievance_category, grievance_type } = req.body;
        const getGrievanceData = await grievanceEntryModel.findOne({
            where: {
                grievance_token: grievance_token
            }
        });
        getGrievanceData.applicant_state_code = applicant_state_code;
        getGrievanceData.grievance_category = grievance_category;
        getGrievanceData.grievance_type = grievance_type;

        //save an update
        getGrievanceData.save();
        return res.status(200).send({ status: env.s200, msg: "Griecance Data Updated Successfully" });
    } catch (error) {
        logger.error(`server error inside updateGrievanceData funtion with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

// states
const getAllStates = async (req, res) => {
    try {
        const allStates = await statesModel.findAll({
            order: [['state_name']],
        });
        return res.status(200).send({ status: env.s200, msg: "Fetched All States Successfully", allStates: allStates });
    } catch (error) {
        logger.error(`server error inside getAllStates funtion with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const getAllGrievancesforDepts = async (req, res) => {
    try {
        const { grievance_status, dept_type, grievance_category, grievance_type } = req.body;
        let allGrievances = []
        //console.log(dept_type, "dept_type");
        if (dept_type === 0) {
            allGrievances = await grievanceEntryModel.findAll({
                attributes: ["grievance_token", "applicant_name", "applicant_phone_no", "grievance_entry_date", "grievance_against_code", "cara_dept"],
                where: {
                    [Op.or]: [
                        {
                            grievance_against_type: '0',
                        },
                        {
                            grievance_entry_date: {
                                [Op.not]: null,
                                [Op.lt]: new Date(new Date() - 48 * 60 * 60 * 1000), // 48 hours ago
                            },
                        },
                    ],
                    grievance_status: 0,
                    grievance_category: 0,
                    grievance_type: 1,
                    cara_dept: null,
                },
                order: [['grievance_entry_date', 'DESC']],
            });

        } else {
            allGrievances = await grievanceEntryModel.findAll({
                attributes: ["grievance_token", "applicant_name", "applicant_phone_no", "grievance_entry_date", "grievance_against_code", "cara_dept"],
                where: {
                    [Op.or]: [
                        {
                            grievance_against_type: '0',
                        },
                        {
                            grievance_entry_date: {
                                [Op.not]: null,
                                [Op.lt]: new Date(new Date() - 48 * 60 * 60 * 1000), // 48 hours ago
                            },
                        },
                    ],
                    grievance_status: 0,
                    grievance_category: 0,
                    grievance_type: 1,
                    cara_dept: dept_type,
                },
                order: [['grievance_entry_date', 'DESC']],
            });

        }
        return res.status(200).send({ status: env.s200, msg: "All Grievances Successfully", allGrievances: allGrievances });
    } catch (error) {
        //console.log(error);
        logger.error(`server error inside getAllGrievanceSubj funtion with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};




module.exports = {
    getAllGrievances,
    getAllGrievancesforDepts,
    getAllStates,
    getGrievanceData,
    updateGrievanceData,
    registerNewUser,
    blockunblockCurrUser
}
