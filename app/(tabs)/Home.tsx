import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getTrendingPosts } from '@/lib/appwrite'
import { Models } from 'react-native-appwrite/types/models'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
const Home = () => {
  // Custom hook to fetch data from db
  const { data: posts, refetch, isLoading} = useAppwrite(getAllPosts);
  const { data: latestPosts} = useAppwrite(getTrendingPosts);

  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // re call videos -> if any new vedios appeared
    await refetch();
    setRefreshing(false)
  }

  // console.log(posts)

  return (
   <SafeAreaView className='bg-primary h-full'>
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
        <View className='flex my-6 px-4 space-y-6'>

          <View className='justify-between items-start flex-row m-6'>
            <View className=''>
              <Text className='font-pmedium text-sm text text-gray-100'>
                  Welcome back
              </Text>
              <Text className='text-2xl font-psemibold text-white'>
                Aora app
              </Text>
            </View>
            <View className='mt-1.5'>
              <Image
                source={images.logoSmall}
                className='w-9 h-10'
                resizeMode='contain'
              />  
            </View>
          </View>

          <SearchInput />

          <View className='w-full flex-1 pt-5 pb-8'>
            <Text className='text-gray-100 text-lg font-pregular mg-3'>
              Latest Videos
            </Text>
          </View>

          <Trending posts={latestPosts?.documents || []}/>
        </View>
      )}
      ListEmptyComponent={() => (
        <EmptyState 
          title="No Videos Found"
          subtitle="Be the first one to upload a vedio"
        />
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
    />

    {/* </FlatList> */}

   </SafeAreaView>
  )
}

export default Home