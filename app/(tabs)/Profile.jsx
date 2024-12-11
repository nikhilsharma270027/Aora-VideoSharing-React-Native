import { View, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { getUserPosts, signOut } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import InfoBox from "@/components/InfoBox";
import { icons } from "@/constants";

const Profile = () => {
  // const { query } = useLocalSearchParams();
  const { user, setUser, setIsLogged } = useGlobalContext();
  // Custom hook to fetch data from db
  // const singleQuery = Array.isArray(query) ? query[0] : query; // Extract the first string if it's an array

  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/Sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        //data: It is basically an array of data.
        // data={[{ id: 1}, { id: 2}, { id: 3}]}
        // data={[]}
        data={posts?.documents || []}
        //keyExtractor: It is used to extract the unique key for the given item.
        keyExtractor={(item) => item.$id}
        //his explains react native how we want to render each item in the list
        // we can destruct from eaxh item
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        //ListHeaderComponent: It is rendered at the top of all the items.
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10">
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={(posts && posts?.documents.length) || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No videos found " />
        )}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      />

      {/* </FlatList> */}
    </SafeAreaView>
  );
};

export default Profile;
