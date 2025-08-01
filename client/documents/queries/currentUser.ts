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
    }
  }
`);