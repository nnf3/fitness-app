import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { HomeScreenDataDocument } from '../documents';
import { HomeScreenDataQuery } from '../types/graphql';
import dayjs from 'dayjs';

export const useWorkoutStats = (userId?: string) => {
  const { data: workoutData, refetch: refetchWorkouts, loading, error } = useQuery<HomeScreenDataQuery>(HomeScreenDataDocument, {
    skip: !userId,
  });

  const workoutStats = useMemo(() => {
    if (!workoutData?.currentUser?.workouts) {
      return {
        thisWeekCount: 0,
        thisWeekSets: 0,
        recentWorkouts: [],
        streakDays: 0,
      };
    }

    const workouts = workoutData.currentUser.workouts.filter(w => 
      w.workoutExercises.some(we => we.setLogs.length > 0)
    );
    const now = dayjs();
    const startOfWeek = now.subtract(6, 'day').startOf('day');

    // 今週の統計
    const thisWeekWorkouts = workouts.filter(w => {
      const dateToUse = w.date || w.createdAt;
      if (!dateToUse) return false;

      const workoutDate = w.date
        ? dayjs(w.date, 'YYYY-MM-DD')
        : dayjs(w.createdAt).startOf('day');

      return workoutDate.isAfter(startOfWeek) || workoutDate.isSame(startOfWeek, 'day');
    });
    const thisWeekCount = thisWeekWorkouts.length;
    const thisWeekSets = thisWeekWorkouts.reduce((total, w) =>
      total + w.workoutExercises.reduce((sum, we) => sum + we.setLogs.length, 0), 0
    );

    // 最近のワークアウト（最新3件）
    const recentWorkouts = workouts
      .filter(w => w.date || w.createdAt)
      .sort((a, b) => {
        const dateA = a.date ? dayjs(a.date, 'YYYY-MM-DD') : dayjs(a.createdAt);
        const dateB = b.date ? dayjs(b.date, 'YYYY-MM-DD') : dayjs(b.createdAt);
        return dateB.valueOf() - dateA.valueOf();
      })
      .slice(0, 3);

    // 連続日数（簡易計算）
    let streakDays = 0;
    if (workouts.filter(w => w.date || w.createdAt).length > 0) {
      const sortedWorkouts = workouts
        .filter(w => w.date || w.createdAt)
        .sort((a, b) => {
          const dateA = a.date ? dayjs(a.date, 'YYYY-MM-DD') : dayjs(a.createdAt);
          const dateB = b.date ? dayjs(b.date, 'YYYY-MM-DD') : dayjs(b.createdAt);
          return dateB.valueOf() - dateA.valueOf();
        });

      let currentDate = dayjs();
      for (const workout of sortedWorkouts) {
        const workoutDate = workout.date
          ? dayjs(workout.date, 'YYYY-MM-DD')
          : dayjs(workout.createdAt).startOf('day');
        if (currentDate.diff(workoutDate, 'day') <= 1) {
          streakDays++;
          currentDate = workoutDate;
        } else {
          break;
        }
      }
    }

    return {
      thisWeekCount,
      thisWeekSets,
      recentWorkouts,
      streakDays,
    };
  }, [workoutData]);

  return {
    ...workoutStats,
    userData: workoutData?.currentUser,
    loading,
    error,
    refetch: async () => {
      await refetchWorkouts();
    }
  };
};
