import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Dropbox from 'dropbox';
import RNFetchBlob from 'rn-fetch-blob';

import {useAuth} from '../Auth/AuthContext';
import img from '../images';

const dropboxDownloadUrl = 'https://content.dropboxapi.com/2/files/download';

// TODO move to components folder
const Item = ({tag, name, onPress}) => (
  <TouchableOpacity style={styles.listItemContainer} onPress={onPress}>
    <Image style={styles.listItemImage} source={img[tag]} />
    <Text style={styles.listItemText}>{name}</Text>
  </TouchableOpacity>
);

function Explorer({route, navigation}) {
  const {token} = useAuth();
  const path = route.params?.path || '';
  const [fileList, setFileList] = useState([]);
  const [isFetched, setFetched] = useState(false);

  useEffect(() => {
    navigation.setOptions({title: 'Explorer ' + path});

    const dropbox = new Dropbox({
      clientId: 'cnhaqvh1tlf35by',  // TODO get from env
      accessToken: token,
    });

    dropbox
      .filesListFolder({path})
      .then(res => {
        setFileList(res.entries);
        setFetched(true);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const renderItem = ({item}) => (
    <Item
      name={item.name}
      tag={item['.tag']}
      onPress={() => {
        if (item['.tag'] === 'file') {
          RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
              title: item.name,
              useDownloadManager: true,
              notification: true,
              // mime: 'text/markdown',
              description: 'File downloaded by download manager.',
            },
          })
            .fetch('POST', dropboxDownloadUrl, {
              Authorization: 'Bearer ' + token,
              'Dropbox-API-Arg': JSON.stringify({path: item.path_lower}),
            })
            .then(res => {
              // console.log('The file saved to ', res.path());
            })
            .catch(err => {
              // console.error('err', err);
            });
        } else {
          navigation.push('Explorer', {path: item.path_lower});
        }
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listHeadContainer}>
        <Text style={styles.listTitle}>Name</Text>
      </View>

      {isFetched && !fileList.length ? (
        <View style={styles.emptyTextContainer}>
          <Text>This folder is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={fileList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
  },
  listHeadContainer: {
    marginVertical: 4,
    paddingLeft: 22,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  listTitle: {
    fontWeight: '700',
    color: 'black',
  },
  listItemContainer: {
    marginHorizontal: 8,
    marginVertical: 4,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemImage: {
    width: 64,
    height: 64,
  },
  listItemText: {
    marginLeft: 12,
  },
  emptyTextContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Explorer;
