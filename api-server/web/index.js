/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const log4js=require('log4js');

log4js.configure({
    appenders: { system: { type: 'console',  } },
    categories: { default: { appenders: ['system'], level: 'debug' } }
});

const logger=log4js.getLogger('system');
logger.info('system start..');
process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    logger.error(`Caught exception:`);
    logger.error(err);
});

require('./init/utils');

var path = require('path');
var url = require('url');
var express = require('express');

//my add
const session=require('express-session');

const knex=require('./init/knex').knex;

const knexSessionStore=require('connect-session-knex')(session);
const store=new knexSessionStore({ knex });

const sessionParser=session({
    secret:'Wt9X9WFbWHm',
    rolling:true,
    resave:true,
    saveUninitialized:true,
    cookie:{secure:false,httpOnly:true,maxAge:7*24*3600*1000},
    store,
});



var routes = require('./routes');
var middlewares = require('./lib/middlewares');


var app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(sessionParser);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(middlewares.extendAPIOutput);
app.use('/api', middlewares.verifyAccessToken);
require('./routes')(app);
app.use(middlewares.apiErrorHandle);



app.listen(3000);

