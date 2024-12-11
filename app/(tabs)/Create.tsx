import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Formfield from "@/components/Formfield";
import { icons } from "@/constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import CustomButton from "@/components/CustomButton";
import * as DocumentPicker from 'expo-document-picker';
import * as imagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { createVideoPost } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: ""
  })

  const openPicker = async (selectType: string) => {
    const result = await imagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      // allowsEditing: structuredClone,
      
      aspect: [4, 3],
      quality: 1
    })
    console.log(result)
    // console.error(result)

    if (!result.canceled && result.assets?.[0]) {
      const file = result.assets[0]; // Extract the first asset
      const { uri, fileName } = file; // Destructure to get the file URI and name
  
      if (selectType === 'image') {
        setForm(({ ...form, thumbnail: { uri, fileName }})); // Store thumbnail details
      } else if (selectType === 'video') {
        setForm(({ ...form, video: uri })); // Store video details
      }
  
      console.log(`Selected file: ${fileName}`); // Log the file name for debugging
    } 
    // else {
    //   setTimeout(() => {
    //     Alert.alert("Document picker canceled or no file selected.");
    //   }, 100);
    // }
    
  }

  const submit =async () => { 
    if (form.prompt === "" || form.title === "" || !form.thumbnail || !form.video) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);

    try {
      await createVideoPost({
        ...form,
        userId: user.$id
      })
      
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false)
    }
  }

  const player = useVideoPlayer(form.video, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-white text-2xl">Upload Video</Text>

        <Formfield
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e: string) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>

            {isPlaying && form.video? (
            // <View className="h-64">
              <VideoView
              player={player}
              // className="w-full h-64 rounded-2xl"
              style={styles.videoContainer}
              nativeControls={true}
              contentFit="contain"
              // contentPosition={{ dx: 0, dy: 0 }}
              // startsPictureInPictureAutomatically={true}
              allowsFullscreen
              // allowsPictureInPicture
              />
            // </View>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View  className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  {/* <TouchableOpacity> */}

                  <Image
                    
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                    />
                    {/* </TouchableOpacity> */}
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>  
          <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-32"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Formfield
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e: string) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          // isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  videoContainer: {
    width: 400, // 52 * 4
    height: 400, // 72 * 4
    borderRadius: 33,
    marginTop: 12, // 3 * 4
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});