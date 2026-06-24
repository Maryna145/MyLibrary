import mongoose from "mongoose";

const seriesSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
},{ timestamps: true });
export default mongoose.model('Series', seriesSchema);