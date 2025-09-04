import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema = new Schema<Message>({
    content: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        required: true,
        default: Date.now 
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifiedCodeExpiry: Date;
    isAcceptingMessages: boolean;
    isVerified: boolean;
    messages: Message[];
}

const UserSchema = new Schema<User>({
    username: { 
        type: String, 
        required: true,
        trim: true,
        unique: true
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'] 
    },
    verifyCode: { 
        type: String, 
        required: [true, 'Verification code status is required'] 
    },
    verifiedCodeExpiry: { 
        type: Date, 
        required: [true, 'Verification code expiry is required'],
        default: Date.now 
    },
    messages: [MessageSchema],  
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean, 
        default: true
    },
});


const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;