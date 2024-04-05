import categoriesModel from "../models/categories.model"


export const getCategories = async(req,res)=>{
    try {

        const categories = await categoriesModel.find();
        if(categories){
            return res.status(200).json({
                data:categories,
                message:"Fetched",
                
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

export const addCategory = (req,res)=>{
    try {
        const {name, short_description} = req.body
        const save_category = new categoriesModel({
            name:name,
            short_description:short_description
        });

        save_category.save();

        if(save_category){
            return res.status(201).json({
                data:save_category,
                message:"created"
            });
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


export const getCategory = async(req,res)=>{
    try {

        const categoryID = req.params.category_id;
        const category = await categoriesModel.findOne({_id:categoryID});
        if(category){
            return res.status(200).json({
                data:category,
                message:"fetched"
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

export const deleteCategory = async(req,res)=>{
    try {

        const categoryID = req.params.category_id;

        const del_category = await categoriesModel.deleteOne({_id: categoryID});

        if(del_category){
            return res.status(200).json({
                message: "Deleted"
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

export const updateCategory = async(req,res)=>{
    try {
        const categoryID = req.params.category_id;
        const {name, short_description} = req.body;
        const update_category = await categoriesModel.updateOne({_id:categoryID},{
            $set:{
                name:name,
                short_description: short_description,
            }
           
        })

        if(update_category){
            return res.status(200).json({
                message:"Updated"
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

