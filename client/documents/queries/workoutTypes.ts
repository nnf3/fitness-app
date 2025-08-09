import { gql } from '@apollo/client';

export const ExercisesDocument = gql`
  query Exercises {
    exercises {
      id
      name
      description
      category
    }
  }
`;