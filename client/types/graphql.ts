import { GraphQLClient, RequestOptions } from 'graphql-request';
import { gql } from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AcceptFriendshipRequest = {
  friendshipID: Scalars['ID']['input'];
};

export enum ActivityLevel {
  ExtremelyActive = 'EXTREMELY_ACTIVE',
  LightlyActive = 'LIGHTLY_ACTIVE',
  ModeratelyActive = 'MODERATELY_ACTIVE',
  Sedentary = 'SEDENTARY',
  VeryActive = 'VERY_ACTIVE'
}

export type AddSetLog = {
  repCount?: InputMaybe<Scalars['Int']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
  workoutLogID: Scalars['ID']['input'];
  workoutTypeID: Scalars['ID']['input'];
};

export type CreateProfile = {
  activityLevel?: InputMaybe<ActivityLevel>;
  birthDate: Scalars['String']['input'];
  gender: Gender;
  height?: InputMaybe<Scalars['Float']['input']>;
  imageURL?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type DeleteUser = {
  id: Scalars['ID']['input'];
};

export type Friendship = {
  __typename?: 'Friendship';
  id: Scalars['ID']['output'];
  requestee: User;
  requesteeID: Scalars['ID']['output'];
  requester: User;
  requesterID: Scalars['ID']['output'];
  status: FriendshipStatus;
};

export enum FriendshipStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptFriendshipRequest: Friendship;
  addSetLog: SetLog;
  createProfile: Profile;
  deleteUser: Scalars['Boolean']['output'];
  rejectFriendshipRequest: Friendship;
  sendFriendshipRequest: Friendship;
  startWorkout: WorkoutLog;
  updateProfile: Profile;
};


export type MutationAcceptFriendshipRequestArgs = {
  input: AcceptFriendshipRequest;
};


export type MutationAddSetLogArgs = {
  input: AddSetLog;
};


export type MutationCreateProfileArgs = {
  input: CreateProfile;
};


export type MutationDeleteUserArgs = {
  input: DeleteUser;
};


export type MutationRejectFriendshipRequestArgs = {
  input: RejectFriendshipRequest;
};


export type MutationSendFriendshipRequestArgs = {
  input: SendFriendshipRequest;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfile;
};

export type NewUser = {
  name: Scalars['String']['input'];
};

export type Profile = {
  __typename?: 'Profile';
  activityLevel?: Maybe<ActivityLevel>;
  birthDate?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  gender?: Maybe<Gender>;
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  imageURL?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  user: User;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  currentUser: User;
  users: Array<User>;
  workoutTypes: Array<WorkoutType>;
};

export type RejectFriendshipRequest = {
  friendshipID: Scalars['ID']['input'];
};

export type SendFriendshipRequest = {
  requesteeID: Scalars['ID']['input'];
};

export type SetLog = {
  __typename?: 'SetLog';
  id: Scalars['ID']['output'];
  repCount: Scalars['Int']['output'];
  setNumber: Scalars['Int']['output'];
  weight: Scalars['Int']['output'];
  workoutLog: WorkoutLog;
  workoutType: WorkoutType;
  workoutTypeID: Scalars['ID']['output'];
};

export type UpdateProfile = {
  activityLevel?: InputMaybe<ActivityLevel>;
  birthDate?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  height?: InputMaybe<Scalars['Float']['input']>;
  imageURL?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  friends: Array<User>;
  friendshipRequests: Array<Friendship>;
  id: Scalars['ID']['output'];
  profile?: Maybe<Profile>;
  recommendedUsers: Array<User>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  workoutLogs: Array<WorkoutLog>;
};

export type WorkoutLog = {
  __typename?: 'WorkoutLog';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  setLogs: Array<SetLog>;
  updatedAt: Scalars['String']['output'];
};

export type WorkoutType = {
  __typename?: 'WorkoutType';
  category?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  setLogs: Array<SetLog>;
};

export type AcceptFriendshipRequestMutationVariables = Exact<{
  input: AcceptFriendshipRequest;
}>;


export type AcceptFriendshipRequestMutation = { __typename?: 'Mutation', acceptFriendshipRequest: { __typename?: 'Friendship', id: string, status: FriendshipStatus, requester: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null }, requestee: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null } } };

export type RejectFriendshipRequestMutationVariables = Exact<{
  input: RejectFriendshipRequest;
}>;


export type RejectFriendshipRequestMutation = { __typename?: 'Mutation', rejectFriendshipRequest: { __typename?: 'Friendship', id: string, status: FriendshipStatus, requester: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null }, requestee: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null } } };

export type SendFriendshipRequestMutationVariables = Exact<{
  input: SendFriendshipRequest;
}>;


export type SendFriendshipRequestMutation = { __typename?: 'Mutation', sendFriendshipRequest: { __typename?: 'Friendship', id: string, status: FriendshipStatus, requester: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null }, requestee: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null } } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfile;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } };

export type StartWorkoutMutationVariables = Exact<{ [key: string]: never; }>;


export type StartWorkoutMutation = { __typename?: 'Mutation', startWorkout: { __typename?: 'WorkoutLog', id: string, createdAt: string, updatedAt: string } };

export type AddSetLogMutationVariables = Exact<{
  input: AddSetLog;
}>;


export type AddSetLogMutation = { __typename?: 'Mutation', addSetLog: { __typename?: 'SetLog', id: string, workoutTypeID: string, weight: number, repCount: number, setNumber: number, workoutType: { __typename?: 'WorkoutType', id: string, name: string, description?: string | null, category?: string | null } } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, uid: string, createdAt: string, updatedAt: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null } | null, recommendedUsers: Array<{ __typename?: 'User', id: string, uid: string, createdAt: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null } | null }> } };

export type GetFriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, friends: Array<{ __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null }> } };

export type GetFriendshipRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendshipRequestsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, friendshipRequests: Array<{ __typename?: 'Friendship', id: string, status: FriendshipStatus, requester: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null }, requestee: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null } }> } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } | null } };

export type WorkoutLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkoutLogsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, workoutLogs: Array<{ __typename?: 'WorkoutLog', id: string, createdAt: string, updatedAt: string, setLogs: Array<{ __typename?: 'SetLog', id: string, weight: number, repCount: number, setNumber: number, workoutType: { __typename?: 'WorkoutType', id: string, name: string, category?: string | null, description?: string | null } }> }> } };

export type WorkoutTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkoutTypesQuery = { __typename?: 'Query', workoutTypes: Array<{ __typename?: 'WorkoutType', id: string, name: string, description?: string | null, category?: string | null }> };


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
export const SendFriendshipRequestDocument = gql`
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
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: UpdateProfile!) {
  updateProfile(input: $input) {
    id
    name
    birthDate
    gender
    height
    weight
    activityLevel
    imageURL
  }
}
    `;
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
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    id
    uid
    createdAt
    updatedAt
    profile {
      id
      name
      birthDate
      gender
      height
      weight
      activityLevel
    }
    recommendedUsers {
      id
      uid
      createdAt
      profile {
        id
        name
        birthDate
        gender
        height
        weight
        activityLevel
      }
    }
  }
}
    `;
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
export const GetProfileDocument = gql`
    query GetProfile {
  currentUser {
    id
    uid
    profile {
      id
      name
      birthDate
      gender
      height
      weight
      activityLevel
      imageURL
    }
  }
}
    `;
export const WorkoutLogsDocument = gql`
    query WorkoutLogs {
  currentUser {
    id
    workoutLogs {
      id
      createdAt
      updatedAt
      setLogs {
        id
        weight
        repCount
        setNumber
        workoutType {
          id
          name
          category
          description
        }
      }
    }
  }
}
    `;
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    AcceptFriendshipRequest(variables: AcceptFriendshipRequestMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AcceptFriendshipRequestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AcceptFriendshipRequestMutation>({ document: AcceptFriendshipRequestDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AcceptFriendshipRequest', 'mutation', variables);
    },
    RejectFriendshipRequest(variables: RejectFriendshipRequestMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RejectFriendshipRequestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RejectFriendshipRequestMutation>({ document: RejectFriendshipRequestDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RejectFriendshipRequest', 'mutation', variables);
    },
    SendFriendshipRequest(variables: SendFriendshipRequestMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SendFriendshipRequestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendFriendshipRequestMutation>({ document: SendFriendshipRequestDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SendFriendshipRequest', 'mutation', variables);
    },
    UpdateProfile(variables: UpdateProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProfileMutation>({ document: UpdateProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateProfile', 'mutation', variables);
    },
    StartWorkout(variables?: StartWorkoutMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StartWorkoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<StartWorkoutMutation>({ document: StartWorkoutDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'StartWorkout', 'mutation', variables);
    },
    AddSetLog(variables: AddSetLogMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AddSetLogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddSetLogMutation>({ document: AddSetLogDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AddSetLog', 'mutation', variables);
    },
    CurrentUser(variables?: CurrentUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CurrentUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurrentUserQuery>({ document: CurrentUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CurrentUser', 'query', variables);
    },
    GetFriends(variables?: GetFriendsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFriendsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFriendsQuery>({ document: GetFriendsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFriends', 'query', variables);
    },
    GetFriendshipRequests(variables?: GetFriendshipRequestsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFriendshipRequestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFriendshipRequestsQuery>({ document: GetFriendshipRequestsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFriendshipRequests', 'query', variables);
    },
    GetProfile(variables?: GetProfileQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProfileQuery>({ document: GetProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetProfile', 'query', variables);
    },
    WorkoutLogs(variables?: WorkoutLogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkoutLogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkoutLogsQuery>({ document: WorkoutLogsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WorkoutLogs', 'query', variables);
    },
    WorkoutTypes(variables?: WorkoutTypesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkoutTypesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkoutTypesQuery>({ document: WorkoutTypesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WorkoutTypes', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;