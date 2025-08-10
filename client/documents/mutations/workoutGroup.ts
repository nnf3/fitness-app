import { gql } from '@apollo/client';

export const CreateWorkoutGroupDocument = gql`
  mutation CreateWorkoutGroup($input: CreateWorkoutGroup!) {
    createWorkoutGroup(input: $input) {
      id
      title
      date
      imageURL
      createdAt
      updatedAt
    }
  }
`;

export const UpdateWorkoutGroupDocument = gql`
  mutation UpdateWorkoutGroup($input: UpdateWorkoutGroup!) {
    updateWorkoutGroup(input: $input) {
      id
      title
      date
      imageURL
      createdAt
      updatedAt
    }
  }
`;

export const DeleteWorkoutGroupDocument = gql`
  mutation DeleteWorkoutGroup($input: DeleteWorkoutGroup!) {
    deleteWorkoutGroup(input: $input)
  }
`;
