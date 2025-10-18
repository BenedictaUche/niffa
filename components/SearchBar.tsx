import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  onClear: () => void; // Changed from onClearSearch to onClear to match your home screen
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchChange,
  onClear,
  placeholder = "Search reports, locations...", // Updated placeholder text
}) => {
  return (
    <View className="mx-6 mb-4">
      <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
        <Ionicons name="search" size={20} color="#757575" />
        <TextInput
          placeholder={placeholder}
          value={searchText}
          onChangeText={onSearchChange}
          className="flex-1 ml-3 text-base text-gray-900"
          placeholderTextColor="#757575"
          returnKeyType="search"
          clearButtonMode="never" // We'll handle clear button manually
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={onClear} className="ml-2">
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
        <TouchableOpacity className="ml-2">
          <Ionicons name="options-outline" size={20} color="#757575" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
