import { gql } from 'graphql-tag';

export const UpdateProfileDocument = gql(`
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