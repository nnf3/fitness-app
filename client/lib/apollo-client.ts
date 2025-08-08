import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { Platform } from "react-native";
import { setContext } from "@apollo/client/link/context";

// プラットフォームに応じてURIを設定
const getGraphQLUri = () => {
  if (process.env.EXPO_PUBLIC_ENV === 'production' || process.env.EXPO_PUBLIC_ENV === 'preview') {
    return `${process.env.EXPO_PUBLIC_SERVER_URL}/query`;
  }

  // 環境変数からサーバー情報を取得
  const serverIP = process.env.EXPO_PUBLIC_SERVER_IP || 'localhost';

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // iOS/Android用: ホストマシンのIPアドレスを使用
    return `http://${serverIP}:8080/query`;
  } else {
    // Web用: localhostを使用
    return `http://localhost:8080/query`;
  }
};

// Apollo Clientの設定
const httpLink = createHttpLink({
  uri: getGraphQLUri(),
});

export const createApolloClient = (getIdToken: () => Promise<string | null>) => {
  const authLink = setContext(async (_, { headers }) => {
    const token = await getIdToken();
    console.log('token', token);
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};