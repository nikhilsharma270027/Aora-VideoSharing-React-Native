// import { Platform } from "react-native";

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    Platform: 'com.nikhil.aora',
    projectId: '674ac52e0014f4c52044',
    databaseId: '674ac77d0032bb0cf24b',
    userCollectionId: '674c5ffc002512726d00',
    videoCollectionId: '674ac7cc001c303a8a85',
    storageId: '674ac9ab0009e5925d4b',
}

// init your react-native SDK
import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

const client = new Client()
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject('674ac52e0014f4c52044')
    .setPlatform('com.nikhil.aora');


const account = new Account(client);
// const storage = new Storage(client);
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email: string, password: string, username: string,) => {

    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        // if we dont get new Account or new is not created
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            // object abt user
            { 
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error: any) {
        console.log(error);
        throw new Error('user reg error', error)
    }
}

export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch (error: any) {
        console.log(error);
        throw new Error('user reg error', error)
    }
}

// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error: any) {
      throw new Error(error);
    }
  }

// Get Current User
export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0]; // bcuz we need only one users
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }


export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    )
    return posts;
  } catch (error: any) {
    throw new Error(error);
  }
}

// // Register User
// account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
//     .then(function (response) {
//         console.log(response);
//     }, function (error) {
//         console.log(error);
//     });
