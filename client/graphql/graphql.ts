/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum ActivityLevel {
  ExtremelyActive = 'EXTREMELY_ACTIVE',
  LightlyActive = 'LIGHTLY_ACTIVE',
  ModeratelyActive = 'MODERATELY_ACTIVE',
  Sedentary = 'SEDENTARY',
  VeryActive = 'VERY_ACTIVE'
}

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

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type Mutation = {
  __typename?: 'Mutation';
  createProfile: Profile;
  deleteUser: Scalars['Boolean']['output'];
  updateProfile: Profile;
};


export type MutationCreateProfileArgs = {
  input: CreateProfile;
};


export type MutationDeleteUserArgs = {
  input: DeleteUser;
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
  id: Scalars['ID']['output'];
  profile?: Maybe<Profile>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, uid: string, createdAt: string, updatedAt: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null } | null } };

export type ProfileEditCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileEditCurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfile;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } };


export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"activityLevel"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const ProfileEditCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProfileEditCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"activityLevel"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileEditCurrentUserQuery, ProfileEditCurrentUserQueryVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfile"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"activityLevel"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum ActivityLevel {
  ExtremelyActive = 'EXTREMELY_ACTIVE',
  LightlyActive = 'LIGHTLY_ACTIVE',
  ModeratelyActive = 'MODERATELY_ACTIVE',
  Sedentary = 'SEDENTARY',
  VeryActive = 'VERY_ACTIVE'
}

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

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type Mutation = {
  __typename?: 'Mutation';
  createProfile: Profile;
  deleteUser: Scalars['Boolean']['output'];
  updateProfile: Profile;
};


export type MutationCreateProfileArgs = {
  input: CreateProfile;
};


export type MutationDeleteUserArgs = {
  input: DeleteUser;
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
  id: Scalars['ID']['output'];
  profile?: Maybe<Profile>;
  uid: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, uid: string, createdAt: string, updatedAt: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null } | null } };

export type ProfileEditCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileEditCurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: string, uid: string, profile?: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfile;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', id: string, name: string, birthDate?: string | null, gender?: Gender | null, height?: number | null, weight?: number | null, activityLevel?: ActivityLevel | null, imageURL?: string | null } };
