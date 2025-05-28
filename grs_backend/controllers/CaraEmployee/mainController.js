const { env } = process;
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const { Op, literal, fn } = require('sequelize');
const sequelizedbConnection = require("../../config/db_connection");
const logger = require("../../config/app_logger");
const { getTokenNumber } = require('../../utils/generateGrievanceToken');
const { sendGrievanceReplyMail } = require('../../utils/auto_mails_fetching/sendGriMailRecConfirm');
//Models
const { userLevelsModel, caraInternalDeptsModel, userDetailsModel, grievanceEntryModel, grievanceMovedModel, grievanceReplyModel } = require("../../models/index");



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
                [Sequelize.literal('"caraInternalDepts"."dept_name"'), 'user_dept'],
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



//getAllResolvedGrievances
const getAllResolvedGrievances = async (req, res) => {
    try {
        const user_dept = req.user.user_dept
        if (!user_dept) { return res.status(409).send({ status: env.s409, msg: "Unable to find your department.", allGrievances: allGrievances }) };
        const allGrievances = await grievanceEntryModel.findAll({
            where: {
                [Op.and]: [{
                    grievance_dept_code: {
                        [Op.eq]: user_dept
                    },
                    grievance_status: {
                        [Op.eq]: 1
                    }
                }]
            },
            order: [['grievance_entry_date', 'DESC']],
        });
        return res.status(200).send({ status: env.s200, msg: "Fetched All Resolved Grievances Successfully", allGrievances: allGrievances });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside getAllResolvedGrievances model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

//getAllUNResolvedGrievances
const getAllUnResolvedGrievances = async (req, res) => {
    try {
        const user_dept = req.user.user_dept
        if (!user_dept) { return res.status(409).send({ status: env.s409, msg: "Unable to find your department.", allGrievances: allGrievances }) };
        const allGrievances = await grievanceEntryModel.findAll({
            where: {
                [Op.and]: [{
                    grievance_dept_code: {
                        [Op.eq]: user_dept
                    },
                    grievance_status: {
                        [Op.eq]: 0
                    }
                }]
            },
            order: [['grievance_entry_date', 'DESC']],
        });
        return res.status(200).send({ status: env.s200, msg: "Fetched All Un-Resolved Grievances Successfully", allGrievances: allGrievances });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside getAllUnResolvedGrievances model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

//getAllClosedGrievances
const getAllClosedGrievances = async (req, res) => {
    try {
        const user_dept = req.user.user_dept
        if (!user_dept) { return res.status(409).send({ status: env.s409, msg: "Unable to find your department.", allGrievances: allGrievances }) };
        const allGrievances = await grievanceEntryModel.findAll({
            where: {
                [Op.and]: [{
                    grievance_dept_code: {
                        [Op.eq]: user_dept
                    },
                    grievance_status: {
                        [Op.eq]: 2
                    }
                }]
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

//update grievance status to resolve
const updateGrievanceStatusToResolved = async (req, res) => {
    try {
        const { grievance_token } = req.body;
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(409).send({ status: env.s409, msg: `Unable to find Grievance of No -- ${grievance_token}`, allGrievances: allGrievances }) };
        grievanceDetail.grievance_status = 1;
        await grievanceDetail.save();
        return res.status(200).send({ status: env.s200, msg: "Grievances Status Updated Successfully" });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside updateGrievanceStatusToResolved model with a error message --${error?.message}, error -- ${error} `);
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


// send grevance reply
const sendGrievanceReply = async (req, res) => {
    const transaction = await sequelizedbConnection().transaction();
    try {
        const { grievance_token, cc_ids, reply_body } = req.body;
        const reply_type = parseInt(req.body.reply_type);
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        // Create a new row in grievanceReplyModel
        const grievanceReplyDetails = {
            grievance_token: grievance_token,
            responcer_id: req.user.user_id,
            cc_ids: cc_ids,
            reply_body: reply_body,
            reply_type: reply_type,
            grievance_reply_date: new Date(),
            responcer_ip: req.userIp || '::1'
        };

        const lastGrievanceReply = await grievanceReplyModel.findOne({
            where: {
                grievance_token: grievance_token
            },
            order: [['grievance_reply_date', 'DESC']]
        });
        if (lastGrievanceReply) {
            const replyType = lastGrievanceReply?.reply_type;
            if (replyType == 2) {
                return res.status(406).send({ status: env.s406, msg: "Final Reply Already Given So Its Not Acceptable!" });
            }
        }

        await grievanceReplyModel.create(grievanceReplyDetails, { transaction: transaction });

        // Send grievance reply email
        const sendGrievanceReplyMailResp = await sendGrievanceReplyMail(grievanceDetail.applicant_email_id, cc_ids, grievanceDetail.grievance_mail_subject, grievance_token, reply_body, grievanceDetail.mail_message_id);

        //console.log("sendGrievanceReplyMailResp", sendGrievanceReplyMailResp);

        if (!sendGrievanceReplyMailResp) {
            await transaction.rollback(); // Rollback the transaction if email sending fails
            return res.status(500).send({ status: env.s500, msg: "Failed to send Grievance Reply." });
        }

        await transaction.commit(); // Commit the transaction if everything is successful
        return res.status(200).send({ status: env.s200, msg: "Grievances Reply Send Successfully" });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside sendGrievanceReply model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const grievanceReplyLog = async (req, res) => {
    try {
        const { grievance_token } = req.body;
        const grievanceDetail = await grievanceEntryModel.findOne({
            attributes: [
                'grievance_token',
                'applicant_email_id',
                'mail_message_id',
                'grievance_mail_subject',
                'grievance_mail_body',
                'applicant_name',
                'applicant_gender',
                'applicant_regno',
                'applicant_state_code',
                'applicant_district_code',
                'grievance_category',
                'grievance_type',
                'grievance_from',
                'internal_remark',
                'grievance_status',
                'grievance_entry_date',
                [Sequelize.literal('"caraDepts"."dept_id"'), 'dept_ip'],
                [Sequelize.literal('"caraDepts"."dept_name"'), 'dept_name']
            ],
            include: [
                {
                    model: caraInternalDeptsModel,
                    as: 'caraDepts',
                    attributes: [] // Ensure no attributes are selected from this model
                }
            ],
            where: {
                grievance_token: grievance_token
            },
            raw: true // Flatten nested objects
        });
        //const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(409).send({ status: env.s409, msg: `Unable to find Grievance of Token No -- ${grievance_token}` }) };
        const grievanceReplyHistory = await grievanceReplyModel.findAll({
            where: {
                grievance_token: grievance_token
            },
            order: [['grievance_reply_date']]
        })
        return res.status(200).send({ status: env.s200, msg: "Grievances Reply Log Data Found Successfully", data: { grievanceDetail: grievanceDetail, grievanceReplyHistory: grievanceReplyHistory } });
    } catch (error) {
        //console.log("err", error)
        logger.error(`server error inside grievanceReplyLog model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
}


// move cara-grievance
const pushBackGrievanceFromConsultantLevel = async (req, res) => {
    try {
        const { grievance_token } = req.body;
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceStatus = grievanceDetail.status;
        if (grievanceStatus == 2) { return res.status(422).send({ status: env.s422, msg: `Grievance -- ${grievance_token} Ticked is Already Closed, It can't modified futher.` }); };
        const lastMovementOfGrievance = await grievanceMovedModel.findOne({
            where: {
                grievance_token: grievance_token
            },
            order: [['movement_date', 'DESC']]
        })
        if (!lastMovementOfGrievance) { return res.status(404).send({ status: env.s404, msg: "Failed to get Last Movement Record, so its can't move!" }); };

        const mover_id = req.user.user_id;
        const dept_move_from = req.user.user_dept || 0;
        const dept_move_to = lastMovementOfGrievance.dept_move_from;
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
        return res.status(200).send({ status: env.s200, msg: "Grievance Push-Backed Successfully." });
    } catch (error) {
        //console.log("error", error);
        logger.error(`server error inside pushBackGrievanceFromConsultantLevel funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};


//
const getgrievanceUploadedPdf = async (req, res) => {
    try {
        //console.log(req.params, req.body);
        const { filename } = req.params;
        //console.log(__dirname)
        // const currPath = __dirname.split('/');
        // let uploadDir = currPath.slice(1, currPath.length - 2);
        // uploadDir = "/" + uploadDir.join('/') + '/assets/uploaded_files/';
        const filePath = path.join(__dirname, `../../utils/assets/mail_attachments/${filename}`);
        console.log("filePath-->", filePath);
        //console.log(filePath);

        // Validate filename to prevent unauthorized access
        // if (!filename.match(/^[a-zA-Z0-9\-._]+$/)) {
        //     return res.status(400).send('Invalid filename');
        // }

        // Check if file exists
        fs.exists(filePath, (exists) => {
            if (!exists) {
                return res.status(404).send('File not found');
            }

            // Set appropriate headers for PDF streaming
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            const pdfFileata = fs.readFileSync(filePath);
            res.send(pdfFileata);
        });
    } catch (error) {
        logger.error(`server error inside getgrievanceUploadedPdf funtion with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};




module.exports = {
    getAllUserLevels,
    getAllCaraDepts,
    getAllCaraGrievanceUsers,
    moveGrievanceBetweenCaraDepts,
    getAllResolvedGrievances,
    getAllClosedGrievances,
    getAllUnResolvedGrievances,
    updateGrievanceStatusToResolved,
    sendGrievanceReply,
    grievanceReplyLog,
    pushBackGrievanceFromConsultantLevel,
    getgrievanceUploadedPdf
}
