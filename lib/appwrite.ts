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
import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';

const client = new Client()
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject('674ac52e0014f4c52044')
    .setPlatform('com.nikhil.aora');


const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client);

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

export const getTrendingPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [
        Query.orderDesc('$createdAt'), // Sort by creation date in descending order
        Query.limit(7), // Limit the results to 7 documents
      ]
    )
    return posts;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const searchPosts = async (query: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [
        Query.search("title", query), // Search by "title" field
        Query.limit(7),              // Limit results to 7
        Query.orderDesc("$createdAt") // Sort by creation date in descending order
      ]
    );
    return posts;
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    throw new Error("Failed to fetch posts. Please try again.");
  }
};

export const getUserPosts = async (userId : string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [
        Query.equal('creator', userId), // Sort by creation date in descending order
        
      ]
    )
    return posts;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession('current');

    return session;
  } catch (error: any) {
    throw new Error("Error during signOut",error);
  }
}

export const getFilePreview = (fileId: string, type: string) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,//width
        2000,//height
        "top",//gravity
        100
      ) 
    } else {
        throw new Error("Invalid file type");
      }

      if(!fileUrl) throw Error;
      console.log(fileUrl)
     return fileUrl; 
  } catch (error:any) {
    throw new Error(error);
  }

} 

export const uploadFile = async (file: any, type: string) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    uri: file.uri,
  };

  try {
    // Upload the file
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    // Generate the file preview URL
    const fileUrl =
      type === "image"
        ? storage.getFilePreview(
            appwriteConfig.storageId,
            "dkjfnkjfkdfdkkfk",
            2000, // Width
            2000, // Height
            "top", // Gravity
            100 // Quality
          )
        : storage.getFileView(appwriteConfig.storageId, "sdkjfkdjfkd");

    if (!fileUrl) throw new Error("Failed to generate file URL");

    console.log(`File uploaded successfully: ${fileUrl}`);
    return { url: fileUrl };
  } catch (error: any) {
    console.error("Error uploading file:", error.message);
    throw new Error(error.message);
  }
};


export async function createVideoPost(form: any) {
  try {
    // Upload thumbnail and video files concurrently
    const [thumbnail, video] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    // Create the new video post in the database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnail.url,
        video: video.url,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    console.log("Video post created successfully:", newPost);
    return newPost;
  } catch (error: any) {
    console.error("Error creating video post:", error.message);
    throw new Error(error.message);
  }
}




// // Register User
// account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
//     .then(function (response) {
//         console.log(response);
//     }, function (error) {
//         (error);
//     });
