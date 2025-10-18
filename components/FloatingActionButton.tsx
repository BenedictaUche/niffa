import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="absolute bottom-8 right-6 w-14 h-14 bg-green-700 rounded-full items-center justify-center shadow-lg"
      onPress={onPress}
    >
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
};
