import express from "express";
import { addlatestcampaign, deletecampaign, getlatestcampaign, getlatestcampaigns, updatecampaign } from "../controllers/latestcampaign.controller";

const router = express.Router();
router.get("/get-latestcampaigns", getlatestcampaigns)
router.post("/add-campaign", addlatestcampaign)
router.get("/get-campaign/:campaign_id",getlatestcampaign)
router.put('/update-campaign/:campaign_id',updatecampaign)
router.delete('/delete-campaign/:campaign_id', deletecampaign)


export default router