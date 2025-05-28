const winston = require('winston');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'carings_grievance_module_backend.log' }) 
  ]
});

// Log unhandled exceptions
logger.exceptions.handle(new winston.transports.File({ filename: 'carings_grievance_module_backend_exceptions.log' }));

module.exports = logger;
