import adminModel from "../models/admin.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find();

        if (admins) {
            return res.status(200).json({
                data: admins,
                message: "Fetched!"
            })
        }

        return res.status(400).json({
            message: "Bad Request"
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }
}


export const addAdmin = (req, res) => {
    try {

        const { name, email, password } = req.body;

        const saveAdmin = new adminModel({
            name: name,
            email: email,
            password: password
        })

        saveAdmin.save()

        if (saveAdmin) {
            return res.status(201).json({
                data: saveAdmin,
                message: "Created"
            })
        }

        return res.status(400).json({
            message: "Bad request"
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }
}

export const getAdmin = async (req, res) => {
    try {
        const adminID = req.params.admin_id;
        const admin = await adminModel.findOne({ _id: adminID });
        if (admin) {
            return res.status(200).json({
                data: admin,
                message: "fetched"
            })
        }

        return res.status(400).json({
            message: "Bad Request"
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }
}

export const deleteAdmin = async (req, res) => {
    try {
        const adminID = req.params.admin_id;
        const del_admin = await adminModel.deleteOne({ _id: adminID });
        if (del_admin.acknowledged) {
            return res.status(200).json({
                message: "deleted"
            })
        }

        return res.status(400).json({
            message: "Bad Request"
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }
}

export const updateAdmin = async (req, res) => {
    try {

        const adminID = req.params.admin_id;
        const { name, email, password } = req.body;
        const updateAdmin = await adminModel.updateOne({ _id: adminID }, {
            $set: {
                name: name,
                email: email,
                password: password
            }
        })

        if (updateAdmin) {
            return res.status(200).json({
                message: "Updated"
            })
        }

        return res.status(400).json({
            message: "Bad Request"
        })



    } catch (error) {
        return res.status(500).json({
            message: error.message
        })

    }
}


// sign-up

export const signUp = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        const existAdmin = await adminModel.findOne({email:email});
        if(existAdmin){
            return res.status(200).json({
                message: "User already exist."
            })
        }

        const hashedPassword = bcrypt.hashSync(password,10);
        console.log(password,hashedPassword);

        const saveAdmin = await adminModel.create({
            name:name,
            email:email,
            password:hashedPassword
        })

        if(saveAdmin){
            return res.status(201).json({
                message: "Signup Success"
            })
        }
        return res.status(400).json({
            message: "Bad Request"
        })

        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
        
    }
}

// sign in

export const signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const existAdmin = await adminModel.findOne({ email: email });
      if (!existAdmin)
        return res.status(200).json({ message: "Admin doesn't exist." });
  
      const checkPassword = bcrypt.compareSync(password, existAdmin.password);
      console.log("lllllllll",checkPassword)
      if (!checkPassword)
        return res.status(200).json({ message: "Invalid credential" });
  
      const token = jwt.sign(
        {
          _id: existAdmin._id,
          email: existAdmin.email,
        },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );
      console.log("tokennnnn", token);
      return res.status(200).json({
        data: existAdmin,
        token: token,
        message: "Login success",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };







