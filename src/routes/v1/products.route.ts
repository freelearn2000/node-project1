import express from 'express';
import { createResource, findResource, findOneResource, patchResource, deleteResource } from '../../services/products.service';
import { handleAsync, EntityNotFoundError } from '../../shared/common';
import authMiddleware from '../../middlewares/auth.middleware';


let router = express.Router( );

// API Endpoint '/products'
// router.post(`/`, (req, res, next) => {

//     const model = req.body;

//     // Call service
//     createResource( model )
//         .then( newResource => {
//             res.send( newResource );
//         })
//         .catch( error => {
//             next( error );
//         });
// });

// Protect ALL CRUD operations
// router.use( authMiddleware() );

router.post(`/`, async (req, res, next) => {

    const model = req.body;

    // Call service
    const [ newResource, error ] = await handleAsync( createResource(model) );
    if ( error ) return next( error );
    
    res.send( newResource );
});

router.get(`/`, async(req, res, next) => {

    // Call service
    const [ allResources, error ] = await handleAsync( findResource() );
    if ( error ) return next( error );

    res.send( allResources );
});

router.get(`/:id`, async(req, res, next) => {

    const id = Number( req.params.id );

    // Call service
    const [ resource, error ] = await handleAsync( findOneResource(id) );
    if ( error ) return next( error );

    if ( resource ) {
        res.send( resource );
    } else {
        next( new EntityNotFoundError(id, `products.route->get/:id`) );
    }
});

router.patch(`/:id`, async(req, res, next) => {

    const id = Number( req.params.id );
    const patchedModel = req.body;

    // Call service
    const [ resource, error ] = await handleAsync( patchResource(id, patchedModel) );
    if ( error ) return next( error );

    if ( resource ) {
        res.send( resource );
    } else {
        next( new EntityNotFoundError(id, `products.route->patch`) );
    }
});

router.delete(`/:id`, authMiddleware(), async(req, res, next) => {

    const id = Number( req.params.id );

    // Call service
    const [ result, error ] = await handleAsync( deleteResource(id) );
    if ( error ) return next( error );

    if ( result.affected === 1 ) {
        res.send( {deleted: true} );
    } else {
        res.send( {deleted: false} );
    }
});

export default router;
