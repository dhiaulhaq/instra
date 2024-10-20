import { ApolloClient, InMemoryCache } from "@apollo/client";

import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStroe from "expo-secure-store";

const httpLink = createHttpLink({
    uri: "https://1tj5ztvt-3000.asse.devtunnels.ms/",
});

const authLink = setContext(async (_, { headers }) => {
    const token = await SecureStroe.getItemAsync("token");

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;