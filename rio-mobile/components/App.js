import 'react-native-globals';
import _ from 'lodash';

//  { init, em, Row, FormGroup, Flex, Container, Column, Text, Bold, H1, H2, H3, H4, H5, H6 };
import elements from 'react-native-common-elements';
_.each(elements, (element, key) => global[key] = element);
import React, {Component, PropTypes} from 'react';
import ION from 'react-native-vector-icons/Ionicons';
global.ION = ION;
import Orientation from 'react-native-orientation';
global.Orientation = Orientation;
import config from './config';
import SideMenu from 'react-native-simple-drawer';

import Game from './Game';
import SendText from './SendText';
import Draw from './Draw';

const App = class extends Component {
    constructor (props, context) {
        super(props, context);
        this.state = { currRoute: 'GAME' };
        //paint pixel app
        var ws = new WebSocket(config.ws);
        ws.onopen = () => {
            this.setState({
                ws,
                isConnected: true,
                showColorPicker: false
            })
        };
        this.routes = {
            GAME: {id: 'GAME', title: 'Game!'},
            DRAW: {id: 'DRAW', title: 'Draw!'},
            TEXT: {id: 'TEXT', title: 'Text!'},
        }
    }

    componentWillMount() {
        StatusBar.setHidden(true);
    }

    renderScene = (route, navigator) => {
        switch (route.id) {
            case "GAME":
                return (
                    <Game ws={this.state.ws} isConnected={this.state.isConnected} />
                );

            case "DRAW":
                return (
                    <Draw ws={this.state.ws} />
                )

            case "TEXT":
                return (
                    <SendText />
                )
        }
    }

    render () {
        const menu = (
            <View style={styles.menu}>
                <Row style={styles.menuItem}>
                    <TouchableOpacity
                        disabled={this.state.currRoute == 'GAME'}
                        onPress={() => {
                            this.setState({currRoute: 'GAME'});
                            this.refs.navigator.replace(this.routes.GAME);
                            this.refs.menu.close();
                        }}>
                        <Text>Game!</Text>
                    </TouchableOpacity>
                </Row>
                <Row style={styles.menuItem}>
                    <TouchableOpacity
                        disabled={this.state.currRoute == 'DRAW'}
                        onPress={() => {
                            this.setState({currRoute: 'DRAW'});
                            this.refs.navigator.replace(this.routes.DRAW);
                            this.refs.menu.close();
                        }}>
                        <Text>Draw!</Text>
                    </TouchableOpacity>
                </Row>
                <Row style={styles.menuItem}>
                    <TouchableOpacity
                        disabled={this.state.currRoute == 'TEXT'}
                        onPress={() => {
                            this.setState({currRoute: 'TEXT'});
                            this.refs.navigator.replace(this.routes.TEXT);
                            this.refs.menu.close();
                        }}>
                        <Text>Text!</Text>
                    </TouchableOpacity>
                </Row>
            </View>
        )
        return (
            <SideMenu
                ref="menu"
                menu={menu}
                width={100}>
                <Navigator
                    initialRoute={{ title: 'Game!', id: 'GAME'}}
                    renderScene={this.renderScene}
                    ref="navigator"
                />
            </SideMenu>
        )
    }
};

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        backgroundColor:'#f1f1f1'
    },
    menuItem: {
        padding: 20,
        alignSelf: 'stretch'
    }
})

module.exports = App;
