import { Router } from "express";
import auth from "../middleware/auth.js";
import { addToMyListController } from "../controllers/mylist.controller.js";

const myListRouter = Router();

myListRouter.post('/add',auth,addToMyListController)

export default myListRouter;