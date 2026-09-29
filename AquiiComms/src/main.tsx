import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client/react';
import './index.css'
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink 
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1500/graphql';

const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`, 
});

const authLink = setContext((_, { headers }) => {
  const storedData = localStorage.getItem('userInfo'); 
  let token = "";

  if (storedData) {
    try {
      const parsedUser = JSON.parse(storedData);
      token = parsedUser.token;
    } catch (error) {
      console.error("Failed to parse user data from local storage", error);
    }
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Cart: {
        fields: {
          items: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);