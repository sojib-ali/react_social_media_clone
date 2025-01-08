import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID } from "appwrite";
import { Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
      
        if(!newAccount) throw Error;

        const avatarUrl = new URL(avatars.getInitials(user.name));

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name:newAccount.name,
            email:newAccount.email,
            username:user.username,
            imageUrl:avatarUrl,
        })
 
        return newUser;

    } catch (error) {
        console.log(error);
        return error;
    }
   
}

export async function saveUserToDB(user:{
    accountId:string;
    email:string;
    name:string;
    imageUrl:URL;
    username?:string
}) {
    const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user,
    )
    return newUser;
}

export async function signInAccount(user:{
    email:string;
    password:string;
}){
    try{
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;

    }catch(error){
        console.log(error);
        return error;
    }
}

export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        return currentUser.documents[0];
    }catch (error){
        console.log(error);
    }
}

export async function signOutAccount(){
    try{
        const session = await account.deleteSession('current');
        return session;
    }catch(error){
        console.log(error);
        return error;
    }
}

export async function createPost(post: INewPost){
    try{
        //upload image to storage;
        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadFile) throw Error;
        //Get file url

        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl){
            deleteFile(uploadedFile.$id)
            throw Error;
        }

        //convert tags in an array
        const tags = post.tags?.replace(/ /g,'').split(',') || [];
    } catch(error){
        console.log(error);
    }
}

export async function uploadFile(file: File){
    try{
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile
    } catch(error){
        console.log(error);
    }
}

export async function getFilePreview(fieldId: string){
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fieldId,
            2000,
            2000,
            "top",
            100,
        )
        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return {status: 'ok'}
    } catch (error) {
        console.log(error);
    }
}