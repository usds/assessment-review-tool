import { Pool } from 'pg';
import { dbURI, env } from '../config';

// We had to change this out for the conn string in postgres 15+
// https://node-postgres.com/features/ssl

 function CreatePool(){
    return new Pool({
    connectionString: dbURI,
    max:20,
    idleTimeoutMillis:60000,
    connectionTimeoutMillis: 2000,
    ssl:{
      rejectUnauthorized: false
    }
  
});
};
export default CreatePool;