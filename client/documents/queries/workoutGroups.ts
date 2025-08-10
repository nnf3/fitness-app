import { gql } from '@apollo/client';

export const WorkoutGroupsDocument = gql`
  query WorkoutGroups {
    workoutGroups {
      id
      title
      date
      createdAt
      updatedAt
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

export const WorkoutGroupDocument = gql`
  query WorkoutGroup($id: ID!) {
    workoutGroup(id: $id) {
      id
      title
      date
      createdAt
      updatedAt
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

export const CurrentUserWorkoutGroupsDocument = gql`
  query CurrentUserWorkoutGroups {
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
          date
          createdAt
          updatedAt
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
