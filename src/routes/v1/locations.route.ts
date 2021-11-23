import express from 'express';
import { createResource, findResource, findOneResource, patchResource, deleteResource } from '../../services/locations.service';
import { handleAsync, EntityNotFoundError } from '../../shared/common';
import validationMiddleware  from '../../middlewares/validation.middleware';
import { LocationValidator } from '../../models/location.entity';


let router = express.Router( );

// API Endpoint '/locations'
router.post(`/`, validationMiddleware(LocationValidator), async(req, res, next) => {

    const model = req.body;
    
    // Call service 
    const [ newResource, error ] = await handleAsync( createResource(model) );
    if ( error ) return next( error );

    res.send( newResource );
             
});

router.get(`/`, async(req, res, next) => {

    let options: any = req.query;
    
    // Call service
    const [ allResources, error ] = await handleAsync( findResource(options) );
    if ( error ) return next( error );

    res.send( allResources);
});

router.get(`/:id`, async(req, res, next) => {

    // Retrive data from Route params
    const id = Number( req.params.id );
    let options: any = req.query;

    // Call service
    const [ resource, error ] = await handleAsync( findOneResource(id, options) );
    if ( error ) return next( error );

    if( resource ) {    
        res.send( resource );
    } else {
        next( new EntityNotFoundError(id, `locations.route->get/:id`) );
    }
});

router.patch(`/:id`, validationMiddleware( LocationValidator, { skipMissingProperties: true} ), async(req, res, next) => {

    const id = Number( req.params.id );
    const patchedModel = req.body;

    // Call service
    const [ resource, error ] = await handleAsync( patchResource(id, patchedModel) );
    if ( error ) return next( error );

    if ( resource ) {
        res.send( resource );
    } else {
        next( new EntityNotFoundError( id, `locations.route->patch`) );
    }
});

router.delete(`/:id`, async(req, res, next) => {

    const id = Number( req.params.id );

    // Call service
    const [ result, error ] = await handleAsync( deleteResource(id) );
    if ( error ) return next( error );

    if ( result.affected === 1 ) {
        res.send( {Deleted: true} ); 
    } else {
        next( new EntityNotFoundError( id, `locations.route->delete`) );
    }
});


export default router;
        

