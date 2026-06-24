import expressAsyncHandler from 'express-async-handler'
import Series from '../models/seriesModel.js';
import Book from "../models/bookModel.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)


const getSeries = expressAsyncHandler(async (req, res) => {
    const series = await Series.find({user_id: req.user.id})
    res.status(200).json(series)
})

const getSeriesByID = expressAsyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        res.status(400)
        throw new Error('Invalid series id')
    }
    const series = await Series.findById(req.params.id)
    if(!series){
        res.status(404)
        throw new Error('Could not find series')
    }
    if(series.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User doesn't have permission")
    }
    const books = await Book.find({ series: series._id }).select("title author status");

    res.status(200).json({
        ...series._doc,
        books
    });
})

const createSeries = expressAsyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name){
        res.status(400)
        throw new Error("Name is required")
    }
    const series = await Series.create({
        name,
        description,
        user_id: req.user.id,
    })
    res.status(201).json(series)
})

const updateSeries = expressAsyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        res.status(400)
        throw new Error('Invalid series id')
    }
    const series = await Series.findById(req.params.id)
    if(!series){
        res.status(404)
        throw new Error('Could not find series')
    }
    if(series.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User doesn't have permission")
    }
    const updatedSeries = await Series.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
    res.status(200).json(updatedSeries)
})

const deleteSeries = expressAsyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        res.status(400)
        throw new Error('Invalid series id')
    }
    const series = await Series.findById(req.params.id)
    if(!series){
        res.status(404)
        throw new Error('Could not find series')
    }
    if(series.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User doesn't have permission")
    }
    await Book.updateMany({ series: req.params.id, user_id: req.user.id }, { $unset: { series: "" } });
    await Series.deleteOne({_id: req.params.id})
    res.status(200).json(series)
})

export {getSeries, createSeries, updateSeries, deleteSeries, getSeriesByID}
