import winston from "winston";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    
}

const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'debug',
            format: winston.format.combine(winston.format.simple())
         }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'info',
            format: winston.format.simple()
        })
    ]

})

//const logger = winston.createLogger({
   // transports: [
  //      new winston.transports.Console({ level: 'http' })
 //   ]
//})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

