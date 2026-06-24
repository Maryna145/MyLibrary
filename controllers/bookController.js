import expressAsyncHandler from 'express-async-handler'
import mongoose from 'mongoose';
import Book from '../models/bookModel.js';
import Quotes from '../models/quotesModel.js';
import Series from '../models/seriesModel.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const findUserSeries = async (series, userId) => {
    if (!series) {
        return null
    }
    if (!isValidObjectId(series)) {
        return false
    }
    return Series.findOne({_id: series, user_id: userId})
}

const pickBookFields = (body) => {
    const allowedFields = [
        "title",
        "author",
        "publishDate",
        "genre",
        "status",
        "rating",
        "annotation",
        "favouriteCharacters",
        "series",
    ]

    return allowedFields.reduce((updates, field) => {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            updates[field] = body[field]
        }
        return updates
    }, {})
}

const getBooks = expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status, rating, genre } = req.query;

    const filter = { user_id: req.user.id };
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } }
        ];
    }
    if (status) {
        filter.status = status;
    }
    if (rating) {
        filter.rating = parseInt(rating);
    }
    if (genre) {
        filter.genre = genre;
    }

    const totalBooks = await Book.countDocuments(filter);
    const books = await Book.find(filter)
        .populate("series", "name description")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    res.status(200).json({
        books,
        pagination: {
            totalBooks,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalBooks / limit)
        }
    });
})
const getBookByID = expressAsyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        res.status(400)
        throw new Error('Invalid book id')
    }
    const book = await Book.findById(req.params.id).populate("series");
    if(!book){
        res.status(404)
        throw new Error ('Could not find book')
    }
    if(book.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error ("User don't have permission")
    }
    const quotes = await Quotes.find({ book: book._id, user_id: req.user.id }).select("text createdAt");
    res.status(200).json({
        ...book._doc,
        quotes
    });
})
const createBook = expressAsyncHandler(async (req, res) => {
    const {title, author, publishDate, genre, status, rating, annotation, favouriteCharacters, series} = req.body
    if (!title || !author || !publishDate || !genre || !status || !annotation) {
        res.status(400)
        throw new Error("Title, author, publishDate, genre, status and annotation are required")
    }

    const userSeries = await findUserSeries(series, req.user.id)
    if (userSeries === false) {
        res.status(400)
        throw new Error('Invalid series id')
    }
    if (series && !userSeries) {
        res.status(403)
        throw new Error("User doesn't have permission for this series")
    }

    const book = await Book.create({
        title, author, publishDate, genre, status, rating, annotation, favouriteCharacters, series,
        user_id: req.user.id,
    })
    res.status(201).json(book)
})
const updateBook = expressAsyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        res.status(400)
        throw new Error('Invalid book id')
    }
    const book = await Book.findById(req.params.id)
    if(!book){
        res.status(404)
        throw new Error ('Could not find book')
    }
    if(book.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error ("User don't have permission")
    }
    const updates = pickBookFields(req.body)
    const userSeries = await findUserSeries(updates.series, req.user.id)
    if (userSeries === false) {
        res.status(400)
        throw new Error('Invalid series id')
    }
    if (updates.series && !userSeries) {
        res.status(403)
        throw new Error("User doesn't have permission for this series")
    }

    const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        updates,
        {new:true, runValidators: true}
    )
    res.status(200).json(updatedBook)
})
const deleteBook = expressAsyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        res.status(400)
        throw new Error('Invalid book id')
    }
    const book = await Book.findById(req.params.id)
    if(!book){
        res.status(404)
        throw new Error ('Could not find book')
    }
    if(book.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error ("User don't have permission")
    }
    await Quotes.deleteMany({ book: req.params.id, user_id: req.user.id });

    await Book.deleteOne({ _id: req.params.id })
    res.status(200).json(book)
})
export {getBooks, createBook, updateBook, deleteBook, getBookByID}
