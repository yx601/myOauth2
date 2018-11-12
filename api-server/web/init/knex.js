var knex;
const connection={
    host:'localhost',
    user:"oath",
    password:'oath123',
    database:'oath',
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
};
knex=require('knex')({
    client:'mysql',
    connection:connection,
    useNullAsDefault:true,
    pool:{min:2,max:10},
    acquireConnectionTimeout:120*1000,
});

exports.knex=knex;