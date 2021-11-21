import { ConnectionOptions } from 'typeorm';
import nconf from './shared/config';


const config: ConnectionOptions = {
    type: 'postgres',
    host: nconf.get('DATABASE_HOST'),
    port: nconf.get('DATABASE_PORT'),
    username: nconf.get('DATABASE_USERNAME'),
    password: nconf.get('DATABASE_PASSWORD'),
    database: nconf.get('DATABASE'),
    entities: [
        __dirname + `/models/*.entity{.ts,.js}`
    ],
    synchronize: true
}

export default config;
