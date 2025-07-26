import React, { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "./apollo-client";
import { useAuth } from "../hooks";

interface ApolloWrapperProps {
  children: React.ReactNode;
}

export const ApolloWrapper = ({ children }: ApolloWrapperProps) => {
  const { getIdToken } = useAuth();
  const [client, setClient] = useState(() => createApolloClient(async () => null));

  useEffect(() => {
    setClient(createApolloClient(getIdToken));
  }, [getIdToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}