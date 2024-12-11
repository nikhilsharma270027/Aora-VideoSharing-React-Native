import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { searchPosts } from "@/lib/appwrite";
import { Models } from "react-native-appwrite/types/models";
import useAppwrite from "@/lib/useAppwrite";
import VideoCard from "@/components/VideoCard";
import { useLocalSearchParams } from "expo-router";
const Search = () => {
  const { query } = useLocalSearchParams();
  // Custom hook to fetch data from db
  const singleQuery = Array.isArray(query) ? query[0] : query; // Extract the first string if it's an array
  const { data: posts, refetch, isLoading, } = useAppwrite(()=> searchPosts(singleQuery));

  useEffect(() => {
    refetch();
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        //data: It is basically an array of data.
        // data={[{ id: 1}, { id: 2}, { id: 3}]}
        // data={[]}
        data={posts?.documents || []}
        //keyExtractor: It is used to extract the unique key for the given item.
        keyExtractor={(item): any => item.$id}
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
          <View className="my-6 px-4">
           
                <Text className="font-pmedium text-sm text text-gray-100">
                  Search Results
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {query}
                </Text>

                <View>
                  <SearchInput initialQuery={query} />
                </View>

              
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found "
          />
        )}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      />

      {/* </FlatList> */}
    </SafeAreaView>
  );
};

export default Search;
