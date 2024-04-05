import newsModel from "../models/news.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        if(fs.existsSync("./uploads/news")) {
            cb(null,"./uploads/news");
        }else{
            fs.mkdirSync("./uploads/news");
            cb(null,"./uploads/news")
        }
    },

    filename: function(req,file,cb) {
        let orName = file.originalname;
        let ext = path.extname(orName);
        let basename = path.parse(orName).name;
        let filename = basename + "-" + Date.now() + ext;
        cb(null,filename);

    }
});

const upload = multer({storage: storage});

export const getnewses = async(req,res)=>{
    try {

        const newses = await newsModel.aggregate([
            {
                $lookup:{
                    from : "categories",
                    localField:"category",
                    foreignField :"_id",
                    as: "category"
                },

            },

            {$unwind: "$category"},
            {$sort:{"_id": 1}},
            {$limit:10}
        ]);

        if(newses){
            return res.status(200).json({
                data: newses,
                message:"Fetched",
                filepath:"http://localhost:8008/uploads/news"
            })
        }
        
        return res.status(400).json({
            message:"Bad Request"
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
        
    }
}


export const addnews = (req,res)=>{
    try {
        const addImage = upload.single("avatar");
        addImage(req,res, function(err){
            if(err) return res.status(400).json({message:err.message});
            const {title,description,category}= req.body;
            let filename = null;
            if(req.file) {
                filename = req.file.filename;
            }

            const saveNews = new newsModel({
                title:title,
                description:description,
                category:category,
                image:filename
            });

            saveNews.save();

            if(saveNews){
                return res.status(201).json({
                    data:saveNews,
                    message:"created"
                }); 
            }

            return res.status(400).json({
                message:"Bad Request"
            })
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
        
    }
};



export const getnews = async(req,res)=>{
    try {

        const newsID = req.params.news_id;
        const news = await newsModel.findOne({_id:newsID}).populate("category")
        if(news){
            return res.status(200).json({
                data:news,
                message: "fetched"
            })
        }

        return res.status(400).json({
            message:"Bad request"
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
        
    }
}



export const deletenews = async(req,res)=>{
    try {
      const newsID = req.params.news_id;
      const existDelete = await newsModel.findOne({_id:newsID})
      const delete_news = await newsModel.deleteOne({_id:newsID});
      if(delete_news){
        if(fs.existsSync("./uploads/news/" + existDelete.image)){
          fs.unlinkSync('./uploads/news/' + existDelete.image)
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


  export const updateNews = async (req, res) => {
    try {
      const updateImage = upload.single("avatar");
      updateImage(req, res, async function (err) {
        if (err) return res.status(400).json({ message: err.message });
  
        const newsID = req.params.news_id;
        const existUpdate = await newsModel.findOne({_id: newsID})
        const { title, description, category } = req.body;
  
        let filename = existUpdate.image;
        if (req.file) {
          filename = req.file.filename;
  
          if(fs.existsSync("./uploads/news/" + existUpdate.image)){
            fs.unlinkSync('./uploads/news/' + existUpdate.image)
          }
        }
        
        const update_news = await newsModel.updateOne(
          { _id: newsID },
          {
            $set: {
                title:title,
                description:description,
                category:category,
                image:filename
            },
          }
        );
  
        if (update_news) {
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

  
