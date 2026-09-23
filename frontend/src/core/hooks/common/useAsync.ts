import { useState, useCallback, useRef } from "react";
import { Status, LoadingState } from "../../../types";

export function useAsync<T = any, E = any>() {
  const [state, setState] = useState<LoadingState>({
    status: "idle",
    message: "",
    error: "",
  });
  const [data, setData] = useState<T | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (
      asyncFunction: (signal?: AbortSignal) => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: E) => void;
        onFinally?: () => void;
        message?: string;
      }
    ) => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setState({
        status: "loading",
        message: options?.message || "Loading...",
        error: "",
      });

      try {
        const result = await asyncFunction(abortControllerRef.current.signal);

        setData(result);
        setState({
          status: "success",
          message: "Success!",
          error: "",
        });

        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        // Don't update state if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";

        setState({
          status: "error",
          message: "",
          error: errorMessage,
        });

        options?.onError?.(error as E);
        throw error;
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          options?.onFinally?.();
        }
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      status: "idle",
      message: "",
      error: "",
    });
    setData(null);
  }, []);

  const setError = useCallback((error: string) => {
    setState({
      status: "error",
      message: "",
      error,
    });
  }, []);

  const setSuccess = useCallback((message: string) => {
    setState({
      status: "success",
      message,
      error: "",
    });
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    ...state,
    data,
    execute,
    reset,
    setError,
    setSuccess,
    cancel,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
  };
}

// Specialized async hooks
export function useApiCall<T = any, E = any>() {
  return useAsync<T, E>();
}

export function useDataFetch<T = any, E = any>() {
  const asyncHook = useAsync<T, E>();

  const fetchData = useCallback(
    async (
      fetchFunction: (signal?: AbortSignal) => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: E) => void;
        onFinally?: () => void;
        message?: string;
      }
    ) => {
      return asyncHook.execute(fetchFunction, options);
    },
    [asyncHook]
  );

  return {
    ...asyncHook,
    fetchData,
  };
}
