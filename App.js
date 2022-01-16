import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ProvideAuth, useAuth} from './Auth/AuthContext';
import Explorer from './screens/Explorer';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

function Navigation() {
  const {token} = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <Stack.Screen name="Explorer" component={Explorer} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ProvideAuth>
      <Navigation />
    </ProvideAuth>
  );
}
