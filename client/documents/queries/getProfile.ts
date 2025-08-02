import { gql } from 'graphql-tag';

export const GetProfileDocument = gql(`
  query GetProfile {
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