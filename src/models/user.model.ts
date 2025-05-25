import mongoose from 'mongoose';

export interface User extends mongoose.Document {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    userName: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        // unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePicture: {
        type: Schema.Types.String,
        default: 'user.jpg'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activationCode: {
        type: Schema.Types.String
    }
},{
    timestamps: true,
});

const UserModel = mongoose.model("User", userSchema);


export default UserModel