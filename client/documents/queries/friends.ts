import { gql } from '@apollo/client';

export const GetFriendsDocument = gql`
  query GetFriends {
    currentUser {
      id
      friends {
        id
        uid
        profile {
          id
          name
          imageURL
        }
      }
    }
  }
`;

export const GetFriendshipRequestsDocument = gql`
  query GetFriendshipRequests {
    currentUser {
      id
      friendshipRequests {
        id
        status
        requester {
          id
          uid
          profile {
            id
            name
            imageURL
          }
        }
        requestee {
          id
          uid
          profile {
            id
            name
            imageURL
          }
        }
      }
    }
  }
`;

export const AddWorkoutGroupMemberDocument = gql`
  mutation AddWorkoutGroupMember($input: AddWorkoutGroupMember!) {
    addWorkoutGroupMember(input: $input) {
      id
      title
      date
      createdAt
      updatedAt
      workouts {
        id
        date
        createdAt
        updatedAt
        user {
          id
          profile {
            id
            name
          }
        }
        workoutExercises {
          id
          exercise {
            id
            name
            category
            description
          }
          setLogs {
            id
            weight
            repCount
            setNumber
          }
        }
      }
    }
  }
`;