import { graphql } from '@/graphql/gql';

export const UpdateProfileDocument = graphql(`
  mutation UpdateProfile($input: UpdateProfile!) {
    updateProfile(input: $input) {
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
`);