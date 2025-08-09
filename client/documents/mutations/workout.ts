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

export const CreateWorkoutExerciseDocument = gql`
  mutation CreateWorkoutExercise($input: CreateWorkoutExercise!) {
    createWorkoutExercise(input: $input) {
      id
      workout {
        id
        createdAt
        updatedAt
      }
      exercise {
        id
        name
        description
        category
      }
    }
  }
`;

export const CreateSetLogDocument = gql`
  mutation CreateSetLog($input: CreateSetLog!) {
    createSetLog(input: $input) {
      id
      weight
      repCount
      setNumber
    }
  }
`;

export const DeleteSetLogDocument = gql`
  mutation DeleteSetLog($input: DeleteSetLog!) {
    deleteSetLog(input: $input)
  }
`;