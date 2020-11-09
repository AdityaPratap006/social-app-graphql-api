import chalk from 'chalk';
import { UserDoc } from '../models/user';
import { Post } from '../models/post';
import { firebaseAdmin } from '../utils/firebase-admin';
import UserService from './user.service';

interface PostCreateInput {
    title: string;
    description: string;
    createdBy: string;
}

export default class PostService {
    static async getAllPosts(skip: number) {
        const postsPerPage = 5;

        const posts = await Post.find()
            .skip(skip)
            .limit(postsPerPage)
            .sort({ createdAt: -1 })
            .populate('createdBy');


        return posts;
    }

    static async getPostCount() {
        const postCount = await Post.find().estimatedDocumentCount().exec();

        return postCount;
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

        const createdByUser = result.createdBy as UserDoc;

        const allUsers: UserDoc[] = await UserService.getAllUsers();
        const otherUsers = allUsers.filter(user => user._id !== createdByUser._id);

        const fcmTokenList = otherUsers.map(user => user.fcmToken).filter(token => !!token) as string[];

        if (createdByUser.fcmToken) {
            // notify self
            firebaseAdmin.messaging().sendMulticast({
                tokens: fcmTokenList,
                data: {
                    title: `New Post from ${createdByUser.email}`,
                    body: `${result.title}`
                }
            });
        }

        return result;
    }
}