/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var utils = require('./utils');
var database = module.exports;
var knex=appRequire('init/knex').knex;
var log4js=require('log4js');
var logger=log4js.getLogger('database');

exports.getLoginInfo=function(user,pass,callback){
  knex('user').select().where({
      userName:user,
      password:pass,
  }).then(result=>{
    if(result.length){
      callback(null,result[0].userName)
    }else{
        callback(utils.createApiError('LOGIN_ERROR', '用户名或密码错'));
    }
  }).catch(err=>{
      callback(err);
  });
};


// 获取应用信息
exports.getAppInfo = function (id, callback) {
  knex('app').select().where({
      id:id,
  }).then(success=>{
    if(success.length){
      callback(null,success[0]);
    }
    else{
      callback(utils.createApiError('APP_ERROR','找不到此APPID'));
    }
  }).catch(err=>{
    callback(err);
  });
};


// 验证应用的回调URL是否合法
exports.verifyAppRedirectUri = function (clientId, url, callback) {
  database.getAppInfo(clientId, function (err, info) {
    if (err) return callback(err);
    if (!info) return callback(utils.invalidParameterError('client_id'));

    callback(null, info.redirectUri === url);
  });
};


//------------------------------------------------------------------------------
var dataAuthorizationCode = {};

// 生成授权Code
exports.generateAuthorizationCode = function (userId, clientId, redirectUri, callback) {
  var code = utils.randomString(20);
  dataAuthorizationCode[code] = {
    clientId: clientId,
    userId: userId
  };
  //记录授权
  var forInsrt={
      appId:clientId,
      userId:userId,
      authTime:new Date().toLocaleString(),
      code:code
  };
  knex('authlog').insert(forInsrt).then(success=>{
      callback(null, code);
  }).catch(err=>{
      callback(err);
  });

};

// 验证授权码是否正确
exports.verifyAuthorizationCode = function (code, clientId, clientSecret, redirectUri, callback) {
  var info = dataAuthorizationCode[code];
  if (!info) return callback(utils.invalidParameterError('code'));
  if (info.clientId !== clientId) return callback(utils.invalidParameterError('code'));

  database.getAppInfo(clientId, function (err, appInfo) {
    if (err) return callback(err);
    if (appInfo.secret !== clientSecret) return callback(utils.invalidParameterError('client_secret'));
    if (appInfo.redirectUri !== redirectUri) return callback(utils.invalidParameterError('redirect_uri'));

    callback(null, info.userId);
  });
};

// 删除授权Code
exports.deleteAuthorizationCode = function (code, callback) {
  delete dataAuthorizationCode[code];
  callback(null, code);
};


//------------------------------------------------------------------------------
var dataAccessToken = [];

// 生成access_token
exports.generateAccessToken = function (userId, clientId, callback) {
  var code = utils.randomString(20);
  dataAccessToken[code] = {
    clientId: clientId,
    userId: userId
  };
  callback(null, code);
};

// 查询access_token的信息
exports.getAccessTokenInfo = function (token, callback) {
  var info = dataAccessToken[token];
  if (!info) return callback(utils.invalidParameterError('token'));
  callback(null, info);
};

//------------------------------------------------------------------------------

var faker = require('faker');
// 设置语言为简体中文
faker.locale = 'zh_CN';

var dataArticles = [];
var ARTICLE_NUM = 100;

// 生成文章列表
for (var i = 0; i < ARTICLE_NUM; i++) {
  dataArticles.push({
    id: faker.random.uuid(),
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    content: faker.lorem.paragraphs(10)
  });
}

// 查询文章列表的函数
exports.queryArticles = function (query, callback) {
  query.$skip = utils.defaultNumber(query.$skip, 0);
  query.$limit = utils.defaultNumber(query.$limit, 10);
  // 返回指定范围的文章数据
  callback(null, dataArticles.slice(query.$skip, query.$skip + query.$limit));
};
