import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onProfilePress: () => void;
  onNotificationPress: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onProfilePress,
  onNotificationPress,
  notificationCount = 0,
}) => {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white">
      <TouchableOpacity
        className="flex-row items-center flex-1"
        onPress={onProfilePress}
      >
        <View className="w-10 h-10 rounded-full bg-green-700 mr-3 overflow-hidden">
          <Image
            source={{ uri: currentUser.avatar }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#757575" />
            <Text className="text-sm text-gray-600 ml-1">Location</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-base font-semibold text-gray-900">{currentUser.location}</Text>
            <Ionicons name="chevron-down" size={16} color="#757575" style={{ marginLeft: 4 }} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center relative"
        onPress={onNotificationPress}
      >
        <Ionicons name="notifications-outline" size={20} color="#757575" />
        {notificationCount > 0 && (
          <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {notificationCount > 99 ? '99+' : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
