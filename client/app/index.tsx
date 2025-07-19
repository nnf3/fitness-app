import { Text, View } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { UsersQuery } from "../types/graphql";

const GET_USERS = gql`
  query users {
    users {
      id
      name
    }
  }
`;

export default function Index() {
  const { data, loading, error } = useQuery<UsersQuery>(GET_USERS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello World</Text>
      {data?.users.map((user: any) => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}
