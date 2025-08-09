import { gql } from 'graphql-tag';

export const CreateProfileDocument = gql(`
  mutation CreateProfile($input: CreateProfile!) {
    createProfile(input: $input) {
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