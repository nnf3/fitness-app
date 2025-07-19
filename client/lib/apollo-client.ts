import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { Platform } from "react-native";

// プラットフォームに応じてURIを設定
const getGraphQLUri = () => {
  // 環境変数からサーバー情報を取得
  const serverIP = process.env.EXPO_PUBLIC_SERVER_IP || 'localhost';
  const serverPort = process.env.EXPO_PUBLIC_SERVER_PORT || '8080';

  if (Platform.OS === 'ios') {
    // iOSシミュレータ用: ホストマシンのIPアドレスを使用
    return `http://${serverIP}:${serverPort}/query`;
  } else if (Platform.OS === 'android') {
    // Androidエミュレータ用: 10.0.2.2を使用
    return `http://10.0.2.2:${serverPort}/query`;
  } else {
    // Web用: localhostを使用
    return `http://localhost:${serverPort}/query`;
  }
};

// Apollo Clientの設定
const httpLink = createHttpLink({
  uri: getGraphQLUri(),
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});