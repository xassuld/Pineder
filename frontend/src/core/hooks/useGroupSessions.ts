import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export interface GroupSession {
  _id: string;
  title: string;
  description: string;
  mentorId: string;
  maxStudents: number;
  currentStudents: number;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  subject: string;
  price: number;
  currency: string;
  meetingLink?: string;
  recordingUrl?: string;
  materials?: string[];
  students: string[];
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  category?: string;
  votes: number;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'selected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TopicSubmission {
  title: string;
  description: string;
  category: string;
}

export interface TopicVote {
  topicId: string;
  voteType: 'upvote' | 'downvote';
}

interface UseGroupSessionsReturn {
  groupSessions: GroupSession[];
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
  submitTopic: (groupId: string, topic: TopicSubmission) => Promise<void>;
  voteTopic: (groupId: string, topicId: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  refreshData: () => void;
}

export const useGroupSessions = (): UseGroupSessionsReturn => {
  const { user } = useUser();
  const [groupSessions, setGroupSessions] = useState<GroupSession[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555';

  const getAuthHeaders = () => {
    const role = user?.emailAddresses[0]?.emailAddress?.includes('@gmail.com') ? 'mentor' : 'student';
    return {
      'Content-Type': 'application/json',
      'x-user-role': role,
      'x-user-email': user?.emailAddresses[0]?.emailAddress || '',
      'x-user-id': user?.id || '',
    };
  };

  const fetchGroupSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/api/group-sessions`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch group sessions: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setGroupSessions(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch group sessions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching group sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      // Get topics from the first group session for now
      if (groupSessions.length > 0) {
        const groupId = groupSessions[0]._id;
        
        // Simple caching - only fetch if we don't have topics yet
        if (topics.length > 0) {
          return;
        }
        
        const response = await fetch(`${API_BASE}/api/group-sessions/${groupId}/topics`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch topics: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setTopics(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch topics');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching topics:', err);
    }
  };

  const submitTopic = async (groupId: string, topic: TopicSubmission) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/api/group-sessions/${groupId}/topics`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(topic),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit topic: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        // Add the new topic to the existing topics array instead of refetching
        setTopics(prevTopics => [...prevTopics, data.data]);
      } else {
        throw new Error(data.message || 'Failed to submit topic');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting topic:', err);
      throw err;
    }
  };

  const voteTopic = async (groupId: string, topicId: string, voteType: 'upvote' | 'downvote') => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/api/group-sessions/${groupId}/topics/${topicId}/vote`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) {
        throw new Error(`Failed to vote on topic: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        // Update the specific topic in the topics array instead of refetching
        setTopics(prevTopics => 
          prevTopics.map(topic => 
            topic.id === topicId ? { ...topic, votes: data.data.votes } : topic
          )
        );
      } else {
        throw new Error(data.message || 'Failed to vote on topic');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error voting on topic:', err);
      throw err;
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchGroupSessions();
      // Only fetch topics if we have group sessions
      if (groupSessions.length > 0) {
        await fetchTopics();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGroupSessions();
    }
  }, [user]);

  useEffect(() => {
    if (groupSessions.length > 0) {
      fetchTopics();
    }
  }, [groupSessions.length]); // Only depend on length, not the entire array

  return {
    groupSessions,
    topics,
    isLoading,
    error,
    submitTopic,
    voteTopic,
    refreshData,
  };
};
