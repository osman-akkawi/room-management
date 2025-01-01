import { useOptimisticMutation } from '../../../hooks/useOptimisticMutation';
import { Schedule } from '../../../types';
import { useStore } from '../../../store/useStore';
import { supabase } from '../../../lib/supabase';

export function useScheduleMutation() {
  const { addSchedule, updateSchedule, deleteSchedule } = useStore();
  const { mutate, loading, error } = useOptimisticMutation<Schedule>();

  const createSchedule = async (data: Omit<Schedule, 'id' | 'created_at'>) => {
    const optimisticSchedule = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    return mutate(
      async () => {
        const { data: insertedData, error } = await supabase
          .from('schedules')
          .insert(data)
          .select()
          .single();

        return { data: insertedData, error };
      },
      {
        optimisticUpdate: () => addSchedule(optimisticSchedule),
      }
    );
  };

  const editSchedule = async (schedule: Schedule) => {
    const { id, created_at, ...updateData } = schedule;

    return mutate(
      async () => {
        const { data: updatedData, error } = await supabase
          .from('schedules')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        return { data: updatedData, error };
      },
      {
        optimisticUpdate: () => updateSchedule(schedule),
      }
    );
  };

  const removeSchedule = async (id: string) => {
    return mutate(
      async () => {
        const { error } = await supabase
          .from('schedules')
          .delete()
          .eq('id', id);

        return { data: null, error };
      },
      {
        optimisticUpdate: () => deleteSchedule(id),
      }
    );
  };

  return {
    createSchedule,
    editSchedule,
    removeSchedule,
    loading,
    error,
  };
}