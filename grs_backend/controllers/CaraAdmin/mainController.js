const { env } = process;
const Sequelize = require('sequelize');
const fs = require('fs');
const { Op, literal, fn } = require('sequelize');
const sequelizedbConnection = require("../../config/db_connection");
const logger = require("../../config/app_logger");
const { getTokenNumber } = require('../../utils/generateGrievanceToken');
//Models
const { userLevelsModel, caraInternalDeptsModel, userDetailsModel, grievanceEntryModel, grievanceMovedModel } = require("../../models/index");



// user-levels
const getAllUserLevels = async (req, res) => {
    try {
        const userLevels = await userLevelsModel.findAll({
            order: [['level_id']],
        });
        return res.status(200).send({ status: env.s200, msg: "Users Level Fetched Successfully", userLevels: userLevels });
    } catch (error) {
        logger.error(`server error inside getAllUserLevels model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

// cara depts
const getAllCaraDepts = async (req, res) => {
    try {
        const allCaraDepts = await caraInternalDeptsModel.findAll({
            order: [['dept_name']],
        });
        return res.status(200).send({ status: env.s200, msg: "Fetched Cara Internal Departments Successfully", allCaraDepts: allCaraDepts });
    } catch (error) {
        logger.error(`server error inside getAllCaraDepts model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};


// cara depts
const getAllCaraGrievanceUsers = async (req, res) => {
    try {
        // const allUsers = await userDetailsModel.findAll({
        //     attributes: ["id", "user_id", "user_name", "user_dept", "user_status", "user_level", "user_creater_id", "user_created_at"]
        // });
        //const { tbl_users_details, tbl_user_levels, tbl_cara_internal_departments } = require('../models'); // Import Sequelize models

        // Perform the left join query using Sequelize
        const allUsers = await userDetailsModel.findAll({
            attributes: [
                'user_id',
                'user_name',
                'user_status',
                'user_creater_id',
                'user_created_at',
                [Sequelize.literal('"userLevel"."level_name"'), 'user_level'],
                [Sequelize.literal('"caraInternalDepts"."dept_name"'), 'user_dept']
            ],
            include: [
                {
                    model: userLevelsModel,
                    as: 'userLevel',
                    attributes: [] // Ensure no attributes are selected from this model
                },
                {
                    model: caraInternalDeptsModel,
                    as: 'caraInternalDepts',
                    attributes: [] // Ensure no attributes are selected from this model
                }
            ],
            order: [['user_created_at', 'DESC']],
            raw: true // Flatten nested objects
        });

        return res.status(200).send({ status: env.s200, msg: "Fetched All Cara Grievance Users Successfully", allUsers: allUsers });
    } catch (error) {
        //console.log("error server", error);
        logger.error(`server error inside getAllCaraGrievanceUsers model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};


// register new grievance
const registerNewGrievance = async (req, res) => {
    try {
        const { grievance_type, grievance_subject_id, grievance_dept_code, applicant_gender,
            applicant_district_code, applicant_state_code, grievance_category, grievance_mail_subject,
            applicant_email_id, grievance_mail_body, applicant_regno, applicant_name, internal_remark, grievance_from } = req.body;
        const grievance_token = await getTokenNumber();
        const user_creater_id = req.user.user_id;
        //console.log("grievance_token", grievance_token);
        let state_code = null;
        let dist_code = null;
        let grievanceFrom = null;
        let deptCode = null;
        if (applicant_state_code) { state_code = parseInt(applicant_state_code) }
        if (applicant_district_code) { dist_code = parseInt(applicant_district_code) }
        if (grievance_from) { grievanceFrom = parseInt(grievance_from) }
        if (grievance_dept_code) { deptCode = parseInt(grievance_dept_code) }
        const grievanceData = {
            grievance_type: grievance_type,
            grievance_subject_id: grievance_subject_id,
            grievance_dept_code: deptCode,
            grievance_entry_date: new Date(),
            grievance_token: grievance_token,
            applicant_gender: applicant_gender,
            applicant_district_code: dist_code,
            applicant_state_code: state_code,
            //applicant_country_code: '',
            grievance_category: grievance_category,
            grievance_mail_subject: grievance_mail_subject,
            applicant_email_id: applicant_email_id,
            grievance_mail_body: grievance_mail_body,
            applicant_regno: applicant_regno,
            applicant_name: applicant_name,
            ip: req.userIp,
            internal_remark: internal_remark,
            creater_id: user_creater_id,
            grievance_from: grievanceFrom
        };
        await grievanceEntryModel.create(grievanceData);
        return res.status(200).send({ status: env.s200, msg: "New Grievance Registered Successfully" });
    } catch (error) {
        //console.log("err", error);
        logger.error(`server error inside registerNewGrievance model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

// get getAllGrievances
const getAllGrievances = async (req, res) => {
    try {
        const allGrievances = await grievanceEntryModel.findAll({
            where: {
                [Op.and]: [{
                    grievance_dept_code: {
                        [Op.is]: null
                    },
                    grievance_status: {
                        [Op.eq]: 0
                    }
                }]
            },
            order: [['grievance_entry_date', 'DESC']],
        });
        ////console.log("get all Grie ----->", allGrievances)
        return res.status(200).send({ status: env.s200, msg: "Fetched All Grievances Successfully", allGrievances: allGrievances });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside getAllGrievances model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};
//getAllResolvedGrievances
const getAllResolvedGrievances = async (req, res) => {
    try {
        const allGrievances = await grievanceEntryModel.findAll({
            where: {
                grievance_status: {
                    [Op.eq]: 1
                },
                order: [['grievance_entry_date', 'DESC']],
            }
        });
        return res.status(200).send({ status: env.s200, msg: "Fetched All Resolved Grievances Successfully", allGrievances: allGrievances });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside getAllResolvedGrievances model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

//getAllClosedGrievances
const getAllClosedGrievances = async (req, res) => {
    try {
        const allGrievances = await grievanceEntryModel.findAll({
            where: {
                grievance_status: {
                    [Op.eq]: 2
                }
            },
            order: [['grievance_entry_date', 'DESC']],
        });
        return res.status(200).send({ status: env.s200, msg: "Fetched All Closed Grievances Successfully", allGrievances: allGrievances });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside getAllClosedGrievances model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

//getAllDistGrievances
const getAllDistGrievances = async (req, res) => {
    try {
        const allGrievances = await grievanceEntryModel.findAll({
            where: {
                [Op.and]: [{
                    grievance_dept_code: {
                        [Op.ne]: null
                    },
                    grievance_status: {
                        [Op.eq]: 0
                    }
                }]
            },
            order: [['grievance_entry_date', 'DESC']],
        });
        return res.status(200).send({ status: env.s200, msg: "Fetched All Distributed Grievances Successfully", allGrievances: allGrievances });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside getAllDistGrievances model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};


// move cara-grievance
const moveGrievanceBetweenCaraDepts = async (req, res) => {
    try {
        const { grievance_token, dept_move_to } = req.body;
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceStatus = grievanceDetail.status;
        if (grievanceStatus == 2) { return res.status(422).send({ status: env.s422, msg: `Grievance -- ${grievance_token} Ticked is Already Closed, It can't modified futher.` }); };
        const mover_id = req.user.user_id;
        const dept_move_from = req.user.user_dept || 0;
        const ipAddress = req.userIp;
        const grievanceMovedEntry = {
            'grievance_token': grievance_token,
            'dept_move_from': dept_move_from,
            'dept_move_to': dept_move_to,
            'mover_id': mover_id,
            'mover_ip': ipAddress,
            'movement_date': new Date(),
        };
        const pushBackGrievance = async (dept_id) => {
            return new Promise(async (resolve, reject) => {
                const transaction = await sequelizedbConnection().transaction();
                try {
                    grievanceDetail.grievance_dept_code = dept_id;
                    await grievanceDetail.save({ transaction });
                    await grievanceMovedModel.create(grievanceMovedEntry, { transaction });
                    await transaction.commit();
                    resolve({ status: 'committed' });
                } catch (error) {
                    await transaction.rollback();
                    reject({ status: 'failed', error });
                }
            });
        };
        //console.log("move_to", dept_move_to)
        await pushBackGrievance(dept_move_to);
        //if (move_to_dept_id == 0) await pushBackGrievance(null);
        //else await pushBackGrievance(dept_move_to);
        return res.status(200).send({ status: env.s200, msg: "Grievance Complain Moved Successfully." });
    } catch (error) {
        //console.log("error", error);
        logger.error(`server error inside moveGrievanceBetweenCaraDepts funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};





module.exports = {
    getAllUserLevels,
    getAllCaraDepts,
    getAllCaraGrievanceUsers,
    registerNewGrievance,
    getAllGrievances,
    moveGrievanceBetweenCaraDepts,
    getAllResolvedGrievances,
    getAllClosedGrievances,
    getAllDistGrievances
}
