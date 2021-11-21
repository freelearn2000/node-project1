
export const handleAsync = ( promise: Promise<any> ) => {
    return promise
        .then( (data: any) => [data, null] )
        .catch( (error: any) => [null, error] )
}

export class MyError extends Error {

    status: number;
    origin: string;

    constructor( status: number, message: string, origin: string ) {
        super( message );
        this.status = status;
        this.origin = origin;
    }
}

export class ServerError extends MyError {

    constructor( message: string, origin: string ) {
        super( 500, message, origin );
    }
}

export class DataValidationError extends MyError {

    constructor( message: string, origin: string ) {
        super( 400, message, origin );
    }
}

export class EntityNotFoundError extends MyError {

    constructor( id: number, origin: string ) {
        super( 400, `Entity with ${id} not found!`, origin );
    }
}

export class AuthenticationError extends MyError {

    constructor( error: any, origin: string ) {
        super( 401, error ?? `Authentication Error!`, origin );
    }
}