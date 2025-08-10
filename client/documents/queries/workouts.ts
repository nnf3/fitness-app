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

export const WorkoutDocument = gql`
  query Workout($id: ID!) {
    workout(id: $id) {
      id
      date
      createdAt
      updatedAt
      user {
        id
        profile {
          id
          name
        }
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
`;