// masters
const grievanceSubjectsModel = require("./masters/tbl_grievance_subjects");
const grievanceStakeholdersModel = require("./masters/tbl_grievances_stakeholders");
const grievanceInternalDeptsModel = require("./masters/tbl_grievance_cara_internal_depts");
const statesModel = require("./masters/tbl_states");
const districtsModel = require("./masters/tbl_districts");
const genderModel = require("./masters/tbl_gender_data");
const userLevelsModel = require("./masters/tbl_user_levels");
const userDetailsModel = require("./masters/tbl_users_details");
const caraInternalDeptsModel = require("./masters/tbl_cara_internal_departments");

// public
const grievanceEntryModel = require("./public/tbl_grievance_details_global");
const grievanceMovedModel = require("./public/tbl_grievance_movement_details");
const grievanceReplyModel = require("./public/tbl_grievance_reply");


const grievancesModel = require("./public/tbl_grievances");
const grievanceresponsesModel = require("./public/tbl_grievance_responses");






module.exports = {
    grievanceSubjectsModel,
    grievanceStakeholdersModel,
    grievanceInternalDeptsModel,
    grievanceEntryModel,
    grievancesModel,
    grievanceresponsesModel,
    grievanceMovedModel,
    statesModel,
    districtsModel,
    genderModel,
    userLevelsModel,
    userDetailsModel,
    caraInternalDeptsModel,
    grievanceReplyModel
}