const { env } = process;
const Sequelize = require('sequelize');
const fs = require('fs');
const { Op, literal, fn } = require('sequelize');
const sequelizedbConnection = require("../../config/db_connection");
const logger = require("../../config/app_logger");
const { statesModel, districtsModel, grievanceSubjectsModel } = require("../../models/index"); //Models



// states
const getAllStates = async (req, res) => {
    try {
        const allStates = await statesModel.findAll({
            order: [['state_name']],
        });
        return res.status(200).send({ status: env.s200, msg: "Fetched All States Successfully", allStates: allStates });
    } catch (error) {
        logger.error(`server error inside getAllStates model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

// districts
const getAllDistrictsOfState = async (req, res) => {
    try {
        const { state_lgd_code } = req.body;
        const allDistricts = await districtsModel.findAll({
            where: {
                state_lgd_code: state_lgd_code
            },
            order: [['district_name']],

        });
        return res.status(200).send({ status: env.s200, msg: "Fetched All Districts Successfully", allDistricts: allDistricts });
    } catch (error) {
        logger.error(`server error inside getAllDistrictsOfState model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};


//subjects
const getAllGrievanceSubj = async (req, res) => {
    try {
        const { subject_category } = req.body;
        const allGrivSubj = await grievanceSubjectsModel.findAll({
            where: {
                subject_category: subject_category
            },
            order: [['subject_name']],
        });
        return res.status(200).send({ status: env.s200, msg: "All Grievance Subjects Fetched Successfully", allGrivSubj: allGrivSubj });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj model -- ${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};




module.exports = {
    getAllStates,
    getAllDistrictsOfState,
    getAllGrievanceSubj
}
