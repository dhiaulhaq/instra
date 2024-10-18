import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginProvider } from './contexts/LoginContext';
import StackHolder from './stacks/StackHolder';
import { ApolloProvider } from '@apollo/client';
import client from './config/apollo';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <LoginProvider>
        <StackHolder />
      </LoginProvider>
    </ApolloProvider>
  );
}
