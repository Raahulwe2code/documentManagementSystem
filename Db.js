import mysql from "mysql";
import "dotenv/config";
// MYSQL_ADDON_HOST=bwoill6ixggdovjdxfzw-mysql.services.clever-cloud.com
// MYSQL_ADDON_DB=bwoill6ixggdovjdxfzw
// MYSQL_ADDON_USER=ubkxmigstvkzomce
// MYSQL_ADDON_PORT=3306
// MYSQL_ADDON_PASSWORD=38i6RSJ023zN3RGfbC36
// MYSQL_ADDON_URI=mysql://ubkxmigstvkzomce:38i6RSJ023zN3RGfbC36@bwoill6ixggdovjdxfzw-mysql.services.clever-cloud.com:3306/bwoill6ixggdovjdxfzw

// A package.json file containing the fields "name", "version" and "script.start" (or "main") is required.
// The application must listen on port 8080.
// Documentation about Node.Js is available!

// db_name= documentdb
// Server:- daigle.iad1-mysql-e2-4b.dreamhost.com
// Username: indiakinursery
// pwd: WE2code@2023
console.log();
// const connection = mysql.createConnection({
//   host: "bwoill6ixggdovjdxfzw-mysql.services.clever-cloud.com",
//   user: "ubkxmigstvkzomce",
//   password: "38i6RSJ023zN3RGfbC36",
//   database: "bwoill6ixggdovjdxfzw",
// });

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "we2code",
//   password: "we2code",
//   database: "DocumentDb",
// });

const connection = mysql.createConnection({
  host: "daigle.iad1-mysql-e2-4b.dreamhost.com",
  user: "indiakinursery",
  password: "WE2code@2023",
  database: "documentdb",
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

export default connection;
