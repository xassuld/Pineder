import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import type { Community } from "../lib/data/communities";

interface UseCommunitiesReturn {
  communities: Community[];
  loading: boolean;
  error: string | null;
  createCommunity: (
    data: CreateCommunityData
  ) => Promise<{ success: boolean; message: string }>;
  joinCommunity: (
    communityId: string
  ) => Promise<{ success: boolean; message: string }>;
  leaveCommunity: (
    communityId: string
  ) => Promise<{ success: boolean; message: string }>;
  refetch: () => Promise<void>;
}

interface CreateCommunityData {
  name: string;
  description: string;
  category: string;
  topics?: string[];
  rules?: string[];
  isPrivate?: boolean;
  image?: string;
}

const getHeaders = (user: any) => {
  const email = user?.emailAddresses?.[0]?.emailAddress || "";
  const userRole = email.endsWith("@gmail.com") ? "mentor" : "student";

  return {
    "Content-Type": "application/json",
    "x-user-role": userRole,
    "x-user-email": email,
    "x-user-id": user?.id || "",
  };
};

export const useCommunities = (): UseCommunitiesReturn => {
  const { user, isSignedIn } = useUser();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/communities`,
        {
          method: "GET",
          headers: getHeaders(user),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Transform backend data to match frontend interface
          const transformedCommunities = result.data.communities.map(
            (community: any) => ({
              id: community._id,
              name: community.name,
              description: community.description,
              category: community.category,
              members: community.members,
              topics: community.topics || [],
              recentActivity: community.recentActivity,
              status: community.status,
              createdAt: community.createdAt,
              createdBy: community.createdBy,
              rules: community.rules || [],
              isPrivate: community.isPrivate,
              memberIds: community.memberIds || [],
              image: community.image,
            })
          );
          setCommunities(transformedCommunities);
        } else {
          setError(result.message || "Failed to fetch communities");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch communities");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch communities"
      );
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (
    data: CreateCommunityData
  ): Promise<{ success: boolean; message: string }> => {
    if (!isSignedIn || !user) {
      return {
        success: false,
        message: "Please sign in to create a community",
      };
    }

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/communities`,
        {
          method: "POST",
          headers: getHeaders(user),
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh communities list
        await fetchCommunities();
        return { success: true, message: "Community created successfully!" };
      } else {
        return {
          success: false,
          message: result.error || "Failed to create community",
        };
      }
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to create community",
      };
    }
  };

  const joinCommunity = async (
    communityId: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!isSignedIn || !user) {
      return { success: false, message: "Please sign in to join a community" };
    }

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/communities/${communityId}/join`,
        {
          method: "POST",
          headers: getHeaders(user),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh communities list
        await fetchCommunities();
        return { success: true, message: "Successfully joined community!" };
      } else {
        return {
          success: false,
          message: result.error || "Failed to join community",
        };
      }
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to join community",
      };
    }
  };

  const leaveCommunity = async (
    communityId: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!isSignedIn || !user) {
      return { success: false, message: "Please sign in to leave a community" };
    }

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/communities/${communityId}/leave`,
        {
          method: "POST",
          headers: getHeaders(user),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Refresh communities list
        await fetchCommunities();
        return { success: true, message: "Successfully left community!" };
      } else {
        return {
          success: false,
          message: result.error || "Failed to leave community",
        };
      }
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to leave community",
      };
    }
  };

  useEffect(() => {
    if (isSignedIn && user) {
      fetchCommunities();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, user]);

  return {
    communities,
    loading,
    error,
    createCommunity,
    joinCommunity,
    leaveCommunity,
    refetch: fetchCommunities,
  };
};
