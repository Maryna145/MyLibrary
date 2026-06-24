import express from 'express'
import {getSeries, createSeries, updateSeries, deleteSeries, getSeriesByID} from "../controllers/seriesController.js"
import {validateToken} from "../middleware/ValidateTokenHandler.js";

const router = express.Router()

router.use(validateToken)
router.route("/").get(getSeries).post(createSeries)
router.route("/:id").put(updateSeries).get(getSeriesByID).delete(deleteSeries)

export default router
