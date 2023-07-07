import express from "express";
import fetchuser from "../../middleware/auth_by_token.js";
import {
  add_users,
  admin_login,
  delete_user,
  forgot_password,
  get_all_user,
  reset_password,
  search_user,
  update_user,
  user_details,
} from "../controllers/UsersController.js";

const usersRouter = express.Router();
usersRouter.post("/add_users", add_users);
usersRouter.post("/get_users", get_all_user);
usersRouter.post("/search_user", search_user);
usersRouter.post("/forget_password", forgot_password);
usersRouter.post("/reset_password", reset_password);
usersRouter.post("/admin_login", admin_login);
usersRouter.post("/getUserById", fetchuser, user_details);
usersRouter.put("/update_user", fetchuser, update_user);
usersRouter.put("/delete_user", delete_user);
export default usersRouter;
