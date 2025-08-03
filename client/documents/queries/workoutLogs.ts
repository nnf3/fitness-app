import { gql } from '@apollo/client';

export const WorkoutLogsDocument = gql`
  query WorkoutLogs {
    currentUser {
      id
      workoutLogs {
        id
        createdAt
        updatedAt
        setLogs {
          id
          weight
          repCount
          setNumber
          workoutType {
            id
            name
            category
            description
          }
        }
      }
    }
  }
`;