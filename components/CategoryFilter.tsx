import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void; // Changed from onCategorySelect to onCategoryChange
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingRight: 44 }}
        className="flex-grow-0"
      >
        {/* Add "All" category as first option */}
        <TouchableOpacity
          onPress={() => onCategoryChange('all')}
          className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
            selectedCategory === 'all'
              ? 'bg-green-700'
              : 'bg-gray-100'
          }`}
        >
          <Ionicons
            name="grid-outline"
            size={16}
            color={selectedCategory === 'all' ? 'white' : '#757575'}
          />
          <Text className={`text-sm font-medium ml-1 ${
            selectedCategory === 'all'
              ? 'text-white'
              : 'text-gray-600'
          }`}>
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategoryChange(category.name)}
            className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
              selectedCategory === category.name
                ? 'bg-green-700'
                : 'bg-gray-100'
            }`}
          >
            <Ionicons
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.name ? 'white' : '#757575'}
            />
            <Text className={`text-sm font-medium ml-1 ${
              selectedCategory === category.name
                ? 'text-white'
                : 'text-gray-600'
            }`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
