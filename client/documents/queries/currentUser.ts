import { graphql } from '@/graphql/gql';

export const CurrentUserDocument = graphql(`
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