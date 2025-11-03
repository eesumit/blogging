import bcrypt from "bcryptjs";
import mongoose, {Schema,model,models} from "mongoose";

export interface IUser {
    name:string;
    email:string;
    password:string;
    username:string;
    avatar?:string;
    followers:number;
    following:number;
    bio:string;
    resetToken?:string;
    resetTokenExpiry?:number;
    _id?:mongoose.Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
    posts:mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
    },
    avatar:{
        type:String,
        default:"https://res.cloudinary.com/dwb9p9jmc/image/upload/v1761744443/user_images/dskzpjqqkiigrpy3tw1t.jpg",
    },
    followers:{
        type:Number,
        default:0,
    },
    following:{
        type:Number,
        default:0,
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    bio:{
        type:String,
        default:"",
    },
    resetToken:{
        type:String,
        default:null,
    },
    resetTokenExpiry:{
        type:Number,
        default:null,
    }
},{
    timestamps:true
})

userSchema.pre('save', async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

// Check if the model exists, if not create it
const User = models?.User || model<IUser>("User", userSchema);
export default User;