import { StatusCodes } from "http-status-codes";
import connection from "../../Db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ADMIN_JWT_SECRET_KEY = process.env.ADMIN_JWT_SECRET_KEY;

export async function add_users(req, res) {
  var { admin_id, type, name, phone_no, is_active, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const password_salt = await bcrypt.hash(password, salt);
  console.log(password_salt);

  connection.query(
    "insert into users(`admin_id`,`type`,`name`,`phone_no`,`is_active`,`email`,`password`) VALUES('" +
      admin_id +
      "','" +
      type +
      "','" +
      name +
      "','" +
      phone_no +
      "','" +
      is_active +
      "','" +
      email +
      "','" +
      password_salt +
      "')",
    (err, rows) => {
      if (err) {
        console.log("error in add user" + err);
        // res
        //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
        //   .json({ message: "something went wrong" });

        if (err.code == "ER_DUP_ENTRY") {
          res.status(200).send({
            response:
              "email already exist, check your mail or try after sometime",
            success: false,
          });
        } else {
          res.status(200).send({ response: "error", success: false });
        }
      } else {
        res.status(StatusCodes.OK).json({ message: "user added successfully" });
      }
    }
  );
}

export async function get_all_user(req, res) {
  let { admin_id } = req.body;
  connection.query(
    "select * from users where admin_id='" + admin_id + "' AND is_deleted='0' ",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function admin_login(req, res) {
  var { email, password } = req.body;

  // const salt = await bcrypt.genSalt(10);
  // password_salt = await bcrypt.hash(admin_password, salt);
  // //console.log(password_salt)

  // const validPassword = await bcrypt.compare(admin_password,'$2b$10$81UsHRVghsW.47o7dMqiQ.DsJgTfz333wDFKTYZYQOGkJhoSEr1m6');
  // //console.log(validPassword)
  if (email && password) {
    connection.query(
      'SELECT `id`,`admin_id`,`type`,`name`, `email` , `password` FROM `users`  WHERE `email` ="' +
        email +
        '"',
      async (err, results) => {
        if (err) {
          //console.log(err)
          res.send(err);
        } else {
          if (results != "") {
            //__________bcrypt_____________________________________

            var db_psw = JSON.parse(JSON.stringify(results[0].password));
            // //console.log(typeof psw)
            const validPassword = await bcrypt.compare(password, db_psw);

            if (validPassword) {
              jwt.sign(
                { id: results[0].id },
                ADMIN_JWT_SECRET_KEY,
                function (err, token) {
                  //console.log(token);
                  if (err) {
                    console.log(err);
                  }
                  res.send({
                    resCode: "101",
                    userDetail: results,
                    status: true,
                    token: token,
                  });
                }
              );
            } else {
              res.send({ resCode: "102", message: "password not matched" });
            }
          } else {
            res.send({ resCode: "103", message: "Email not found" });
          }
        }
      }
    );
  } else {
    res.send({ resCode: "104", message: "please fill input" });
  }
}

export async function user_details(req, res) {
  var { id } = req.body;
  connection.query(
    "select * from users where id= '" + id + "'",
    (err, rows) => {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res.status(StatusCodes.OK).json(rows);
      }
    }
  );
}

export async function update_user(req, res) {
  var { id, type, name, phone_no, is_active, email, password } = req.body;
  console.log(req.user);
  const salt = await bcrypt.genSalt(10);
  const password_salt = await bcrypt.hash(password, salt);
  console.log(password_salt);
  connection.query(
    "UPDATE `users` SET `admin_id`='" +
      req.user +
      "',`type`='" +
      type +
      "',`name`='" +
      name +
      "',`phone_no`='" +
      phone_no +
      "',`email`='" +
      email +
      "',`password`='" +
      password_salt +
      "',`is_active`='" +
      is_active +
      "' WHERE id='" +
      id +
      "' ",
    (err, rows) => {
      if (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "something went wrong" });
      } else {
        res
          .status(StatusCodes.OK)
          .json({ message: "updated user successfully" });
      }
    }
  );
}

export async function delete_user(req, res) {
  var { id, is_deleted } = req.body;

  if (id != "" && is_deleted != "") {
    connection.query(
      "update users  set `is_deleted`='" +
        is_deleted +
        "' where id ='" +
        id +
        "'",
      (err, rows) => {
        if (err) {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "something went wrong" });
        } else {
          res
            .status(StatusCodes.OK)
            .json({ message: "delete user successfully" });
        }
      }
    );
  } else {
    res.status(StatusCodes.OK).json({ message: "fill all inputs" });
  }
}

export async function search_user(req, res) {
  const { admin_id } = req.query;

  const page = parseInt(req.query.page); // Current page number
  const limit = parseInt(req.query.limit); // Number of items per page
  const offset = (page - 1) * limit;
  var stringsearch =
    "SELECT * FROM `users` WHERE admin_id='" + admin_id + "' AND ";

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
      "SELECT * FROM `users` WHERE admin_id='" + admin_id + "' AND ";
  }
  console.log(
    "" +
      stringsearch +
      " is_deleted = 0 ORDER BY id DESC  LIMIT " +
      limit +
      " OFFSET " +
      offset +
      ""
  );

  connection.query(
    "" +
      stringsearch +
      " is_deleted = 0 ORDER BY id DESC  LIMIT " +
      limit +
      " OFFSET " +
      offset +
      "",
    (err, rows, fields) => {
      if (err) {
        //console.log("/category_error" + err)
        res.status(502).send(err);
      } else {
        const countQuery =
          "SELECT COUNT(*) as total_count FROM users  WHERE admin_id='" +
          admin_id +
          "'AND  is_deleted = 0 ORDER BY id DESC  ";
        connection.query(countQuery, (err, countResult) => {
          if (err) {
            console.error("Error executing the count query: " + err.stack);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          const totalRecords = countResult[0].total_count;
          const totalPages = Math.ceil(totalRecords / limit);
          const nextPage = page < totalPages ? page + 1 : null;
          const prevPage = page > 1 ? page - 1 : null;
          res.json({
            data: rows,
            page,
            totalPages,
            totalRecords,
            nextPage,
            prevPage,
          });
        });
      }
    }
  );
}
