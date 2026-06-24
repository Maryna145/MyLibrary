import expressAsyncHandler from 'express-async-handler'
import Quotes from '../models/quotesModel.js';

const getQuotes = expressAsyncHandler(async (req, res) => {
    const quotes = await Quotes.find({user_id: req.user.id}).populate("book", "title author");
    res.status(200).json(quotes)
})

const getQuotesByID = expressAsyncHandler(async (req, res) => {
    const quote = await Quotes.findById(req.params.id).populate("book", "title author");
    if(!quote){
        res.status(404)
        throw new Error('Could not find quote')
    }
    if(quote.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User doesn't have permission")
    }
    res.status(200).json(quote)
})

const createQuotes = expressAsyncHandler(async (req, res) => {
    const {text, book} = req.body
    if(!text || !book){
        res.status(400)
        throw new Error("Text and book are required")
    }
    const quote = await Quotes.create({
        text,
        book,
        user_id: req.user.id,
    })
    res.status(201).json(quote)
})

const updateQuotes = expressAsyncHandler(async (req, res) => {
    const quote = await Quotes.findById(req.params.id)
    if(!quote){
        res.status(404)
        throw new Error('Could not find quote')
    }
    if(quote.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User doesn't have permission")
    }
    const updatedQuote = await Quotes.findByIdAndUpdate(
        req.params.id,
        req.body,
        {returnDocument: "after"}
    )
    res.status(200).json(updatedQuote)
})

const deleteQuotes = expressAsyncHandler(async (req, res) => {
    const quote = await Quotes.findById(req.params.id)
    if(!quote){
        res.status(404)
        throw new Error('Could not find quote')
    }
    if(quote.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User doesn't have permission")
    }
    await Quotes.deleteOne({_id: req.params.id})
    res.status(200).json(quote)
})

export {getQuotes, createQuotes, updateQuotes, deleteQuotes, getQuotesByID}
