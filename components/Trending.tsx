
import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Animatable from "react-native-animatable";
import { useEvent } from "expo";
import { icons } from "@/constants";

// Register custom animations
Animatable.initializeRegistryWithDefinitions({
  zoomIn: {
    from: { transform: [{ scale: 0.9 }] },
    to: { transform: [{ scale: 1.1 }] },
  },
  zoomOut: {
    from: { transform: [{ scale: 1 }] },
    to: { transform: [{ scale: 0.9 }] },
  },
});

const TrendingItem = ({
  activeItem,
  setActiveItem,
  item,
}: {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  item: { $id: string; video: string; thumbnail: string };
}) => {
  const player = useVideoPlayer(item.video, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // Play the video and set it as active
  const handlePlay = () => {
    if (activeItem !== item.$id) {
      setActiveItem(item.$id); // Set the active video
    }
    player.play();
  };

  // Pause the video when it is no longer active
  if (activeItem !== item.$id && isPlaying) {
    player.pause();
  }

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? "zoomIn" : "zoomOut"}
      duration={500}
    >
      {isPlaying && activeItem === item.$id ? (
        <VideoView
          player={player}
          style={styles.videoContainer}
          nativeControls={true}
          contentFit="contain"
          contentPosition={{ dx: 0, dy: 0 }}
          startsPictureInPictureAutomatically={true}
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={handlePlay}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
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
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const viewableItemChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0]?.key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          item={item}
        />
      )}
      // onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      horizontal
    />
  );
};

export default Trending;

const styles = StyleSheet.create({
  videoContainer: {
    width: 208, // 52 * 4
    height: 288, // 72 * 4
    borderRadius: 33,
    marginTop: 12, // 3 * 4
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ImageBackground,
//   Image,
// } from "react-native";
// import React, { useState } from "react";
// import { useVideoPlayer, VideoView } from "expo-video";
// import * as Animatable from "react-native-animatable";
// import { icons } from "@/constants";
// import { useEvent } from "expo";
// import { ResizeMode } from 'expo-av'
// import VideoPlayer from 'expo-video-player'

// const zoomIn = {
//   0: {
//     scale: 0.9,
//   },
//   1: {
//     scale: 1,
//   },
// };
// const zoomOut = {
//   0: {
//     scale: 1,
//   },
//   1: {
//     scale: 0.9,
//   },
// };

// const TrendingItem = ({ activeItem, item }: any) => {
//   const [play, setPlay] = useState(false);
//   const videoSource = 'https://player.vimeo.com/video/949620017?h=d60220d68d';
//   const player = useVideoPlayer(videoSource, (player) => {
//     player.loop = true;
//     player.play();
//   });
//   const { isPlaying } = useEvent(player, "playingChange", {
//     isPlaying: player.playing,
//   });
//   // console.log(activeItem, item.$id);
//   return (
//     <Animatable.View
//       className="mr-5"
//       // @ts-ignore
//       animation={activeItem === item.$id ? zoomIn : zoomOut}
//       duration={500}>

//       {
//         play ? (
//           <VideoView
//           player={player}
//           className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
//           // resizeMode={ResizeMode.CONTAIN}
//           nativeControls={true}
//           allowsFullscreen 
//           allowsPictureInPicture 
//           // StatusChangeEventPayload={(status: any) => {
//           //   if (status.didJustFinish) {
//           //     setPlay(false);
//           //   }
//           // }}
//         />
// //         <VideoPlayer
// //   videoProps={{
// //     shouldPlay: true,
// //     resizeMode: ResizeMode.CONTAIN,
// //     // ❗ source is required https://docs.expo.io/versions/latest/sdk/video/#props
// //     source: {
// //       uri: item.vedio,
// //     },
// //   }}
// // />
//       ) : (
//         <TouchableOpacity
//           className="relative flex justify-center items-center"
//           activeOpacity={0.7}
//           onPress={() => {
//             if (isPlaying) {
//               player.pause();
//             } else {
//               player.play();
//               setPlay(true)
//             }
//           }}>
//           <ImageBackground
//             source={{
//               uri: item.thumbnail,
//             }}
//             className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
//             resizeMode="cover"
//           />

//           <Image
//             source={icons.play}
//             className="w-12 h-12 absolute"
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       )}
//     </Animatable.View>
//   );
// };

// const Trending = ({ posts }: { posts: any }) => {
//   const [activeItem, setActiveItem] = useState(posts[1]);

//   const viewableItemChanged = ({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       setActiveItem(viewableItems[0].key);
//     }
//   };
//   return (
//     <FlatList
//       data={posts}
//       keyExtractor={(item) => item.$id}
//       renderItem={({ item }) => (
//         <TrendingItem activeItem={activeItem} item={item} />
//       )}
//       onViewableItemsChanged={viewableItemChanged}
//       viewabilityConfig={{
//         itemVisiblePercentThreshold: 70,
//       }}
//       // contentOffset={{ x: 170, y: 0}}
//       horizontal
//     />
//   );
// };

// export default Trending;

// import { useState } from "react";
// import { ResizeMode, Video } from "expo-av";
// import * as Animatable from "react-native-animatable";
// import {
//   FlatList,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
// } from "react-native";

// import { icons } from "../constants";

// const zoomIn = {
//   0: {
//     scale: 0.9,
//   },
//   1: {
//     scale: 1,
//   },
// };

// const zoomOut = {
//   0: {
//     scale: 1,
//   },
//   1: {
//     scale: 0.9,
//   },
// };

// const TrendingItem = ({ activeItem, item }: any) => {
//   const [play, setPlay] = useState(false);

//   return (
//     <Animatable.View
//       className="mr-5"
//       animation={activeItem === item.$id ? "zoomIn" : "zoomOut"}
//       duration={500}
//     >
//       {play ? (
//         <Video
//           source={{ uri: item.video }}
//           className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
//           resizeMode={ResizeMode.CONTAIN}
//           useNativeControls
//           shouldPlay
//           onPlaybackStatusUpdate={(status) => {
//             if (status.isLoaded) {
//               setPlay(false);
//             }
//           }}
//         />
//       ) : (
//         <TouchableOpacity
//           className="relative flex justify-center items-center"
//           activeOpacity={0.7}
//           onPress={() => setPlay(true)}
//         >
//           <ImageBackground
//             source={{
//               uri: item.thumbnail,
//             }}
//             className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
//             resizeMode="cover"
//           />

//           <Image
//             source={icons.play}
//             className="w-12 h-12 absolute"
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       )}
//     </Animatable.View>
//   );
// };

// const Trending = ({ posts }: any) => {
//   const [activeItem, setActiveItem] = useState(posts[0]);

//   const viewableItemsChanged = ({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       setActiveItem(viewableItems[0].key);
//     }
//   };

//   return (
//     <FlatList
//       data={posts}
//       horizontal
//       keyExtractor={(item) => item.$id}
//       renderItem={({ item }) => (
//         <TrendingItem activeItem={activeItem} item={item} />
//       )}
//       onViewableItemsChanged={viewableItemsChanged}
//       viewabilityConfig={{
//         itemVisiblePercentThreshold: 70,
//       }}
//       // contentOffset={{ x: 170 }}
//     />
//   );
// };

// export default Trending;

// import React, { useState } from "react";
// import {
//   FlatList,
//   TouchableOpacity,
//   ImageBackground,
//   Image,
//   StyleSheet
// } from "react-native";
// import { useVideoPlayer, VideoView } from "expo-video";
// import * as Animatable from "react-native-animatable";
// import { useEvent } from "expo";
// import { icons } from "@/constants";
// import useAppwrite from "@/lib/useAppwrite";
// import { getTrendingPosts } from "@/lib/appwrite";

// // Register custom animations
// Animatable.initializeRegistryWithDefinitions({
//   zoomIn: {
//     from: { transform: [{ scale: 0.9 }] }, // Use transform for scaling
//     to: { transform: [{ scale: 1 }] },
//   },
//   zoomOut: {
//     from: { transform: [{ scale: 1 }] },
//     to: { transform: [{ scale: 0.9 }] },
//   },
// });



// const TrendingItem = ({ activeItem, item }: { activeItem: string, item: { $id: string; video: string; thumbnail: string } }) => {
//   const videoSource = item.video
//   const player = useVideoPlayer(videoSource, (player) => {
//     player.loop = true;
//     player.play();
//   });
//   const { isPlaying } = useEvent(player, "playingChange", {
//     isPlaying: player.playing,
//   });

//   return (
//     <Animatable.View
//       className="mr-5"
//       animation={activeItem === item.$id ? "zoomIn" : "zoomOut"}
//       duration={500}
//     >
//       {isPlaying ? (
//         <VideoView
        
//           player={player}
//           style={styles.videoContainer}
//           nativeControls={true}
//           contentFit="contain"
//           contentPosition={{dx:0 , dy:0}}
//           startsPictureInPictureAutomatically={true}
//           allowsFullscreen
//           allowsPictureInPicture
//         />
//       ) : (
//         <TouchableOpacity
//           className="relative flex justify-center items-center"
//           activeOpacity={0.7}
//           onPress={() => player.play()}
//         >
//           <ImageBackground
//             source={{ uri: item.thumbnail }}
//             className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
//             resizeMode="cover"
//           />
//           <Image
//             source={icons.play}
//             className="w-12 h-12 absolute"
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//       )}
//     </Animatable.View>
//   );
// };

// const Trending = ({ posts }: { posts: any }) => {
//   const [activeItem, setActiveItem] = useState(posts[0]);

//   const viewableItemChanged = ({ viewableItems }: any) => {
//     if (viewableItems.length > 0) {
//       setActiveItem(viewableItems[0]?.key);
//     }
//   };

//   return (
//     <FlatList
//       data={posts}
//       keyExtractor={(item) => item.$id}
//       renderItem={({ item }) => (
//         <TrendingItem activeItem={activeItem} item={item} />
//       )}
//       onViewableItemsChanged={viewableItemChanged}
//       viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
//       horizontal
//     />
//   );
// };

// export default Trending;


// const styles = StyleSheet.create({
//   videoContainer: {
//     width: 208, // 52 * 4
//     height: 288, // 72 * 4
//     borderRadius: 33,
//     marginTop: 12, // 3 * 4
//     backgroundColor: "rgba(255, 255, 255, 0.1)", // equivalent to bg-white/10
//   },
// });

