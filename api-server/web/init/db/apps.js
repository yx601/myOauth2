const knex=appRequire('init/knex').knex ;
const tableName='app';

const createTable=async() => {
    const exist=await knex.schema.hasTable(tableName);
    if(exist){
        return;
    }
    return knex.schema.createTableIfNotExists(tableName,table=>{
        table.string('id').primary();
        table.string('name');
        table.string('description');
        table.string('secret');
        table.string('redirectUri');
    });
}


exports.createTable = createTable;
