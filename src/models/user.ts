import mongoose from 'mongoose';

// An interface that desribes the properties
// that are required to create a new User
export interface UserAttributes {
    email: string;
    username?: string;
    name?: string;
    about?: string;
    fcmToken?: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build: (attrs: UserAttributes) => UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    username: string;
    name: string;
    images: { url: string; public_id: string; }[];
    about?: string;
    createdAt: string;
    updatedAt: string;
    fcmToken?: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    name: {
        type: String,
    },
    images: {
        type: Array,
        default: [
            {
                url: '',
                public_id: '',
            }
        ]
    },
    about: {
        type: String,
    },
    fcmToken: {
        type: String,
    }
}, { timestamps: true });

userSchema.statics.build = (attrs: UserAttributes) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User, UserDoc };