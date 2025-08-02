import { gql } from '@apollo/client';

export const GetFriends = gql`
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

export const GetFriendshipRequests = gql`
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