import { graphql } from '@/graphql/gql';

export const ProfileEditCurrentUserDocument = graphql(`
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