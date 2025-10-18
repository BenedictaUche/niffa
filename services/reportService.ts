import { auth, db, storage } from '@/firebase/config';
import { Report } from '@/types';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export class ReportService {
  private static readonly COLLECTION_NAME = 'reports';
  private static readonly STORAGE_PATH = 'report-images';

  // Upload image to Firebase Storage
  static async uploadImage(imageUri: string, reportId: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const imageRef = ref(storage, `${this.STORAGE_PATH}/${reportId}/${Date.now()}`);
      const snapshot = await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Create a new report
  static async createReport(reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const reportWithTimestamp = {
        ...reportData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        votes: 0,
        likedBy: [],
        status: 'reported' as const,
        comments: []
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), reportWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Error creating report:', error);
      throw new Error('Failed to create report');
    }
  }

  // Get all reports
  static async getAllReports(): Promise<Report[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reports: Report[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Report);
      });

      return reports;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  // Get reports by user
  static async getUserReports(userId: string): Promise<Report[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reports: Report[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reports.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Report);
      });

      return reports;
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw new Error('Failed to fetch user reports');
    }
  }

  // Update report
  static async updateReport(reportId: string, updates: Partial<Report>): Promise<void> {
    try {
      const reportRef = doc(db, this.COLLECTION_NAME, reportId);
      await updateDoc(reportRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating report:', error);
      throw new Error('Failed to update report');
    }
  }

  // Delete report
  static async deleteReport(reportId: string, imageUrl?: string): Promise<void> {
    try {
      // Delete image from storage if exists
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      // Delete report document
      await deleteDoc(doc(db, this.COLLECTION_NAME, reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      throw new Error('Failed to delete report');
    }
  }

  // Like/Unlike report

  // Replace the existing toggleLike method with this improved version:
  static async toggleLike(reportId: string, userId: string): Promise<void> {
    try {
      const reportRef = doc(db, this.COLLECTION_NAME, reportId);

      await runTransaction(db, async (transaction) => {
        const reportDoc = await transaction.get(reportRef);

        if (!reportDoc.exists()) {
          throw new Error('Report does not exist');
        }

        const reportData = reportDoc.data();
        const likedBy = reportData.likedBy || [];
        const currentVotes = reportData.votes || 0;

        if (likedBy.includes(userId)) {
          // User has already liked, so unlike
          transaction.update(reportRef, {
            likedBy: arrayRemove(userId),
            votes: Math.max(0, currentVotes - 1),
            updatedAt: serverTimestamp()
          });
        } else {
          // User hasn't liked, so like
          transaction.update(reportRef, {
            likedBy: arrayUnion(userId),
            votes: currentVotes + 1,
            updatedAt: serverTimestamp()
          });
        }
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      throw new Error('Failed to toggle like');
    }
  }

  // Search reports
  static async searchReports(searchTerm: string): Promise<Report[]> {
    try {
      // Firebase doesn't support full-text search natively
      // You might want to use Algolia or implement a simple search
      const reports = await this.getAllReports();
      return reports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching reports:', error);
      throw new Error('Failed to search reports');
    }
  }
}
