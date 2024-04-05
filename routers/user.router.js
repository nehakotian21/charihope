import express from "express";
import { addUser, deleteUser, getUser, getUsers, signIn, signUp, updateUser } from "../controllers/user.controller";

const router = express.Router();
router.get("/get-users", getUsers);
router.post("/add-user", addUser)
router.get("/get-user/:user_id", getUser)
router.put("/update-user/:user_id", updateUser)
router.delete("/delete-user/:user_id", deleteUser)


// auth

router.post('/sign-up', signUp);
router.post("/sign-in",signIn)


export default router