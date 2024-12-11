import { View, Text } from "react-native";

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }: {
    title: string; // The main title of the box
    subtitle?: string; // The subtitle or description
    containerStyles?: string; // Optional styles for the container
    titleStyles?: string;
}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;