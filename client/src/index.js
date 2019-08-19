import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { setContext } from 'apollo-link-context';

const token = localStorage.getItem('token');
const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000',
  headers: {
    token
  }
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  console.log('token', token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      token: token ? token : ''
    }
  };
});

const client = new ApolloClient({ cache, link: authLink.concat(link) });

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
