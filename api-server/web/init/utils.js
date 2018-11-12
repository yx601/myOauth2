const path=require("path");
const fs=require('fs');
const log4js=require('log4js');
const logger=log4js.getLogger('utils');

global.appRequire=(filePath) => {
    return require(path.resolve(__dirname,'../'+filePath));
}

global.appFork=(filePath)=>{
    const child=require('child_process');
    return child.fork(path.resolve(__dirname,'../'+filePath));
}

const loadDb = dbPath =>{
    const promises=[];
    logger.info('Load db Directory :'+dbPath);
    try{
        const files=fs.readdirSync(path.resolve(__dirname,'../'+dbPath));
        if(files.length>0){
            files.forEach(f =>{
                logger.info(`Load db file:[ ${f} ]`);
                promises.push(appRequire(`${ dbPath }/${ f }`).createTable());
            });
        }
    }catch(err){
        logger.error(err);
    }
    return Promise.all(promises).catch(err=>{
        logger.error(err);
    });
};

loadDb('./init/db');