import latestcampaignModel from "../models/latestcampaign.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/latestcampaign")) {
      cb(null, "./uploads/latestcampaign");
    } else {
      fs.mkdirSync("./uploads/latestcampaign");
      cb(null, "./uploads/latestcampaign");
    }
  },
  filename: function (req, file, cb) {
    let orName = file.originalname;
    let ext = path.extname(orName);
    let basename = path.parse(orName).name;
    let filename = basename + "-" + Date.now() + ext;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

export const getlatestcampaigns = async (req, res) => {
  try {
    const latestcampaigns = await latestcampaignModel.find();
    if (latestcampaigns) {
      return res.status(200).json({
        data: latestcampaigns,
        message: "fetched",
        filepath: "http://localhost:8008/uploads/latestcampaign",
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

export const addlatestcampaign = (req, res) => {
  try {
    const addImage = upload.single("avatar");
    addImage(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const { title, description, days, raised, goal, donor} = req.body;
      let filename = null;
      if (req.file) {
        filename = req.file.filename;
      }

      const savelatestcampaign = new latestcampaignModel({
        title: title,
        description: description,
        days: days,
        raised:raised,
        goal:goal,
        donor:donor,
        image: filename,
      });
      savelatestcampaign.save();

      if (savelatestcampaign) {
        return res.status(201).json({
          data: savelatestcampaign,
          message: "created",
        });
      }

      return res.status(400).json({
        message: "Bad Request",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getlatestcampaign = async (req, res) => {
  try {
    const campaignID = req.params.campaign_id;
    const campaign = await latestcampaignModel.findOne({ _id: campaignID });
    if (campaign) {
      return res.status(200).json({
        data: campaign,
        message: "fetched",
        filepath: "http://localhost:8008/uploads/latestcampaign",
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

export const updatecampaign = async (req, res) => {
  try {
    const updateImage = upload.single("avatar");
    updateImage(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const campaignID = req.params.campaign_id;
      const existUpdate = await latestcampaignModel.findOne({_id: campaignID})
      const { title, description, days, raised, goal, donor } = req.body;

      let filename = existUpdate.image;
      if (req.file) {
        filename = req.file.filename;

        if(fs.existsSync("./uploads/latestcampaign/" + existUpdate.image)){
          fs.unlinkSync('./uploads/latestcampaign/' + existUpdate.image)
        }
      }
      
      const update_campaign = await latestcampaignModel.updateOne(
        { _id: campaignID },
        {
          $set: {
            title: title,
            description: description,
            days: days,
            raised:raised,
            goal:goal,
            donor:donor,
            image: filename,
          },
        }
      );

      if (update_campaign) {
        return res.status(200).json({
          message: "Updated",
        });
      }
      return res.status(400).json({
        message: "Bad Request",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const deletecampaign = async(req,res)=>{
  try {
    const campaignID = req.params.campaign_id;
    const existDelete = await latestcampaignModel.findOne({_id:campaignID})
    const delete_campaign = await latestcampaignModel.deleteOne({_id:campaignID});
    if(delete_campaign){
      if(fs.existsSync("./uploads/latestcampaign/" + existDelete.image)){
        fs.unlinkSync('./uploads/latestcampaign/' + existDelete.image)
      }
      return res.status(200).json({
        message:"Deleted"
      })
    }

    return res.status(400).json({
      message:"Bad Request"
    })
    
  } catch (error) {
    return res.status(500).json({
      message:error.message
    })
    
  }
}


