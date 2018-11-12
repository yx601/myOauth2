const knex=appRequire('init/knex').knex;
const tableName='user';

const createTable= async() => {
    const exist=await knex.schema.hasTable(tableName);
    if(exist){
        const hasUserId=await knex.schema.hasColumn(tableName,'id');
        if(!hasUserId){
            await knex.schema.table(tableName,table => {
                table.integer('id').primary();
            });
        }
        return;
    }
    return knex.schema.createTableIfNotExists(tableName,table=>{
        table.increments('id').primary();
        table.string('userName');
        table.string('password');
        table.string('email');
    });
}

exports.createTable=createTable;