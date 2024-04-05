import express from "express";
import { addnews, deletenews, getnews, getnewses, updateNews } from "../controllers/news.controller";

const router = express.Router();
router.get("/get-newses", getnewses)
router.post("/add-news",addnews)
router.get("/get-news/:news_id",getnews)
router.delete("/delete-news/:news_id",deletenews)
router.put("/update-news/:news_id",updateNews)
export default router