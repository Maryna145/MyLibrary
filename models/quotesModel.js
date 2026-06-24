import mongoose from "mongoose";

const quotesSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
        required: [true, "Text of quotes is required"],
        trim: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
},{ timestamps: true });
export default mongoose.model('Quotes', quotesSchema);