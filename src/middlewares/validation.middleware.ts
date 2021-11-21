import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { DataValidationError } from '../shared/common';


const validationMiddleware = ( validator: any, options = {} ): RequestHandler => {

    return ( req: Request, res: Response, next: NextFunction ) => {

        validate( plainToClass(validator, req.body), options )
            .then( (errors: ValidationError[]) => {

                if ( errors.length ) {

                    const messages: any = errors.map( 
                        (error: ValidationError) => {
    
                            const constraints: any = error.constraints;
    
                            return Object.values(constraints).join(` ; `);
                        }
                    ).join(` ; `);

                    // Validation failed!
                    next( new DataValidationError(messages, `validation.middleware->validationMiddleware`) );

                } else {

                    // Validation succeeded, move to nect middleware
                    next( );
                }
               
            } )
            .catch( error => {
                next( new DataValidationError(error.message, `validation.middleware->validationMiddleware`) );
            });
    }
}

export default validationMiddleware;
