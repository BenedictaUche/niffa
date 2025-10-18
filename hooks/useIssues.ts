import { currentUser, mockIssues, searchIssues } from '@/app/data/mockData';
import { useEffect, useState } from 'react';
import { Issue } from '../types';

export const useIssues = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [displayedIssues, setDisplayedIssues] = useState<Issue[]>(mockIssues);
  const [likedIssues, setLikedIssues] = useState<Set<string>>(new Set());

  useEffect(() => {
    const userLikedIssues = new Set<string>();
    mockIssues.forEach(issue => {
      if (issue.likedBy.includes(currentUser.id)) {
        userLikedIssues.add(issue.id);
      }
    });
    setLikedIssues(userLikedIssues);
  }, []);

  // Search and category filtering
  useEffect(() => {
    let filteredIssues = mockIssues;

    if (searchText.trim()) {
      filteredIssues = searchIssues(searchText.trim());
    }

    if (selectedCategory !== 'All') {
      filteredIssues = filteredIssues.filter(issue => issue.category === selectedCategory);
    }

    setDisplayedIssues(filteredIssues);
  }, [searchText, selectedCategory]);

  const handleLike = (issueId: string) => {
    const newLikedIssues = new Set(likedIssues);
    const issue = mockIssues.find(i => i.id === issueId);

    if (!issue) return;

    if (likedIssues.has(issueId)) {
      newLikedIssues.delete(issueId);
      issue.votes -= 1;
      issue.likedBy = issue.likedBy.filter(id => id !== currentUser.id);
    } else {
      newLikedIssues.add(issueId);
      issue.votes += 1;
      issue.likedBy.push(currentUser.id);
    }

    setLikedIssues(newLikedIssues);
    setDisplayedIssues([...displayedIssues]);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  return {
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    displayedIssues,
    likedIssues,
    handleLike,
    clearSearch,
  };
};
