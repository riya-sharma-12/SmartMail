require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require('./config/db_connection');
const logger = require('./config/app_logger');
const multer = require('multer')
const cron = require('node-cron');


//import autofetch Mails Func
const { fetchEmails } = require('./utils/auto_mails_fetching/index')
// import common functions
//const { generateUniqueFilename } = require('./utils/commonFunc')

// import middlewares
const { verifycaraUser, verifycaraEmployee, verifycaraAdmin, verifycaraSuperAdmin } = require("./middlewares/auth/index");



//import routers
const caraSuperAdmin = require('./routes/caraSuperAdmin');
const caraAdmin = require('./routes/caraAdmin');
const caraEmployee = require('./routes/caraEmployee');
const caraUsers = require('./routes/caraUsers');
const authRoutes = require('./routes/authRoutes');

// /** import middlewares */
// const veriftAdmin = require("./middlewares/verifyAdminCred");
// const verifyCollector = require("./middlewares/collector/verifyCollectorCred");
/** middlewares */


app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.disable('x-powered-by'); // less hackers know about our stack
app.enable('trust proxy'); // Trust the X-Forwarded-For header


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'assets/uploaded_files/'); // Change to your desired upload directory
//     },
//     filename: generateUniqueFilename
// });


const port = process.env.carings_amgs_Port;

/** api routes */
app.use("/api/v1/carausers",verifycaraUser, caraUsers);
app.use("/api/v1/caraemployee",verifycaraEmployee, caraEmployee);
app.use("/api/v1/caraadmin",verifycaraAdmin, caraAdmin);
app.use("/api/v1/carasuperadmin",verifycaraSuperAdmin, caraSuperAdmin);
app.use("/api/v1/authroutes", authRoutes);




//Schedule the cron job for auto grievance mails fetching function to run every 2 minutes
// cron.schedule('*/1 * * * *', () => {
//     fetchEmails();
// });
// await sequelize.sync({ alter: true });


/** start server only when we have valid connection */
connectDB().authenticate().sync({ alter: true }).then(() => {

    try {
        app.listen(3002, () => {
            logger.info(`Server connected to --> ${port} Port`);
        })
    } catch (error) {
        logger.error(`Cannot connect to the server causing error ${error}`)
    }
}).catch(error => {
    //console.log("error", error);
    logger.error(`Invalid database connection...! causing error ${error}`);
})
