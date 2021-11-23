import express  from 'express';
import { createResource, findResource, findOneResource, patchResource, deleteResource } from '../../services/projects.service';
import { handleAsync, EntityNotFoundError  } from '../../shared/common';
import validationMiddleware from '../../middlewares/validation.middleware';
import { ProjectValidator } from '../../models/project.entity';
import logger from '../../shared/logger';


let router = express.Router( );

// API Endpoint '/users'
router.post(`/`, validationMiddleware( ProjectValidator ), async(req, res, next) => {

    const model = req.body;
    logger.info(`Body : `, model);

    // Call service
    const [ newResourse, error ] = await handleAsync( createResource(model) );
    if ( error ) return next ( error );

    res.send( newResourse );
});

router.get(`/`, async(req, res, next) => {

    // Retreive fields from Query params
    let options: any = req.query;

    // Call service
    const [ allResources, error ] = await handleAsync( findResource(options) );
    if ( error ) return next ( error );

    res.send( allResources );    
});

router.get(`/:id`, async(req, res, next) => {

    const id = Number( req.params.id );
    let options: any = req.query;

    // Call service
    const [ resource, error ] = await handleAsync( findOneResource(id, options) );
    if ( error ) return next ( error );

    if ( resource ) {
        res.send( resource );
    } else {
        next ( new EntityNotFoundError( id, `users.route->get/:id` ) );
    }
});

router.patch(`/:id`, validationMiddleware( ProjectValidator, { skipMissingProperties: true } ), async(req, res, next) => {

    const id = Number( req.params.id );
    const patchedModel = req.body;

    // Call service
    const [ resource, error ] = await handleAsync( patchResource(id, patchedModel) );
    if ( error ) return next ( error );

    if ( resource ) {
        res.send( resource );
    } else {
        next ( new EntityNotFoundError( id, `users.route->patch` ) );
    }
});

router.delete(`/:id`, async(req, res, next) => {

    const id = Number( req.params.id );

    // Call service
    const [ result, error ] = await handleAsync( deleteResource(id) );
    if ( error ) return next ( error );

    if ( result.affected === 1 ) {
        res.send( {deleted: true} );
   } else {
        next ( new EntityNotFoundError( id, `users.route->delete` ) );
   }
});


export default router;