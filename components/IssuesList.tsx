import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Report } from '../types'; // Changed from Issue to Report
import { IssueCard } from './IssueCard';

interface IssuesListProps {
  issues: Report[]; // Changed from Issue[] to Report[]
  likedIssues: string[]; // Changed from Set<string> to string[] to match your home screen
  onLike: (issueId: string) => void;
  onIssuePress: (issue: Report) => void; // Changed from Issue to Report
  onViewAll: () => void;
  onRefresh?: () => void; // Added refresh functionality
  refreshing?: boolean; // Added refreshing state
}

export const IssuesList: React.FC<IssuesListProps> = ({
  issues,
  likedIssues,
  onLike,
  onIssuePress,
  onViewAll,
  onRefresh,
  refreshing = false,
}) => {
  const renderEmptyState = () => (
    <View className="items-center justify-center py-20 px-6">
      <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
      <Text className="text-gray-500 text-lg mt-4 font-semibold">No reports found</Text>
      <Text className="text-gray-400 text-sm text-center mt-2 leading-5">
        No reports available yet.{'\n'}Pull to refresh or try again later.
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View className="items-center justify-center py-20 px-6">
      <Ionicons name="time-outline" size={48} color="#D1D5DB" />
      <Text className="text-gray-500 text-lg mt-4 font-semibold">Loading reports...</Text>
    </View>
  );

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#16a34a']} // Green color for Android
            tintColor="#16a34a" // Green color for iOS
          />
        ) : undefined
      }
    >
      <View className="px-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">
            Recent Reports ({issues.length})
          </Text>
          {issues.length > 0 && (
            <TouchableOpacity onPress={onViewAll}>
              <Text className="text-green-700 font-medium">View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {issues.length === 0 ? (
          renderEmptyState()
        ) : (
          issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              isLiked={issue.id ? likedIssues.includes(issue.id) : false} // Ensure issue.id is defined before calling includes
              onLike={onLike}
              onPress={onIssuePress}
            />
          ))
        )}

        {/* Bottom spacing for floating action button */}
        <View className="h-20" />
      </View>
    </ScrollView>
  );
};
