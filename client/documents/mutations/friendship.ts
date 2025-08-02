import { gql } from '@apollo/client';

export const AcceptFriendshipRequestDocument = gql`
  mutation AcceptFriendshipRequest($input: AcceptFriendshipRequest!) {
    acceptFriendshipRequest(input: $input) {
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
`;

export const RejectFriendshipRequestDocument = gql`
  mutation RejectFriendshipRequest($input: RejectFriendshipRequest!) {
    rejectFriendshipRequest(input: $input) {
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
`;

export const SEND_FRIENDSHIP_REQUEST = gql`
  mutation SendFriendshipRequest($input: SendFriendshipRequest!) {
    sendFriendshipRequest(input: $input) {
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
`;