import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRecoilState} from 'recoil';
import MyInput from '../../Components/MyInput';
import MyText from '../../Components/MyText';
import {studentDataState, chatsDataState} from '../../Recoil/atoms';
import dimensions from '../../utilities/dimensions';

const ChatListScreen = props => {
  const [studentData, setStudentData] = useRecoilState(studentDataState);
  const [chatsData, setChatsData] = useRecoilState(chatsDataState);

  let filteredUsers = [];

  studentData.map(student => {
    chatsData.map(chat => {
      console.log(student, chat);
      if (student.id == chat.userId) {
        filteredUsers.push(student);
      }
    });
  });

  const [index, setIndex] = useState(1);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [filteredList, setFilteredList] = useState(filteredUsers);

  const gotoScreen = (screen, item) => {
    props.navigation.navigate(screen, {
      userId: item.id,
    });
  };

  const loadMoreData = () => {
    setTimeout(() => {
      if (index < 3) {
        setIndex(index + 1);
      }
      setLoadingComplete(true);
    }, 2000);
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {!loadingComplete && (
          <TouchableOpacity onPress={() => props.onPress()}>
            <ActivityIndicator color="black" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderListItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => gotoScreen('Chat Details', item)}
        key={index}
      >
        <View style={styles.item}>
          <Image source={{uri: item.picture}} style={[styles.avatar]} />

          <View style={styles.namesContainer}>
            <View style={styles.itemRow}>
              <MyText style={styles.name}>{item.firstName} </MyText>
              <MyText style={styles.name}>{item.lastName}</MyText>
            </View>
            <View style={styles.itemRow}>
              <MyText style={styles.text}>{'Class:' + item.class} </MyText>
              <MyText style={[styles.text, {marginLeft: 10}]}>
                {'Roll No.:' + item.rollNo}
              </MyText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onChange = val => {
    let key = val;
    let filteredList = [];
    if (filteredUsers) {
      filteredList = filteredUsers.filter(
        item => item.firstName.includes(key) || item.lastName.includes(key),
      );
    }

    // console.log({filteredList});
    setFilteredList(filteredList);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <View style={styles.topBar}>
          <MyInput
            type={'default'}
            onTextChange={text => onChange(text)}
            placeholder={'search'}
            onBlur={() => {}}
          />
        </View>
        <FlatList
          contentContainerStyle={{minHeight: '100%'}}
          keyExtractor={(item, index) => index}
          data={filteredList.slice(0, index * 20)}
          renderItem={({item, index}) => renderListItem(item, index)}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={renderFooter()}
          //Adding Load More button as footer component
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    width: '90%',
    marginHorizontal: dimensions.vw * 5,
  },
  item: {
    padding: 10,
    width: '100%',
    // backgroundColor: colors.primaryColor,
    marginVertical: 6,
    flexDirection: 'row',
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontSize: 13,
    color: 'black',
  },
  name: {fontWeight: 'bold', fontSize: 15, color: 'black'},
  footer: {
    // padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  namesContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  itemRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  gotoTop: {
    height: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  topBar: {
    marginTop: -40,
  },
});

export default ChatListScreen;