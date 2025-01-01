import { useState } from 'react';
import { useStore } from '../store/useStore';

interface MutationOptions<T> {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  optimisticUpdate?: (data: T) => void;
}

export function useOptimisticMutation<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (
    mutationFn: () => Promise<{ data: T | null; error: Error | null }>,
    options?: MutationOptions<T>
  ) => {
    try {
      setLoading(true);
      setError(null);

      // If there's an optimistic update function, call it before the mutation
      if (options?.optimisticUpdate) {
        options.optimisticUpdate(null as T);
      }

      const { data, error } = await mutationFn();

      if (error) {
        throw error;
      }

      if (options?.onSuccess) {
        options.onSuccess();
      }

      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      if (options?.onError) {
        options.onError(error);
      }
      
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}