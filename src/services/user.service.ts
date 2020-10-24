import shortid from 'shortid';
import chalk from 'chalk';
import { User } from '../models/user';

interface NewUserInput {
    email: string;
    name: string;
}

interface ProfileImageInput {
    url: string;
    public_id: string;
}

interface UpdateUserInput {
    name?: string;
    username?: string;
    about?: string;
    images?: ProfileImageInput[];
}

export default class UserService {

    static getOneUserByEmail = async (userEmail: string) => {
        const user = await User.findOne({ email: userEmail });
        return user;
    }

    static createNewUser = async (userData: NewUserInput) => {
        const newUser = User.build({
            email: userData.email as string,
            username: shortid.generate(),
            name: userData.name,
            about: '',
        });

        await newUser.save();
        console.log(chalk.green('created new user'));

        return newUser;
    }

    static getAndUpdateOneUser = async (userEmail: string, newUserData: UpdateUserInput) => {
        const updatedUser = await User.findOneAndUpdate({
            email: userEmail
        }, {
            ...newUserData
        }, {
            new: true
        }).exec();

        return updatedUser;
    }
}