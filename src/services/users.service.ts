import { getRepository } from 'typeorm';
import { User } from '../models/user.entity';
import { ServerError, handleAsync } from '../shared/common';


export const createResource = async( model: any ) => {

    const tempObject = getRepository( User ).create( model );
    let [ newResource, error ] = await handleAsync( getRepository(User).save(tempObject) );

    if ( error ) throw new ServerError( error.message, `users.route->createResource` );

    return newResource;
}

export const findResource = async( ) => {

    let [ allResources, error ] = await handleAsync( getRepository(User).find() );
    if ( error ) throw new ServerError( error.message, `users.route->findResource` );

    return allResources;
}

export const findOneResource = async( id: number ) => {

    let [ resource, error ] = await handleAsync( getRepository(User).findOne(id) );
    if ( error ) throw new ServerError( error.message, `users.route->findOneResource` );

    return resource;
}

export const patchResource = async( id: number, patchedModel: any ) => {

    let [ result, error ] = await handleAsync( getRepository(User).update(id, patchedModel) );
    if ( error ) throw new ServerError( error.message, `users.route->patchResource` );

    let [ resource, error2 ] = await handleAsync( getRepository(User).findOne(id) );
    if ( error2 ) throw new ServerError( error2.message, `users.route->patchResource` );

    return resource;
}

export const deleteResource = async( id: number ) => {

    let [ result, error ] = await handleAsync( getRepository(User).delete(id) );
    if ( error ) throw new ServerError( error.message, `users.route->deleteResource` );

    return result;
}


