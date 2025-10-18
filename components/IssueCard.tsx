import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Issue } from '../types';

interface IssueCardProps {
  issue: Issue;
  isLiked: boolean;
  onLike: (issueId: string) => void;
  onPress: (issue: Issue) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'reported': return 'bg-orange-500';
    case 'in-progress': return 'bg-blue-500';
    case 'resolved': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  isLiked,
  onLike,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="mb-4"
      onPress={() => onPress(issue)}
    >
      <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <View className="relative">
          <Image
            source={{ uri: issue.image }}
            className="w-full h-48"
            resizeMode="cover"
          />
          <View className="absolute top-3 left-3">
            <View className={`px-2 py-1 rounded-full ${getStatusColor(issue.status)}`}>
              <Text className="text-white text-xs font-medium capitalize">
                {issue.status.replace('-', ' ')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full items-center justify-center"
            onPress={() => onLike(issue.id)}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={18}
              color={isLiked ? "#EF4444" : "#757575"}
            />
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: issue.userAvatar }}
              className="w-6 h-6 rounded-full mr-2"
            />
            <Text className="text-sm text-gray-500">{issue.userName}</Text>
            <Text className="text-gray-400 text-xs ml-auto">{issue.timeAgo}</Text>
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-2">
            {issue.title}
          </Text>
          <Text className="text-gray-600 text-sm mb-3 leading-5" numberOfLines={2}>
            {issue.description}
          </Text>

          <View className="flex-row items-center mb-3">
            <Ionicons name="location-outline" size={14} color="#757575" />
            <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
              {issue.location}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                className={`flex-row items-center px-3 py-1 rounded-full mr-3 ${
                  isLiked ? 'bg-green-700' : 'bg-green-100'
                }`}
                onPress={() => onLike(issue.id)}
              >
                <Ionicons
                  name="arrow-up"
                  size={14}
                  color={isLiked ? "white" : "#2E7D32"}
                />
                <Text className={`text-sm font-medium ml-1 ${
                  isLiked ? 'text-white' : 'text-green-700'
                }`}>
                  {issue.votes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={14} color="#757575" />
                <Text className="text-gray-500 text-sm ml-1">{issue.comments.length}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={16} color="#757575" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
