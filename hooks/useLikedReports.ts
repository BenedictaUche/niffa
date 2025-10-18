import { auth } from '@/firebase/config';
import { useState } from 'react';

export const useLikedReports = () => {
  const [likedReports, setLikedReports] = useState<string[]>([]);

  const isLiked = (reportId: string): boolean => {
    return likedReports.includes(reportId);
  };

  const addLikedReport = (reportId: string) => {
    setLikedReports(prev => {
      if (!prev.includes(reportId)) {
        return [...prev, reportId];
      }
      return prev;
    });
  };

  const removeLikedReport = (reportId: string) => {
    setLikedReports(prev => prev.filter(id => id !== reportId));
  };

  const toggleLikedReport = (reportId: string) => {
    if (isLiked(reportId)) {
      removeLikedReport(reportId);
    } else {
      addLikedReport(reportId);
    }
  };

  // You can extend this to sync with Firebase if needed
  const syncLikedReports = (reports: any[]) => {
    const user = auth.currentUser;
    if (!user) return;

    const userLikedReports = reports
      .filter(report => report.likedBy?.includes(user.uid))
      .map(report => report.id);

    setLikedReports(userLikedReports);
  };

  return {
    likedReports,
    isLiked,
    addLikedReport,
    removeLikedReport,
    toggleLikedReport,
    syncLikedReports
  };
};
