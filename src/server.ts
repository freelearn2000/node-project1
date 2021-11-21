// Load configuration informations first!
import nconf from './shared/config';
import logger from './shared/logger';

import express, {Response} from 'express';
import path from 'path';
import routerProducts from './routes/v1/products.route';
import routerNews from './routes/v1/news.route';
import routerUsers from './routes/v1/users.route';
import routerAuthV1 from './routes/v1/auth.route';
import routerAuthV2 from './routes/v2/auth.route';
import { createConnection } from 'typeorm';
import config from './typeormconfig';
import responseMiddleware from './middlewares/response.middleware';
import loggingMiddleware from './middlewares/logging.middleware';


const API_PREFIX_V1 = `/api/v1`;
const API_PREFIX_V2 = `/api/v2`;
const PORT = process.env.PORT || 3000;

const server = express( );
server.use( express.json() );

logger.info( `Environment : ${nconf.get('NODE_ENV')}` );


// Connect Adaptor to Persistance Layer (PostGres)
// async/await (2015 - ES6)
// Promise (2015 - ES6)

// Using Promise
createConnection( config )
    .then( ( ) => logger.info(`Adaptor connected...`) )
    .catch( (error) => logger.error(`Adaptor failed to connect : `, error) );

// Using async/await
// async function connectToPostGres( ) {
//     try {
//         await createConnection(config);
//         console.log(`Connection successful!`);
//     } catch( error ) {
//         console.log(`Connection failed : `, error);
//     }
// }
// connectToPostGres( );

// Logging middleware
server.use( loggingMiddleware() );

// Response Formatter
server.use( responseMiddleware() );

// Add Routes
server.use( `${API_PREFIX_V1}/auth`, routerAuthV1 );
server.use( `${API_PREFIX_V2}/auth`, routerAuthV2 );
server.use( `${API_PREFIX_V1}/products`, routerProducts );
server.use( `${API_PREFIX_V1}/news`, routerNews );
server.use( `${API_PREFIX_V1}/users`, routerUsers );

// Handle All API's (not handled by Routes)
server.all( `/api/*`, (req, res) => {
    res.status( 400 ).send( `API ${req.method} on ${req.path} not implemented!` );
    logger.error( `400 API ${req.method} on ${req.path} not implemented!` );
});

// Handle GET requests not handled by Routes, Send React App to Client
server.get( `*`, (req, res) => {
    res.sendFile( path.resolve(__dirname, `../../express/src/client/index.html`) );
});

// Handle All other (POST, PATCH, DELETE) requests not handled by Routes
server.all( `*`, (req, res) => {
    res.status( 400 ).send( `Not implemented!` );
    logger.error( `400 Not implemented!` );
});

// Global error handler
server.use( (error: any, req: any, res: Response, next: any) => {

    // res.send( {status: error.status, message: `Error occured!`} );
    res.status( error.status ).send( {message: error.message} );

    // Further log the Error Message & Origin to persistance layer (analytics)
    logger.error( `Status: ${error.status}, Origin: ${error.origin}, Error: ${error.message}` );
});

server.listen( PORT, ( ) => {
    logger.info(`Server running at ${PORT}...`);
});
