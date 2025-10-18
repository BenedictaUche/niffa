import { auth } from '@/firebase/config';
import { useImagePicker } from '@/hooks/useImagePicker';
import { ReportService } from '@/services/reportService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { categories } from '../data/mockData';

export default function AddReportScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { image, isUploading, setIsUploading, showImagePicker, removeImage } = useImagePicker();

    const validateForm = () => {
        if (!title.trim()) {
            Alert.alert('Missing Information', 'Please enter a title for your report');
            return false;
        }
        if (!description.trim()) {
            Alert.alert('Missing Information', 'Please enter a description');
            return false;
        }
        if (!location.trim()) {
            Alert.alert('Missing Information', 'Please enter a location');
            return false;
        }
        if (!selectedCategory) {
            Alert.alert('Missing Information', 'Please select a category');
            return false;
        }
        if (!image) {
            Alert.alert('Missing Information', 'Please add a photo of the issue');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Authentication Error', 'Please log in to submit a report');
            router.push('/screens/LoginScreen');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create a temporary report ID for image upload
            const tempReportId = `temp_${Date.now()}`;

            // Upload image first
            // setIsUploading(true);
            // const imageUrl = await ReportService.uploadImage(image!, tempReportId);
            // setIsUploading(false);

            // Create report data
            const reportData = {
                title: title.trim(),
                description: description.trim(),
                location: location.trim(),
                category: selectedCategory,
                // imageUrl,
                userName: user.displayName || 'Anonymous User',
                // userAvatar: user.photoURL || 'https://via.placeholder.com/150',
            };

            // Submit report to Firestore
            const reportId = await ReportService.createReport(reportData);

            // Reset form
            setTitle('');
            setDescription('');
            setLocation('');
            setSelectedCategory('');
            removeImage();

            Alert.alert(
                'Report Submitted Successfully!',
                'Your report has been submitted and will be reviewed by the community.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]
            );

        } catch (error) {
            console.error('Error submitting report:', error);
            Alert.alert(
                'Submission Failed',
                'There was an error submitting your report. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsSubmitting(false);
            setIsUploading(false);
        }
    };

    const filteredCategories = categories.filter(cat => cat.name !== 'All');

    return (
        <SafeAreaView className="flex-1 bg-[#FDFDFD]">
            <StatusBar barStyle="dark-content" backgroundColor="#FDFDFD" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center"
                    disabled={isSubmitting}
                >
                    <Ionicons name="arrow-back" size={24} color="#2E7D32" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900">Report Issue</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Image Upload */}
                <View className="my-6">
                    <Text className="text-base font-semibold text-gray-900 mb-3">Add Photo *</Text>
                    <TouchableOpacity
                        onPress={showImagePicker}
                        disabled={isSubmitting || isUploading}
                        className="h-48 bg-gray-100 rounded-xl items-center justify-center border-2 border-dashed border-gray-300"
                    >
                        {image ? (
                            <View className="relative w-full h-full">
                                <Image
                                    source={{ uri: image }}
                                    className="w-full h-full rounded-xl"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={removeImage}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full items-center justify-center"
                                    disabled={isSubmitting}
                                >
                                    <Ionicons name="close" size={16} color="white" />
                                </TouchableOpacity>
                                {isUploading && (
                                    <View className="absolute inset-0 bg-black/50 rounded-xl items-center justify-center">
                                        <ActivityIndicator size="large" color="white" />
                                        <Text className="text-white mt-2">Uploading...</Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View className="items-center">
                                <Ionicons name="camera-outline" size={48} color="#9CA3AF" />
                                <Text className="text-gray-500 mt-2 text-center">
                                    Take a photo or select from gallery
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Title Input */}
                <View className="mb-4">
                    <Text className="text-base font-semibold text-gray-900 mb-2">Issue Title *</Text>
                    <TextInput
                        placeholder="Brief title describing the issue"
                        value={title}
                        onChangeText={setTitle}
                        className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
                        placeholderTextColor="#9CA3AF"
                        editable={!isSubmitting}
                        maxLength={100}
                    />
                    <Text className="text-gray-400 text-xs mt-1">{title.length}/100</Text>
                </View>

                {/* Description Input */}
                <View className="mb-4">
                    <Text className="text-base font-semibold text-gray-900 mb-2">Description *</Text>
                    <TextInput
                        placeholder="Detailed description of the issue"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
                        placeholderTextColor="#9CA3AF"
                        editable={!isSubmitting}
                        maxLength={500}
                        textAlignVertical="top"
                    />
                    <Text className="text-gray-400 text-xs mt-1">{description.length}/500</Text>
                </View>

                {/* Location Input */}
                <View className="mb-4">
                    <Text className="text-base font-semibold text-gray-900 mb-2">Location *</Text>
                    <TextInput
                        placeholder="Enter location or address"
                        value={location}
                        onChangeText={setLocation}
                        className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
                        placeholderTextColor="#9CA3AF"
                        editable={!isSubmitting}
                    />
                </View>

                {/* Category Selection */}
                <View className="mb-6">
                    <Text className="text-base font-semibold text-gray-900 mb-2">Category *</Text>
                    <View className="bg-gray-100 rounded-xl px-4 py-3">
                        {filteredCategories.map(category => (
                            <TouchableOpacity
                                key={category.id}
                                onPress={() => setSelectedCategory(category.name)}
                                disabled={isSubmitting}
                                className={`flex-row items-center py-3 ${
                                    selectedCategory === category.name ? 'bg-green-50 rounded-lg px-2' : ''
                                }`}
                            >
                                <Ionicons
                                    name={category.icon as keyof typeof Ionicons.glyphMap}
                                    size={24}
                                    color={selectedCategory === category.name ? '#2E7D32' : '#9CA3AF'}
                                />
                                <Text className={`ml-3 text-base ${
                                    selectedCategory === category.name
                                        ? 'text-gray-900 font-semibold'
                                        : 'text-gray-500'
                                }`}>
                                    {category.name}
                                </Text>
                                {selectedCategory === category.name && (
                                    <Ionicons name="checkmark-circle" size={20} color="#2E7D32" className="ml-auto" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting || isUploading}
                    className={`bg-[#2E7D32] rounded-xl py-4 items-center mb-6 ${
                        (isSubmitting || isUploading) ? 'opacity-50' : ''
                    }`}
                >
                    {isSubmitting ? (
                        <View className="flex-row items-center">
                            <ActivityIndicator size="small" color="white" />
                            <Text className="text-white text-base font-semibold ml-2">
                                Submitting...
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-white text-base font-semibold">
                            Submit Report
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
