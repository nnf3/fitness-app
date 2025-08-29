import { gql } from '@apollo/client';

export const GetFriendsDocument = gql`
  query GetFriends {
    currentUser {
      id
      friends {
        id
        uid
        createdAt
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