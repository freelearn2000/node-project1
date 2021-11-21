import { getRepository } from 'typeorm';
import { News } from '../models/news.entity';
import { ServerError, handleAsync } from '../shared/common';


export const createResource = async( model: any ) => {

    const tempObject = getRepository( News ).create( model );
    let [ newResource, error ] = await handleAsync( getRepository(News).save(tempObject) );

    if ( error ) throw new ServerError( error.message, `news.route->createResource` );

    return newResource;
}

export const findResource = async( options: any ) => {

    let allResources = null;
    let error = null;

    // if ( options ) {

        // 1. Partial Response (based on fields)
        // Format : ?fields=id,title
        let fields: any = options.fields;
        fields = fields?.split(`,`).map( (item: string) => {
            return `entity.${item}`;
        });

        // 2. Pagination (based on offset & limit)
        // offset : start of records
        // limit : number of records
        // Format : ?offset=0&limit=5
        let offset: any = options.offset ?? 0;
        let limit: any = options.limit;

        // 3. Search (Case-Insensitive search on default field `title`)
        // Format : ?q=news
        let where: string = options.q ?? ``;

        // 4. Sorting (based on fields; default sort is by `id`)
        // Format : ?order=title
        let order: string = options.order ? `entity.${options.order}` : `entity.id`;

        // Partial selection
        [ allResources, error ] = await handleAsync( 
            getRepository( News )
            .createQueryBuilder( `entity` )
            .select( fields )
            .where( `LOWER(entity.title) like LOWER(:title)`, { title: `%${where.toLowerCase()}%` } )
            .skip( offset )
            .take( limit )
            .orderBy( order, `ASC` )
            .getMany( )
        );
    // } else {

    //     // Full selection
    //     [ allResources, error ] = await handleAsync( getRepository(News).find() );
    // }
    
    if ( error ) throw new ServerError( error.message, `news.route->findResource` );

    return allResources;
}

export const findOneResource = async( id: number, options: any ) => {

     // 1. Filter (based on fileds)
     let fields: any = options.fields;
     fields = fields?.split(`,`).map( (item: string) => {
         return `entity.${item}`;
     });

    let [ resource, error ] = await handleAsync( 
        getRepository( News )
        .createQueryBuilder( `entity` )
        .select( fields )
        .getOne( )
    );

    // let [ resource, error ] = await handleAsync( getRepository(News).findOne(id) );
    if ( error ) throw new ServerError( error.message, `news.route->findOneResource` );

    return resource;
}

export const patchResource = async( id: number, patchedModel: any ) => {

    let [ result, error ] = await handleAsync( getRepository(News).update(id, patchedModel) );
    if ( error ) throw new ServerError( error.message, `news.route->patchResource` );

    let [ resource, error2 ] = await handleAsync( getRepository(News).findOne(id) );
    if ( error2 ) throw new ServerError( error2.message, `news.route->patchResource` );

    return resource;
}

export const deleteResource = async( id: number ) => {

    let [ result, error ] = await handleAsync( getRepository(News).delete(id) );
    if ( error ) throw new ServerError( error.message, `news.route->deleteResource` );

    return result;
}
