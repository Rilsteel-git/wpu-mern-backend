import mongoose from 'mongoose';
import { encrypt } from '../utils/encryption';

export interface User {
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
        default: '',
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

userSchema.pre('save', function (next) {
    const user = this as User;
    user.password = encrypt(user.password);
    next();
})


userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password; // Remove password from the output
    return user;
}

const UserModel = mongoose.model("User", userSchema);


export default UserModel