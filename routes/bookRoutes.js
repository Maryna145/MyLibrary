import express from 'express'
import {getBooks, createBook, updateBook, deleteBook, getBookByID} from "../controllers/bookController.js"
import {validateToken} from "../middleware/ValidateTokenHandler.js";

const router = express.Router()

router.use(validateToken)
router.route("/").get(getBooks).post(createBook)
router.route("/:id").put(updateBook).get(getBookByID).delete(deleteBook)

export default router
