import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { useEvent } from "expo";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};
const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }: any) => {
  const [play, setPlay] = useState(false);
  const videoSource = 'https://player.vimeo.com/video/949620017?h=d60220d68d';
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  // console.log(activeItem, item.$id);
  return (
    <Animatable.View
      className="mr-5"
      // @ts-ignore
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}>

      {
        play ? (
          <VideoView
          player={player}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          // resizeMode={ResizeMode.CONTAIN}
          nativeControls={true}
          allowsFullscreen 
          allowsPictureInPicture 
          // StatusChangeEventPayload={(status: any) => {
          //   if (status.didJustFinish) {
          //     setPlay(false);
          //   }
          // }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
              setPlay(true)
            }
          }}>
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: { posts: any }) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      // contentOffset={{ x: 170, y: 0}}
      horizontal
    />
  );
};

export default Trending;
