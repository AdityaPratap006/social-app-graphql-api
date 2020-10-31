import mongoose from 'mongoose';
import { UserDoc } from './user';
// An interface that desribes the properties
// that are required to create a new Post
export interface PostAttributes {
    title: string;
    description: string;
    createdBy: string;
}

// An interface that describes the properties
// that a Post Model has
interface PostModel extends mongoose.Model<PostDoc> {
    build: (attrs: PostAttributes) => PostDoc;
}

// An interface that describes the properties
// that a Post Document has
interface PostDoc extends mongoose.Document {
    title: string;
    description: string;
    createdBy: UserDoc['_id'] | UserDoc;
    createdAt: string;
    updatedAt: string;
}

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User',
    }
}, { timestamps: true });

PostSchema.statics.build = (attrs: PostAttributes) => {
    return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>('Post', PostSchema);

export { Post, PostDoc };