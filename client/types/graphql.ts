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

export type AddWorkoutGroupMember = {
  userID: Scalars['ID']['input'];
  workoutGroupID: Scalars['ID']['input'];
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

export type CreateSetLog = {
  repCount?: InputMaybe<Scalars['Int']['input']>;
  setNumber: Scalars['Int']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
  workoutExerciseID: Scalars['ID']['input'];
};

export type CreateWorkoutExercise = {
  exerciseID: Scalars['ID']['input'];
  workoutID: Scalars['ID']['input'];
};

export type CreateWorkoutGroup = {
  date?: InputMaybe<Scalars['String']['input']>;
  imageURL?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type DeleteSetLog = {
  setLogID: Scalars['ID']['input'];
};

export type DeleteUser = {
  id: Scalars['ID']['input'];
};

export type DeleteWorkout = {
  id: Scalars['ID']['input'];
};

export type DeleteWorkoutGroup = {
  id: Scalars['ID']['input'];
};

export type Exercise = {
  __typename?: 'Exercise';
  category?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  addWorkoutGroupMember: WorkoutGroup;
  createProfile: Profile;
  createSetLog: SetLog;
  createWorkoutExercise: WorkoutExercise;
  createWorkoutGroup: WorkoutGroup;
  deleteSetLog: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  deleteWorkout: Scalars['Boolean']['output'];
  deleteWorkoutGroup: Scalars['Boolean']['output'];
  rejectFriendshipRequest: Friendship;
  sendFriendshipRequest: Friendship;
  startWorkout: Workout;
  updateProfile: Profile;
  updateWorkoutGroup: WorkoutGroup;
};


export type MutationAcceptFriendshipRequestArgs = {
  input: AcceptFriendshipRequest;
};


export type MutationAddWorkoutGroupMemberArgs = {
  input: AddWorkoutGroupMember;
};


export type MutationCreateProfileArgs = {
  input: CreateProfile;
};


export type MutationCreateSetLogArgs = {
  input: CreateSetLog;
};


export type MutationCreateWorkoutExerciseArgs = {
  input: CreateWorkoutExercise;
};


export type MutationCreateWorkoutGroupArgs = {
  input: CreateWorkoutGroup;
};


export type MutationDeleteSetLogArgs = {
  input: DeleteSetLog;
};


export type MutationDeleteUserArgs = {
  input: DeleteUser;
};


export type MutationDeleteWorkoutArgs = {
  input: DeleteWorkout;
};


export type MutationDeleteWorkoutGroupArgs = {
  input: DeleteWorkoutGroup;
};


export type MutationRejectFriendshipRequestArgs = {
  input: RejectFriendshipRequest;
};


export type MutationSendFriendshipRequestArgs = {
  input: SendFriendshipRequest;
};


export type MutationStartWorkoutArgs = {
  input?: InputMaybe<StartWorkout>;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfile;
};


export type MutationUpdateWorkoutGroupArgs = {
  input: UpdateWorkoutGroup;
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
  exercises: Array<Exercise>;
  users: Array<User>;
  workoutGroup?: Maybe<WorkoutGroup>;
  workoutGroups: Array<WorkoutGroup>;
};


export type QueryWorkoutGroupArgs = {
  id: Scalars['ID']['input'];
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
};

export type StartWorkout = {
  date?: InputMaybe<Scalars['String']['input']>;
  workoutGroupID?: InputMaybe<Scalars['ID']['input']>;
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

export type UpdateWorkoutGroup = {
  date?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imageURL?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  workouts: Array<Workout>;
};

export type Workout = {
  __typename?: 'Workout';
  createdAt: Scalars['String']['output'];
  date?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  user: User;
  userID: Scalars['ID']['output'];
  workoutExercises: Array<WorkoutExercise>;
  workoutGroup?: Maybe<WorkoutGroup>;
  workoutGroupID?: Maybe<Scalars['ID']['output']>;
};

export type WorkoutExercise = {
  __typename?: 'WorkoutExercise';
  exercise: Exercise;
  id: Scalars['ID']['output'];
  setLogs: Array<SetLog>;
  workout: Workout;
};

export type WorkoutGroup = {
  __typename?: 'WorkoutGroup';
  createdAt: Scalars['String']['output'];
  date?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageURL?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  workouts: Array<Workout>;
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

export type CreateProfileMutationVariables = Exact<{
  input: CreateProfile;
}>;


export type CreateProfileMutation = { __typename?: 'Mutation', createProfile: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfile;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } };

export type StartWorkoutMutationVariables = Exact<{
  input: StartWorkout;
}>;


export type StartWorkoutMutation = { __typename?: 'Mutation', startWorkout: { __typename?: 'Workout', id: string, date?: string | null, createdAt: string, updatedAt: string } };

export type DeleteWorkoutMutationVariables = Exact<{
  input: DeleteWorkout;
}>;


export type DeleteWorkoutMutation = { __typename?: 'Mutation', deleteWorkout: boolean };

export type CreateWorkoutExerciseMutationVariables = Exact<{
  input: CreateWorkoutExercise;
}>;


export type CreateWorkoutExerciseMutation = { __typename?: 'Mutation', createWorkoutExercise: { __typename?: 'WorkoutExercise', id: string, workout: { __typename?: 'Workout', id: string, createdAt: string, updatedAt: string }, exercise: { __typename?: 'Exercise', id: string, name: string, description?: string | null, category?: string | null } } };

export type CreateSetLogMutationVariables = Exact<{
  input: CreateSetLog;
}>;


export type CreateSetLogMutation = { __typename?: 'Mutation', createSetLog: { __typename?: 'SetLog', id: string, weight: number, repCount: number, setNumber: number } };

export type DeleteSetLogMutationVariables = Exact<{
  input: DeleteSetLog;
}>;


export type DeleteSetLogMutation = { __typename?: 'Mutation', deleteSetLog: boolean };

export type CreateWorkoutGroupMutationVariables = Exact<{
  input: CreateWorkoutGroup;
}>;


export type CreateWorkoutGroupMutation = { __typename?: 'Mutation', createWorkoutGroup: { __typename?: 'WorkoutGroup', id: string, title: string, date?: string | null, imageURL?: string | null, createdAt: string, updatedAt: string } };

export type UpdateWorkoutGroupMutationVariables = Exact<{
  input: UpdateWorkoutGroup;
}>;


export type UpdateWorkoutGroupMutation = { __typename?: 'Mutation', updateWorkoutGroup: { __typename?: 'WorkoutGroup', id: string, title: string, date?: string | null, imageURL?: string | null, createdAt: string, updatedAt: string } };

export type DeleteWorkoutGroupMutationVariables = Exact<{
  input: DeleteWorkoutGroup;
}>;


export type DeleteWorkoutGroupMutation = { __typename?: 'Mutation', deleteWorkoutGroup: boolean };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, uid: string, createdAt: string, updatedAt: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null } | null, recommendedUsers: Array<{ __typename?: 'User', id: string, uid: string, createdAt: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null } | null }> } };

export type HomeScreenDataQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeScreenDataQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, profile?: { __typename?: 'Profile', id: string, name: string } | null, workouts: Array<{ __typename?: 'Workout', id: string, date?: string | null, createdAt: string, workoutGroup?: { __typename?: 'WorkoutGroup', id: string, title: string } | null, workoutExercises: Array<{ __typename?: 'WorkoutExercise', id: string, exercise: { __typename?: 'Exercise', id: string, name: string, category?: string | null }, setLogs: Array<{ __typename?: 'SetLog', id: string, weight: number, repCount: number, setNumber: number }> }> }> } };

export type ExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type ExercisesQuery = { __typename?: 'Query', exercises: Array<{ __typename?: 'Exercise', id: string, name: string, description?: string | null, category?: string | null }> };

export type GetFriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, friends: Array<{ __typename?: 'User', id: string, uid: string, createdAt: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null }> } };

export type GetFriendshipRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendshipRequestsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, friendshipRequests: Array<{ __typename?: 'Friendship', id: string, status: FriendshipStatus, requester: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null }, requestee: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null } }> } };

export type AddWorkoutGroupMemberMutationVariables = Exact<{
  input: AddWorkoutGroupMember;
}>;


export type AddWorkoutGroupMemberMutation = { __typename?: 'Mutation', addWorkoutGroupMember: { __typename?: 'WorkoutGroup', id: string, title: string, date?: string | null, createdAt: string, updatedAt: string, workouts: Array<{ __typename?: 'Workout', id: string, date?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'User', id: string, profile?: { __typename?: 'Profile', id: string, name: string } | null }, workoutExercises: Array<{ __typename?: 'WorkoutExercise', id: string, exercise: { __typename?: 'Exercise', id: string, name: string, category?: string | null, description?: string | null }, setLogs: Array<{ __typename?: 'SetLog', id: string, weight: number, repCount: number, setNumber: number }> }> }> } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } | null } };

export type WorkoutGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkoutGroupsQuery = { __typename?: 'Query', workoutGroups: Array<{ __typename?: 'WorkoutGroup', id: string, title: string, date?: string | null, imageURL?: string | null, createdAt: string, updatedAt: string, workouts: Array<{ __typename?: 'Workout', id: string, date?: string | null, createdAt: string, updatedAt: string, workoutExercises: Array<{ __typename?: 'WorkoutExercise', id: string, exercise: { __typename?: 'Exercise', id: string, name: string, category?: string | null, description?: string | null }, setLogs: Array<{ __typename?: 'SetLog', id: string, weight: number, repCount: number, setNumber: number }> }> }> }> };

export type WorkoutGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type WorkoutGroupQuery = { __typename?: 'Query', workoutGroup?: { __typename?: 'WorkoutGroup', id: string, title: string, date?: string | null, imageURL?: string | null, createdAt: string, updatedAt: string, workouts: Array<{ __typename?: 'Workout', id: string, date?: string | null, createdAt: string, updatedAt: string, user: { __typename?: 'User', id: string, profile?: { __typename?: 'Profile', id: string, name: string, imageURL?: string | null } | null }, workoutExercises: Array<{ __typename?: 'WorkoutExercise', id: string, exercise: { __typename?: 'Exercise', id: string, name: string, category?: string | null, description?: string | null }, setLogs: Array<{ __typename?: 'SetLog', id: string, weight: number, repCount: number, setNumber: number }> }> }> } | null };

export type CurrentUserWorkoutGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserWorkoutGroupsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, workouts: Array<{ __typename?: 'Workout', id: string, date?: string | null, createdAt: string, updatedAt: string, workoutGroup?: { __typename?: 'WorkoutGroup', id: string, title: string, date?: string | null, imageURL?: string | null, createdAt: string, updatedAt: string } | null, workoutExercises: Array<{ __typename?: 'WorkoutExercise', id: string, exercise: { __typename?: 'Exercise', id: string, name: string, category?: string | null, description?: string | null }, setLogs: Array<{ __typename?: 'SetLog', id: string, weight: number, repCount: number, setNumber: number }> }> }> } };

export type WorkoutsQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkoutsQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, workouts: Array<{ __typename?: 'Workout', id: string, date?: string | null, createdAt: string, updatedAt: string, workoutGroup?: { __typename?: 'WorkoutGroup', id: string, title: string } | null, workoutExercises: Array<{ __typename?: 'WorkoutExercise', id: string, exercise: { __typename?: 'Exercise', id: string, name: string, category?: string | null, description?: string | null }, setLogs: Array<{ __typename?: 'SetLog', id: string, weight: number, repCount: number, setNumber: number }> }> }> } };


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
export const CreateProfileDocument = gql`
    mutation CreateProfile($input: CreateProfile!) {
  createProfile(input: $input) {
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
    mutation StartWorkout($input: StartWorkout!) {
  startWorkout(input: $input) {
    id
    date
    createdAt
    updatedAt
  }
}
    `;
export const DeleteWorkoutDocument = gql`
    mutation DeleteWorkout($input: DeleteWorkout!) {
  deleteWorkout(input: $input)
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
export const HomeScreenDataDocument = gql`
    query HomeScreenData {
  currentUser {
    id
    profile {
      id
      name
    }
    workouts {
      id
      date
      createdAt
      workoutGroup {
        id
        title
      }
      workoutExercises {
        id
        exercise {
          id
          name
          category
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
export const WorkoutGroupsDocument = gql`
    query WorkoutGroups {
  workoutGroups {
    id
    title
    date
    imageURL
    createdAt
    updatedAt
    workouts {
      id
      date
      createdAt
      updatedAt
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
export const WorkoutGroupDocument = gql`
    query WorkoutGroup($id: ID!) {
  workoutGroup(id: $id) {
    id
    title
    date
    imageURL
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
          imageURL
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
export const CurrentUserWorkoutGroupsDocument = gql`
    query CurrentUserWorkoutGroups {
  currentUser {
    id
    workouts {
      id
      date
      createdAt
      updatedAt
      workoutGroup {
        id
        title
        date
        imageURL
        createdAt
        updatedAt
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
export const WorkoutsDocument = gql`
    query Workouts {
  currentUser {
    id
    workouts {
      id
      date
      createdAt
      updatedAt
      workoutGroup {
        id
        title
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
    CreateProfile(variables: CreateProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateProfileMutation>({ document: CreateProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateProfile', 'mutation', variables);
    },
    UpdateProfile(variables: UpdateProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProfileMutation>({ document: UpdateProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateProfile', 'mutation', variables);
    },
    StartWorkout(variables: StartWorkoutMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<StartWorkoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<StartWorkoutMutation>({ document: StartWorkoutDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'StartWorkout', 'mutation', variables);
    },
    DeleteWorkout(variables: DeleteWorkoutMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteWorkoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteWorkoutMutation>({ document: DeleteWorkoutDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteWorkout', 'mutation', variables);
    },
    CreateWorkoutExercise(variables: CreateWorkoutExerciseMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateWorkoutExerciseMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateWorkoutExerciseMutation>({ document: CreateWorkoutExerciseDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateWorkoutExercise', 'mutation', variables);
    },
    CreateSetLog(variables: CreateSetLogMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateSetLogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateSetLogMutation>({ document: CreateSetLogDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateSetLog', 'mutation', variables);
    },
    DeleteSetLog(variables: DeleteSetLogMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteSetLogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteSetLogMutation>({ document: DeleteSetLogDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteSetLog', 'mutation', variables);
    },
    CreateWorkoutGroup(variables: CreateWorkoutGroupMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateWorkoutGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateWorkoutGroupMutation>({ document: CreateWorkoutGroupDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateWorkoutGroup', 'mutation', variables);
    },
    UpdateWorkoutGroup(variables: UpdateWorkoutGroupMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateWorkoutGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateWorkoutGroupMutation>({ document: UpdateWorkoutGroupDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateWorkoutGroup', 'mutation', variables);
    },
    DeleteWorkoutGroup(variables: DeleteWorkoutGroupMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteWorkoutGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteWorkoutGroupMutation>({ document: DeleteWorkoutGroupDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteWorkoutGroup', 'mutation', variables);
    },
    CurrentUser(variables?: CurrentUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CurrentUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurrentUserQuery>({ document: CurrentUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CurrentUser', 'query', variables);
    },
    HomeScreenData(variables?: HomeScreenDataQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HomeScreenDataQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HomeScreenDataQuery>({ document: HomeScreenDataDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'HomeScreenData', 'query', variables);
    },
    Exercises(variables?: ExercisesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ExercisesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ExercisesQuery>({ document: ExercisesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Exercises', 'query', variables);
    },
    GetFriends(variables?: GetFriendsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFriendsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFriendsQuery>({ document: GetFriendsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFriends', 'query', variables);
    },
    GetFriendshipRequests(variables?: GetFriendshipRequestsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetFriendshipRequestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFriendshipRequestsQuery>({ document: GetFriendshipRequestsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFriendshipRequests', 'query', variables);
    },
    AddWorkoutGroupMember(variables: AddWorkoutGroupMemberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AddWorkoutGroupMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddWorkoutGroupMemberMutation>({ document: AddWorkoutGroupMemberDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AddWorkoutGroupMember', 'mutation', variables);
    },
    GetProfile(variables?: GetProfileQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProfileQuery>({ document: GetProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetProfile', 'query', variables);
    },
    WorkoutGroups(variables?: WorkoutGroupsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkoutGroupsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkoutGroupsQuery>({ document: WorkoutGroupsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WorkoutGroups', 'query', variables);
    },
    WorkoutGroup(variables: WorkoutGroupQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkoutGroupQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkoutGroupQuery>({ document: WorkoutGroupDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WorkoutGroup', 'query', variables);
    },
    CurrentUserWorkoutGroups(variables?: CurrentUserWorkoutGroupsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CurrentUserWorkoutGroupsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurrentUserWorkoutGroupsQuery>({ document: CurrentUserWorkoutGroupsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CurrentUserWorkoutGroups', 'query', variables);
    },
    Workouts(variables?: WorkoutsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkoutsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkoutsQuery>({ document: WorkoutsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Workouts', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;