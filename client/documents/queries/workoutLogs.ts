import { gql } from '@apollo/client';

export const WorkoutLogsDocument = gql`
  query WorkoutLogs {
    currentUser {
      id
      workouts {
        id
        createdAt
        updatedAt
        workoutExercises {
          id
          exercise {
            id
            name
            category
            description
          }
          setLogs {
            id
            weight
            repCount
            setNumber
          }
        }
      }
    }
  }
`;