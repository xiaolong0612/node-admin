/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-24 18:26:50
 * @LastEditTime: 2023-08-25 15:28:55
 * @LastEditors: Amber
 */
const db = require('../db/db')
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, metadata, json, splat } = format
require('winston-mongodb');
const { getClientIp } = require('../utils')
const ua = require('ua-parser-js');

const ignorePrivate = format((info, opts) => {
  // string use util.format
  if(info.req){
    const device = ua(info.req.headers['user-agent'])
    info.browser = device.browser.name
    info.os = device.os.name
    info.ip = getClientIp(info.req)
    delete info.req
  }
  return info;
});

const formatter = combine(
  ignorePrivate(),
  metadata(),
  splat(),
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  json(),
);
// const levels = { 
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// };
const adminLogs = createLogger({
  transports:[
    // File transport
    // new transports.File({
    //   filename: 'logs/server.log',
    //   format:format.combine(
    //     format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
    //     format.align(),
    //     format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    //   )
    // }),
    // new transports.Console({
    //   format: formatter
    // }),
    // MongoDB transport
    new transports.MongoDB({
      //mongo database connection link
      db : db.uri,
      options: {
          useUnifiedTopology: true
      },
      // A collection to save json formatted logs
      collection: 'admin_logs',
      format: formatter
    })
  ]
})
module.exports = {
  adminLogs
}