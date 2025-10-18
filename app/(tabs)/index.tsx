import { CategoryFilter } from '@/components/CategoryFilter';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Header } from '@/components/Header';
import { IssuesList } from '@/components/IssuesList';
import { SearchBar } from '@/components/SearchBar';
import { useLikedReports } from '@/hooks/useLikedReports';
import { ReportService } from '@/services/reportService';
import { Report } from '@/types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StatusBar, View } from 'react-native';
import { categories, currentUser } from '../data/mockData';

export default function HomeScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { likedReports, toggleLikedReport, syncLikedReports } = useLikedReports();

  // Fetch reports from Firebase
  const fetchReports = async () => {
    try {
      setLoading(true);
      const fetchedReports = await ReportService.getAllReports();
      setReports(fetchedReports);
      filterReports(fetchedReports, selectedCategory, searchText);
      syncLikedReports(fetchedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh reports
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchReports();
    } catch (error) {
      console.error('Error refreshing reports:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterReports = (allReports: Report[], category: string, search: string) => {
    let filtered = [...allReports];

    if (category !== 'all') {
      filtered = filtered.filter(report => report.category === category);
    }

    if (search.trim()) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterReports(reports, category, searchText);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    filterReports(reports, selectedCategory, text);
  };

  const clearSearch = () => {
    setSearchText('');
    filterReports(reports, selectedCategory, '');
  };

  const handleLike = async (reportId: string) => {
    try {
      const userId = currentUser.id;
      await ReportService.toggleLike(reportId, userId);

      toggleLikedReport(reportId);

      await fetchReports();
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like. Please try again.');
    }
  };

  const handleAddReport = () => {
    router.push('/screens/AddReportScreen');
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleIssuePress = (report: Report) => {
    router.push(`/screens/IssueDetailScreen?id=${report.id}`);
  };

  const handleNotificationPress = () => {
    router.push('/screens/NotificationsScreen');
  };

  const handleViewAll = () => {
    router.push('/screens/AllIssuesScreen');
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} className='mt-14'>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={{ flex: 1 }}>
        <Header
          currentUser={currentUser}
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
        />

        <SearchBar
          searchText={searchText}
          onSearchChange={handleSearchChange}
          onClear={clearSearch}
        />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <IssuesList
            issues={filteredReports}
            likedIssues={likedReports}
            onLike={handleLike}
            onIssuePress={handleIssuePress}
            onViewAll={handleViewAll}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}

        <FloatingActionButton onPress={handleAddReport} />
      </View>
    </SafeAreaView>
  );
}
