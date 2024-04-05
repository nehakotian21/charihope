import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    if (users) {
      return res.status(200).json({
        data: users,
        message: "fetched",
      });
    }

    return res.status(400).json({
      message: "Bad Request",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addUser = (req, res) => {
  try {
    const { firstName, lastName, email, password, contact,textarea } = req.body;

    const saveUser = new userModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      contact: contact,
      textarea:textarea
    });

    saveUser.save();

    if (saveUser) {
      return res.status(201).json({
        data: saveUser,
        message: "created",
      });
    }

    return res.status(400).json({
      message: "Bad Request",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const user = await userModel.findOne({ _id: userID });

    if (user) {
      return res.status(200).json({
        data: user,
        message: "fetched",
      });
    }

    return res.status(400).json({
      message: "Bad Request",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const { firstName, lastName, email, password, contact,textarea } = req.body;
    const update_user = await userModel.updateOne(
      { _id: userID },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          contact: contact,
          textarea: textarea
        },
      }
    );

    if (update_user) {
      return res.status(200).json({
        message: "Updated",
      });
    }

    return res.status(400).json({
      message: "Bad Request",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userID = req.params.user_id;

    const delete_user = await userModel.deleteOne({ _id: userID });

    if (delete_user) {
      return res.status(200).json({
        message: "Deleted",
      });
    }

    return res.status(400).json({
      message: "Bad Request",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Auth

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existUser = await userModel.findOne({ email: email });
    if (existUser)
      return res.status(200).json({
        message: "User already exist.",
      });

    const hashedPassword = bcrypt.hashSync(password, 10); // password convert
    console.log(password, hashedPassword);

    
    const saveUser = await userModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    if (saveUser) {
      return res.status(201).json({
        message: "Signup success",
      });
    }
    return res.status(400).json({
      message: "Bad request",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await userModel.findOne({ email: email });
    if (!existUser)
      return res.status(200).json({ message: "User doesn't exist." });

    const checkPassword = bcrypt.compareSync(password, existUser.password);
    if (!checkPassword)
      return res.status(200).json({ message: "Invalid credential" });

    const token = jwt.sign(
      {
        _id: existUser._id,
        email: existUser.email,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log("tokennnnn", token);
    return res.status(200).json({
      data: existUser,
      token: token,
      message: "Login success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
