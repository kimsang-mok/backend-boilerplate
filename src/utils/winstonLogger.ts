import path from "path";
import winston, { format } from "winston";
// to create nwe log file each day and stores old log files in a compressed format
import winstonDaily from "winston-daily-rotate-file";

// main directory where the log files will be stored
const logDir = "logs"; // logs 디렉토리 하위에 로그 파일 저장

const logFormat = format.printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});
export const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    logFormat
  ),

  defaultMeta: { service: "user-service" },
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`, // file 이름 날짜로 저장
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true
    }),
    // warn 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/warn",
      filename: `%DATE%.warn.log`, // file 이름 날짜로 저장
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true
    })
  ],
  exceptionHandlers: [
    // save exception log messages into a `except` subdirectory
    // 캐치되지 않은 (정의되지 않은 레벨) 예외를 기록하는 예외 처리기
    new winstonDaily({
      dirname: path.join(logDir, "except"),
      filename: "except-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
        })
      )
    })
  ],
  // the app will continue running even if an uncaught exception is logged
  exitOnError: false // 캐치되지 않은 예외를 기록한 후 애플리케이션 실행을 계속합니다.
});

// logger.stream = {
//   write: (message: any) => {
//     logger.info(message);
//   }
// };

// in addition to being saved, log messages  will also be output to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: format.combine(format.colorize({ all: true }), logFormat)
      // format: winston.format.simple(),
    })
  );
}
