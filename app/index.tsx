import { Image, Platform, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Slider from '@/components/Slider';
import { Link, Redirect, router } from 'expo-router';
import "../global.css"
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import CustomButton from '@/components/CustomButton';

export default function App() {
  return (
      <SafeAreaView className='bg-primary h-full'>
        <ScrollView contentContainerStyle={{ height: '100%'}}>
          <View className='w-full justify-center items-center min-h-[85vh] px-4'>

              <Image 
                source={images.logo}
                className='w-[130px] h-[84px]'
                resizeMode='contain'
              />

              <Image
                source={images.cards}
                className='max-w-[320px] w-full h-[300px] '
                resizeMode='contain'
              />  

              <View className="relative mt-5">
                <Text className="text-3xl text-white font-bold text-center">
                  Discover Endless{"\n"}
                    Possibilities with{" "}
                  <Text className="text-secondary-200">Aora</Text>
                </Text>

                <Image
                  source={images.path}
                  className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                  resizeMode="contain"
                />
              </View>

              <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
                Where Creativity Meets Innovation: Embark on a Journey of Limitless
                Exploration with Aora
              </Text>

              <CustomButton 
                  title='Continue with Email'
                  handlePress={() => {router.push('/(auth)/Sign-in')}}
                  containerStyles='w-full mt-7'
                  textStyles
                  isLoading={false}
              />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
  );
}

{/* <View className='flex-1 items-center justify-center bg-white'>
        <Text className='text-3xl font-pblack'>Aroa!!!</Text>
        <StatusBar style="auto" />
        <Link href="/Home" className='m-4 p-4 color-blue'>Go to</Link>
      </View> */}