import winston from 'winston';
import nconf from '../shared/config';


const myCustomLevels = {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    },
    colors: {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      debug: 'grey'
    }
  };

const logConfiguration = {
    levels: myCustomLevels.levels,
    format: winston.format.combine(
      winston.format.simple()
    ),
    transports: [
        new winston.transports.File( {filename: `error.log`, level: `error`} )
    ]
};
const logger = winston.createLogger( logConfiguration );

winston.addColors( myCustomLevels.colors );

if ( nconf.get('NODE_ENV') !== 'production' ) {
    logger.add( new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({all:true}),
        winston.format.simple()
      )
    }));
}


export default logger;
