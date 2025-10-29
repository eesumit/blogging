import mongoose,{Schema,model,models}  from "mongoose";

export interface IPost{
    _id?:mongoose.Types.ObjectId;
    user?:mongoose.Types.ObjectId;
    title?:string;
    description?:string;
    image?:string;
    video?:string;
    likes?:number;
    createdAt?:Date;
}
const postSchema = new Schema<IPost>({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:null,
    },
    video:{
        type:String,
        default:null,
    },
    likes:{
        type:Number,
        default:0,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
},{timestamps:true})

const Post = models.Post || model<IPost>("Post",postSchema);
export default Post;