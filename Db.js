import mysql from "mysql";
import "dotenv/config";

const connection = mysql.createConnection({
  host: "localhost",
  user: "we2code",
  password: "we2code",
  database: "DocumentDb",
});

// const connection = mysql.createConnection({
//   host: "mysql.indiakinursery.com",
//   user: "indiakinursery",
//   password: "WE2code@2023",
//   database: "documentdb",
// });

connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

export default connection;
