import { gql } from '@apollo/client';

export const StartWorkoutDocument = gql`
  mutation StartWorkout {
    startWorkout {
      id
      createdAt
      updatedAt
    }
  }
`;

export const AddSetLogDocument = gql`
  mutation AddSetLog($input: AddSetLog!) {
    addSetLog(input: $input) {
      id
      workoutTypeID
      weight
      repCount
      setNumber
      workoutType {
        id
        name
        description
        category
      }
    }
  }
`;