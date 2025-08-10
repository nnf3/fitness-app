import { gql } from '@apollo/client';

export const CreateWorkoutGroupDocument = gql`
  mutation CreateWorkoutGroup($input: CreateWorkoutGroup!) {
    createWorkoutGroup(input: $input) {
      id
      title
      date
      createdAt
      updatedAt
    }
  }
`;
