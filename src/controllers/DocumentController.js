import fs from "fs";
import path from "path";
import connection from "../../Db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { StatusCodes } from "http-status-codes";

import nodemailer from "nodemailer";

var rendomNumber = Math.floor(100000 + Math.random() * 900000);

export function client_documents_upload(req, res) {
  var {
    admin_id,
    client_id,
    client_name,
    document_title,
    document_url,
    document_type,
  } = req.body;

  const folderName =
    path.join(__dirname, "../../") +
    `public/document_upload/${client_id}-${client_name}/`;

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }

  if (document_type === "msword") {
    document_type = "doc";
  } else if (
    document_type ===
    "vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    document_type = "docx";
  } else if (document_type === "vnd.ms-excel") {
    document_type = "xls";
  } else if (
    document_type === "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    document_type = "xlsx";
  }

  try {
    console.log(folderName);

    var name_str = "" + document_title + "" + rendomNumber + "";

    fs.writeFileSync(
      folderName + name_str + "." + document_type + "",
      document_url,
      "base64"
    );
  } catch (err) {
    console.log(err);
  }

  connection.query(
    "INSERT INTO `documents`( `admin_id`, `client_id`,`document_type`, `document_title`, `document_url`) VALUES (" +
      admin_id +
      ',"' +
      client_id +
      '","' +
      document_type +
      '","' +
      document_title +
      '","http://192.168.29.226:8888/document_upload/' +
      client_id +
      "-" +
      client_name +
      "/" +
      name_str +
      "." +
      document_type +
      '")',
    (err, rows, fields) => {
      if (err) {
        //console.log(err)
        res.status(200).send(err);
      } else {
        res.status(200).send({ message: "Document upload successfully" });
      }
    }
  );
}

export function get_documents(req, res) {
  var { client_id } = req.body;

  connection.query(
    "SELECT * FROM documents WHERE `client_id`='" +
      client_id +
      " '   AND is_deleted='0' ",
    (err, rows, fields) => {
      if (err) {
        //console.log(err)
        res.status(200).send(err);
      } else {
        //console.log("rows")
        res.status(200).send(rows);
      }
    }
  );
}

export function get_documents_By_Id(req, res) {
  var { id } = req.body;

  connection.query(
    "SELECT * FROM documents WHERE `id`=" + id + " ",
    (err, rows, fields) => {
      if (err) {
        //console.log(err)
        res.status(200).send(err);
      } else {
        //console.log("rows")
        res.status(200).send(rows);
      }
    }
  );
}

// export function client_documents_update(req, res) {
//   var rendomNumber = Math.floor(100000 + Math.random() * 900000);
//   var {
//     admin_id,
//     client_id,
//     client_name,
//     document_title,
//     document_url,
//     document_type,
//   } = req.body;

//   const folderName =
//     path.join(__dirname, "../../") +
//     `public/document_upload/${client_id}-${client_name}/`;

//   try {
//     if (!fs.existsSync(folderName)) {
//       fs.mkdirSync(folderName);
//     }
//   } catch (err) {
//     console.error(err);
//   }

//   try {
//     console.log(folderName);

//     var name_str = "" + document_title + "" + rendomNumber + "";

//     fs.writeFileSync(
//       folderName + name_str + "." + document_type + "",
//       document_url,
//       "base64"
//     );
//   } catch (err) {
//     console.log(err);
//   }

//   connection.query(
//     "INSERT INTO `documents`( `admin_id`, `client_id`,`document_type`, `document_title`, `document_url`) VALUES (" +
//       admin_id +
//       ',"' +
//       client_id +
//       '","' +
//       document_type +
//       '","' +
//       document_title +
//       '","http://localhost:8888/document_upload/' +
//       client_id +
//       "-" +
//       client_name +
//       "/" +
//       name_str +
//       "." +
//       document_type +
//       '")',
//     (err, rows, fields) => {
//       if (err) {
//         //console.log(err)
//         res.status(200).send(err);
//       } else {
//         res.status(200).send({ message: "Document upload successfully" });
//       }
//     }
//   );
// }

export async function delete_document(req, res) {
  var { id, is_deleted } = req.body;

  if (id != "" && is_deleted != "") {
    connection.query(
      "update documents  set `is_deleted`='" +
        is_deleted +
        "' where id ='" +
        id +
        "'",
      (err, rows) => {
        if (err) {
          console.log(err);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "something went wrong" });
        } else {
          res
            .status(StatusCodes.OK)
            .json({ message: "delete document successfully" });
        }
      }
    );
  } else {
    res.status(StatusCodes.OK).json({ message: "fill all inputs" });
  }
}

export async function testingmailer(req, res) {
  var { email } = req.body;

  if (email != "") {
    connection.query(
      "SELECT * FROM clients WHERE `email`='" + email + " '  ",
      (err, rows, fields) => {
        if (err) {
          console.log(err);
        } else {
          if (rows != "") {
            var mailResponse = JSON.parse(JSON.stringify(rows));

            var clientName = mailResponse[0].name;

            let text =
              "/home/we2code/Desktop/DMS/dmsBackend/public/document_upload_zipfiles/";
            let result = text.replace(
              "/home/we2code/Desktop/DMS/dmsBackend/public",
              "http://localhost:8888"
            );

            //           // console.log(result);
            let mailTransporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "rahul.verma.we2code@gmail.com",
                pass: "sfbmekwihdamgxia",
              },
            });
            let mailDetails = {
              from: "rahul.verma.we2code@gmail.com",
              to: `${email}`,
              subject: "Test mail",
              text: "Node.js testing mail",
              attachments: [
                {
                  filename: `${clientName}.zip`,
                  path: `${result}/${clientName}.zip`,
                },
              ],
            };
            mailTransporter.sendMail(mailDetails, function (err, data) {
              if (err) {
                res.status(200).send({ message: "email not send" });
              } else {
                res
                  .status(StatusCodes.OK)
                  .json({ message: "email send successfully" });
              }
            });
          } else {
            res.status(200).send({ message: "somthing went wrong" });
          }
        }
      }
    );
  } else {
    res.status(200).send({ message: "please fill Email" });
  }
}

// create zip
//           const folderName =
//             path.join(__dirname, "../../") +
//             `public/document_upload/${clientID}-${clientName}/`;
//           const createzipFolder =
//             path.join(__dirname, "../../") +
//             `public/document_upload_zipfiles/${clientID}-${clientName}-allZip/`;
//           try {
//             if (fs.existsSync(folderName)) {
//               fs.mkdirSync(createzipFolder);
//             }
//           } catch (err) {
//             if (fs.existsSync(createzipFolder)) {
//               console.log("zip  folder is already exist");
//             }
//           }
//           // function createZipFile(folderName, createzipFolder) {
//           //   const output = fs.createWriteStream(createzipFolder);
//           //   const archive = archiver("zip", { zlib: { level: 9 } });
//           //   return new Promise((resolve, reject) => {
//           //     output.on("close", () => {
//           //       console.log("Zip file created successfully.");
//           //       resolve();
//           //     });
//           //     archive.on("error", (err) => {
//           //       console.error("Error creating zip file:", err);
//           //       reject(err);
//           //     });
//           //     archive.pipe(output);
//           //     archive.directory(folderName, false);
//           //     archive.finalize();
//           //   });
//           // }
//           // createZipFile(folderName, `${createzipFolder}/${clientName}.zip`)
//           //   .then(() => {
//           //     console.log("Zip file creation completed.");
//           //   })
//           //   .catch((error) => {
//           //     console.error("Error creating zip file:", error);
//           //   });
//           connection.query(
//             "SELECT * FROM  documents WHERE `client_id`='" +
//               clientID +
//               " '  ",
//             (err, rows, fields) => {
//               if (err) {
//               } else {
//                 // Create a writable stream to store the data
//                 const outputStream = fs.createWriteStream("data.zip");
//                 // Create an archiver instance
//                 const archive = archiver("zip", {
//                   zlib: { level: 9 }, // Compression level (optional)
//                 });
//                 // Pipe the output stream to the archive
//                 archive.pipe(outputStream);
//                 // Iterate over the fetched data and add it to the archive
//                 rows.forEach((row, index) => {
//                   // Add each row to the archive as a file
//                   archive.append(JSON.stringify(row), {
//                     name: `data${index}.json`,
//                   });
//                 });
//                 // Finalize the archive
//                 archive.finalize();
//                 console.log(rows);
//               }
//             }
//           );

export async function search_document(req, res) {
  const { client_id } = req.query;
  var stringsearch =
    "SELECT * FROM `documents` WHERE client_id='" + client_id + "' AND ";

  var all_blank = true;
  var catobj = req.body;
  var objvalue = Object.values(catobj);
  var objkey = Object.keys(catobj);

  for (let m = 0; m < objkey.length; m++) {
    if (objvalue[m] != "") {
      stringsearch +=
        " `" +
        objkey[m] +
        "` LIKE '%" +
        objvalue[m].replace(/[^a-zA-Z0-9 ]/g, "").trim() +
        "%' AND";
      all_blank = false;
    } else {
      console.log("null" + m);
    }
  }

  if (all_blank) {
    stringsearch =
      "SELECT * FROM `documents` WHERE client_id='" + client_id + "' AND ";
  }
  console.log("" + stringsearch + " is_deleted = 0 ORDER BY id DESC");

  connection.query(
    "" + stringsearch + " is_deleted = 0 ORDER BY id DESC",
    (err, rows, fields) => {
      if (err) {
        //console.log("/category_error" + err)
        res.status(502).send(err);
      } else {
        res.status(200).send(rows);
      }
    }
  );
}
