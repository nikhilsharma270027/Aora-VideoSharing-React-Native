import { View, Text, Image, FlatList } from 'react-native'
import React from 'react'
import SearchInput from '@/components/SearchInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'

const Bookmark = () => {
  return (
    <SafeAreaView className='bg-primary h-full'>
    <View className='flex my-6 px-4 space-y-6'>

<View className='justify-between items-start flex-row m-6'>
  <View className=''>
    {/* <Text className='font-pmedium text-sm text text-gray-100'>
        
    </Text> */}
    <Text className='text-2xl font-psemibold text-white'>
      {/* {user?.username} */}
Bookmark
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

</View>
</SafeAreaView>
          
  )
}

export default Bookmark