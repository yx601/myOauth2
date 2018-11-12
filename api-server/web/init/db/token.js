const knex=appRequire('init/knex').knex;
const tableName='tokens';

const createTable=async () => {
    const exist=await knex.schema.hasTable(tableName);
    if(exist){
        return;
    }
    return knex.schema.createTableIfNotExists(tableName,table=>{
        table.increments('id').primary();
        table.string('appId');
        table.string('token');
        table.string('createTime');
        table.integer('expire').defaultTo(3*3600);
    });
}

exports.createTable=createTable;