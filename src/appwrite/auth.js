import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

    async createAccount({name, email, password}) {
        try {
            console.log("try to create account ")
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            console.log(userAccount)
            if (userAccount) {
                // call another method
                return this.login({email, password});
            } else {
            return  userAccount;
            }
        } catch (error) {
            console.log("create account method",error)
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
    try {
        const user = await this.account.get();
        return user;
    } catch (error) {
        console.warn("Not logged in or session expired:", error.message);
        return null;
    }
}


    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService


