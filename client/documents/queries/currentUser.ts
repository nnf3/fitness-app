import { gql } from 'graphql-tag';

export const CurrentUserDocument = gql(`
  query CurrentUser {
    currentUser {
      id
      uid
      createdAt
      updatedAt
      profile {
        id
        name
        birthDate
        gender
        height
        weight
        activityLevel
      }
      recommendedUsers {
        id
        uid
        createdAt
        profile {
          id
          name
          birthDate
          gender
          height
          weight
          activityLevel
        }
      }
    }
  }
`);

export const HomeScreenDataDocument = gql(`
  query HomeScreenData {
    currentUser {
      id
      profile {
        id
        name
      }
      workouts {
        id
        date
        createdAt
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
`);