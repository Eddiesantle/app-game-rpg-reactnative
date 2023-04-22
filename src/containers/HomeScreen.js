import React from 'react';
import {StyleSheet, Text, View,ScrollView,FlatList, Alert} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeout from 'react-native-swipeout';
import { SafeAreaView } from 'react-navigation';

import styles from './../Utils/styles'

var db = openDatabase({ name: 'rpg.db'});

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  }
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      isLoading: true,
      FlatListItems: [],
      activeRowKey: null,
      modalVisible: false,
    }

   

  }


  async componentDidMount() {
    
    await     db.transaction(tx => {
      tx.executeSql('SELECT * FROM PERSONAGENS', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          console.log(results.rows.item(i))
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });
   
   
  }

  async deleteItemById(item) {
  
    db.transaction(tx => {
      tx.executeSql('DELETE FROM PERSONAGENS WHERE ID_PERSONAGEM = ?', [item], (tx, results) => {
    
      });

    });

  }

  telaItem = (item) => {

    this.props.navigation.navigate("Personagem", { params: item })
  }


  renderItem = ({ item, index }) => {
    const swipeSettings = {
      autoclose: true,
      onClose: (secId, rowId, direction) => {
        if (this.state.activeRowKey != null) {
          this.setState({
            activeRowKey: null
          })
        }
      },
      onOpen: (secId, rowId, direction) => {
        this.setState({
          activeRowKey: index
        })

      },
      right: [
        {
          onPress: () => {
            const deletingRow = this.state.activeRowKey;
            Alert.alert(
              'Alert',
              'Tem certeza que você quer deletar este personagem?',
              [
                { text: 'Não', onPress: () => {}, style: 'cancel' },
                {
                  text: 'Sim', onPress: () => {
                    var id = this.state.FlatListItems[index].ID_PERSONAGEM;
                    var arr = this.state.FlatListItems.filter(function(item) {
                      return item.ID_PERSONAGEM!== id
                    })
                    this.setState({
                      FlatListItems: arr
                    })
                    this.forceUpdate();
                    this.deleteItemById(id);

                  }
                }
              ]
            )
          },
          text: 'Excluir', type: 'delete'
        },
      ],
      rowId: index,
      sectionId: 1,
    }
    return (
      <Swipeout {...swipeSettings}>
        <View style={styles.ViewCard}>
          <Card style={styles.Card} onPress={() => this.telaItem(item)}>
            <Card.Content>
              <View style={styles.ViewCardContent}>
                <Title style={styles.TituloCard}>{item.NOME}</Title>
                <Paragraph style={styles.DataCard}>{item.CLASSE}</Paragraph>
              </View>
            </Card.Content>
          </Card>
        </View>
      </Swipeout>

    )
  }


  render() {
    return (


      <ScrollView>
      <View style={{ alignItems: 'center', height: 50, marginBottom: 20, marginTop: '10%' }}>
        <Text style={{ marginTop: 10, fontSize: 17 }} >Personagens</Text>
      </View>
      <View style={styles.viewFlatList}>
        <NavigationEvents
          onWillFocus={payload => this.componentDidMount()}
          onDidFocus={payload => this.componentDidMount()}
          onWillBlur={payload => this.componentDidMount()}
          onDidBlur={payload => this.componentDidMount()}
        />
       
          <FlatList
            data={this.state.FlatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderItem}
            style={{ marginBottom: '20%' }}
          />
      
      </View>
    </ScrollView>



    );
  }
}

