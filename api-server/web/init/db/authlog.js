const knex=appRequire('init/knex').knex;
const tableName='authLog';

const createTable=async () => {
    const exist=await knex.schema.hasTable(tableName);
    if(exist){
        return;
    }
    return knex.schema.createTableIfNotExists(tableName,table=>{
        table.increments('id').primary();
        table.string('appId');
        table.string('userId');
        table.string('authTime');
        table.string('code');
});
}

exports.createTable=createTable;