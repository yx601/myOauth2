/**
 * 简单API服务器
 *
 * @author yangxi
 */
var log4js=require('log4js');
var logger=log4js.getLogger('login');
var middlewares = require('../lib/middlewares');
var database = require('../lib/database');
var utils = require('../lib/utils');
var knex=appRequire('init/knex').knex;

exports.logout=function(req,res,next){
    req.session.user='';
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<head><meta charset="utf-8"/></head>');
    res.end('注销成功');
}

exports.checkDirectAccess=function(req,res,next){
    if(!req.query.redirectUri){
        return next(utils.missingParameterError('redirectUri'));
    }
    next();
}

// 检查参数
exports.checkLoginParams = function (req, res, next) {
    // 检查参数
    logger.info(req.body.user);
    if (!req.body.user) {
        return next(utils.missingParameterError('user'));
    }
    if (!req.body.password) {
        return next(utils.missingParameterError('password'));
    }

    // 验证client_id是否正确，并查询应用的详细信息
    database.getLoginInfo(req.body.user,req.body.password, function (err, ret) {
        if (err) return next(err);
        logger.info(ret);
        req.session.user = ret;
        next();
    });

};

// 显示确认界面
exports.showLogin = async  (req, res, next)=> {
    res.locals.appList="";
    res.locals.redirect_uri ='';
    res.locals.user="";
    if(req.query.redirectUri){
        res.locals.redirect_uri =req.query.redirectUri;
    }
    if(req.session.user){
        res.locals.user=req.session.user;
        if(req.body.redirectUri){

            res.locals.redirect_uri=decodeURI(req.body.redirectUri);
            logger.error(res.locals.redirect_uri);
        }
        //
        // const appList=await knex('app').select();
        // res.locals.appList=appList;
    }
    res.render('login');
};

