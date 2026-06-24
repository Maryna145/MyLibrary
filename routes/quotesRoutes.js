import express from 'express'
import {getQuotes, createQuotes, updateQuotes, deleteQuotes, getQuotesByID} from "../controllers/quotesController.js"
import {validateToken} from "../middleware/ValidateTokenHandler.js";

const router = express.Router()

router.use(validateToken)
router.route("/").get(getQuotes).post(createQuotes)
router.route("/:id").put(updateQuotes).get(getQuotesByID).delete(deleteQuotes)

export default router
