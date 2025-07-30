import { gql } from 'graphql-tag';

export const ProfileEditCurrentUserDocument = gql(`
  query ProfileEditCurrentUser {
    currentUser {
      id
      uid
      profile {
        id
        name
        birthDate
        gender
        height
        weight
        activityLevel
        imageURL
      }
    }
  }
`);