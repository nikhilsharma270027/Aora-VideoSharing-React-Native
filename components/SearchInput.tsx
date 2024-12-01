import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  ...props
}: {
  title?: string;
  value?: string;
  placeholder?: string;
  handleChangeText?: any;
  otherStyles?: string;
  keyboardType?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-200 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={value}
        placeholder="Search for a Video Topic"
        placeholderTextColor="#7B7B8B"
        onChangeText={handleChangeText}
        secureTextEntry={title === "Password" && !showPassword}
        {...props}
      />
      
      <TouchableOpacity>
        <Image
            source={icons.search}
            className="w-5 h-5"
            resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
