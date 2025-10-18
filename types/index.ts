export interface Issue {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  category: string;
  status: 'reported' | 'in-progress' | 'resolved';
  votes: number;
  likedBy: string[];
  userName: string;
  userAvatar: string;
  timeAgo: string;
  comments: any[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

// for reports
export interface Report {
  id?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  imageUrl?: string;
  status: 'reported' | 'in-progress' | 'resolved';
  votes: number;
  likedBy: string[];
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: Date;
}
