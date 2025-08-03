import { gql } from '@apollo/client';

export const WorkoutTypesDocument = gql`
  query WorkoutTypes {
    workoutTypes {
      id
      name
      description
      category
    }
  }
`;