import React from 'react';
import {View, Button, Image, StyleSheet} from 'react-native';

import {useAuth} from '../Auth/AuthContext';
import img from '../images';

function Login() {
  const {signIn} = useAuth();

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={img.dropboxLogo} />
      <Button title="Login with Dropbox" onPress={() => signIn()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    height: '100%',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginVertical: 16,
  },
});

export default Login;
