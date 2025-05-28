const { env } = process;
const { Op } = require('sequelize');
const sequelizedbConnection = require("../../config/db_connection");
const logger = require("../../config/app_logger");
const { grievanceSubjectsModel, grievanceEntryModel, grievanceStakeholdersModel, grievancesModel, grievanceresponsesModel, grievanceMovedModel } = require("../../models/index"); //Models
const { getTokenNumber } = require('../../utils/generateGrievanceToken');

//const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

const changeGrievanceCategory = async (req, res) => {
    try {
        const { grievance_token, curr_category } = req.body;
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceStatus = grievanceDetail.status;
        if (grievanceStatus == 2) { return res.status(422).send({ status: env.s422, msg: `Grievance -- ${grievance_token} Ticked is Already Closed, It can't modified futher.` }); };
        grievanceDetail.grievance_category = parseInt(curr_category);
        grievanceDetail.save();
        return res.status(200).send({ status: env.s200, msg: "Grievance Category Changed Successfully" });
    } catch (error) {
        logger.error(`server error inside changeGrievanceCategory funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const moveComplainBetweenCaraDepts = async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { grievance_token, move_from_dept_id, move_to_dept_id, mover_id } = req.body;
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceStatus = grievanceDetail.status;
        if (grievanceStatus == 2) { return res.status(422).send({ status: env.s422, msg: `Grievance -- ${grievance_token} Ticked is Already Closed, It can't modified futher.` }); };
        const grievanceMovedEntry = {
            'grievance_token': grievance_token,
            'move_from_dept_id': move_from_dept_id,
            'move_to_dept_id': move_to_dept_id,
            'mover_id': mover_id,
            'mover_ip': ipAddress,
            'move_date': new Date(),
        };
        const pushBackGrievance = async (dept_id) => {
            return new Promise(async (resolve, reject) => {
                const transaction = await sequelizedbConnection().transaction();
                try {
                    grievanceDetail.cara_dept = dept_id;
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
        //console.log("move_to", move_to_dept_id)
        if (move_to_dept_id == 0) await pushBackGrievance(null);
        else await pushBackGrievance(move_to_dept_id);
        return res.status(200).send({ status: env.s200, msg: "Grievance Complain Moved Successfully." });
    } catch (error) {
        //console.log("error", error);
        logger.error(`server error inside moveComplainBetweenCaraDepts funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

module.exports = {
    changeGrievanceCategory,
    moveComplainBetweenCaraDepts,
}