import mongoose from "mongoose";

const ALLOWED_STATUSES = ["WISH", "PURCHASED", "READING", "COMPLETED", "ABANDONED", "ON_HOLD"];

const bookSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true,
    },
    publishDate: {
        type: Date,
        required: [true, "Date is required"],
    },
    genre:{
        type: String,
        required: [true, "Genre is required"],
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: {
            values: ALLOWED_STATUSES,
            message: "Status must be one of: " + ALLOWED_STATUSES.join(", ")
        },
        default: "WISH"
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
    },
    annotation:{
        type: String,
        required: [true, "Annotation is required"],
    },
    favouriteCharacters:{
        type: [String],
        default: [],
    },
    series:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Series",
    }
},{ timestamps: true });
export default mongoose.model('Book', bookSchema);