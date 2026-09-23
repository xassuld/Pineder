import { useState, useEffect, useCallback } from "react";
import {
  Mentor,
  MentorFilters,
  MentorSearchParams,
  PaginatedResponse,
} from "../../../types";
import { useApiCall, useDebounce } from "../common";
import { mentorApi } from "../../lib/api";

export function useMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filters, setFilters] = useState<MentorFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    execute: fetchMentors,
    isLoading: isLoadingMentors,
    error: mentorsError,
  } = useApiCall<PaginatedResponse<Mentor>>();
  const {
    execute: fetchMentorById,
    isLoading: isLoadingMentor,
    error: mentorError,
  } = useApiCall<Mentor>();

  // Fetch mentors with filters and pagination
  const loadMentors = useCallback(
    async (params?: Partial<MentorSearchParams>) => {
      try {
        const searchParams: MentorSearchParams = {
          query: debouncedSearchQuery,
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
          ...params,
        };

        const result = await fetchMentors(async () => {
          // Mock data for now - replace with actual API call
          return {
            data: [],
            total: 0,
            page: searchParams.page || 1,
            limit: searchParams.limit || 12,
            totalPages: 0,
          };
        });

        if (result) {
          setMentors(result.data);
          setPagination({
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
          });
        }
      } catch (error) {
        console.error("Failed to load mentors:", error);
      }
    },
    [
      debouncedSearchQuery,
      pagination.page,
      pagination.limit,
      filters,
      fetchMentors,
    ]
  );

  // Fetch single mentor by ID
  const loadMentorById = useCallback(
    async (mentorId: string) => {
      try {
        const result = await fetchMentorById(async () => {
          // Mock data for now - replace with actual API call
          return {} as Mentor;
        });

        if (result) {
          setSelectedMentor(result);
        }
      } catch (error) {
        console.error("Failed to load mentor:", error);
      }
    },
    [fetchMentorById]
  );

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<MentorFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Update search query
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  // Change limit
  const changeLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  // Refresh mentors
  const refreshMentors = useCallback(() => {
    loadMentors();
  }, [loadMentors]);

  // Load mentors when dependencies change
  useEffect(() => {
    loadMentors();
  }, [loadMentors]);

  // Computed values
  const hasMentors = mentors.length > 0;
  const hasFilters =
    Object.keys(filters).length > 0 || searchQuery.trim() !== "";
  const canLoadMore = pagination.page < pagination.totalPages;
  const isLoadingMore = isLoadingMentors && pagination.page > 1;

  return {
    // State
    mentors,
    filters,
    searchQuery,
    pagination,
    selectedMentor,

    // Loading states
    isLoading: isLoadingMentors,
    isLoadingMentor,
    isLoadingMore,

    // Errors
    mentorsError,
    mentorError,

    // Actions
    loadMentors,
    loadMentorById,
    updateFilters,
    updateSearchQuery,
    clearFilters,
    changePage,
    changeLimit,
    refreshMentors,

    // Computed values
    hasMentors,
    hasFilters,
    canLoadMore,
    totalMentors: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
  };
}
