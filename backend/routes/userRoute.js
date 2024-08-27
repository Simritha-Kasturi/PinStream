import express from "express";
import { loginUser,logOutUser,myProfile,userProfile,registerUSer } from "../controllers/userControllers.js";
import {isAuth} from "../middlewares/isAuth.js"
import { followAndUnfollowUser } from './../controllers/userControllers.js';

const router=express.Router();

router.post('/register',registerUSer)
router.post('/login',loginUser)
router.get('/logout',isAuth,logOutUser)
router.get("/me",isAuth,myProfile)
router.get("/:id",isAuth,userProfile)
router.post("/follow/:id",isAuth,followAndUnfollowUser)

export default router;