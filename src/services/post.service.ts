import chalk from 'chalk';
import { Post } from '../models/post';

interface PostCreateInput {
    title: string;
    description: string;
    createdBy: string;
}

export default class PostService {
    static async getAllPosts() {
        const posts = await Post.find().populate('createdBy');

        return posts;
    }

    static async createPost(postData: PostCreateInput) {
        const newPost = Post.build({
            title: postData.title,
            description: postData.description,
            createdBy: postData.createdBy
        });

        await newPost.save();
        console.log(chalk.blueBright('created new post'));

        const result = await newPost.populate('createdBy').execPopulate();
        return result;
    }
}