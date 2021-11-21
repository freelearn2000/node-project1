import { getRepository } from 'typeorm';
import { Product } from '../models/product.entity';
import { ServerError, handleAsync } from '../shared/common';


// export const createResource = ( model: any ) => {

//     const tempObject = getRepository( Product ).create( model );
//     return getRepository( Product ).save( tempObject )
//         .then( newResource => {
//             return newResource;
//         })
//         .catch( error => {
//             throw new MyError( 500, error.message, `products.route->createResource` );
//         });
// }

export const createResource = async( model: any ) => {

    const tempObject = getRepository( Product ).create( model );
    let [ newResource, error ] = await handleAsync( getRepository(Product).save(tempObject) );

    if ( error ) throw new ServerError( error.message, `products.route->createResource` );

    return newResource;
}

export const findResource = async( ) => {

    let [ allResources, error ] = await handleAsync( getRepository(Product).find() );
    if ( error ) throw new ServerError( error.message, `products.route->findResource` );

    return allResources;
}

export const findOneResource = async( id: number ) => {

    let [ resource, error ] = await handleAsync( getRepository(Product).findOne(id) );
    if ( error ) throw new ServerError( error.message, `products.route->findOneResource` );

    return resource;
}

export const patchResource = async( id: number, patchedModel: any ) => {

    let [ result, error ] = await handleAsync( getRepository(Product).update(id, patchedModel) );
    if ( error ) throw new ServerError( error.message, `products.route->patchResource` );

    let [ resource, error2 ] = await handleAsync( getRepository(Product).findOne(id) );
    if ( error2 ) throw new ServerError( error2.message, `products.route->patchResource` );

    return resource;
}

export const deleteResource = async( id: number ) => {

    let [ result, error ] = await handleAsync( getRepository(Product).delete(id) );
    if ( error ) throw new ServerError( error.message, `products.route->deleteResource` );

    return result;
}


