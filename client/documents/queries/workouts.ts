import { gql } from '@apollo/client';

export const WorkoutsDocument = gql`
  query Workouts {
    currentUser {
      id
      workouts {
        id
        date
        createdAt
        updatedAt
        workoutGroup {
          id
          title
        }
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