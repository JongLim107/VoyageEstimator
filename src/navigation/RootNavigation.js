import React from 'react';
import { Image } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { SelectionList } from "bmo-mobile-components";
import Styles from '../../resource/Styles';
import Colors from '../../resource/Colors';

import VoyageScreen from '../screens/VoyageScreen';
import PortListView from '../screens/PortListView';

import BunkerScreen from '../screens/BunkerScreen';
import FreightScreen from '../screens/FreightScreen';
import ResultScreen from '../screens/ResultScreen';

const showIcon = true;

const RootNavigator = TabNavigator(
    {
        Voyage: {
            screen: VoyageScreen,
            navigationOptions: {
                tabBarLabel: 'Voyage',
                tabBarIcon: ({ focused, tintColor }) => {
                    if (focused) {
                        return <Image
                            style={[Styles.tbIconStyle, { tintColor: Colors.tintColor }]}
                            source={require('../../resource/images/voyage.png')} />;
                    } else {
                        return <Image
                            style={Styles.tbIconStyle}
                            source={require('../../resource/images/voyage.png')} />;
                    }
                },
            }
        },
        Bunker: {
            screen: BunkerScreen,
            navigationOptions: {
                tabBarLabel: 'Bunker',
                tabBarIcon: ({ focused, tintColor }) => {
                    if (focused) {
                        return <Image
                            style={[Styles.tbIconStyle, { tintColor: Colors.tintColor }]}
                            source={require('../../resource/images/bunker.png')} />;
                    } else {
                        return <Image
                            style={Styles.tbIconStyle}
                            source={require('../../resource/images/bunker.png')} />;
                    }
                },
            }
        },
        Freight: {
            screen: FreightScreen,
            navigationOptions: {
                tabBarLabel: 'Freight',
                tabBarIcon: ({ focused, tintColor }) => {
                    if (focused) {
                        return <Image
                            style={[Styles.tbIconStyle, { tintColor: Colors.tintColor }]}
                            source={require('../../resource/images/dollar.png')} />;
                    } else {
                        return <Image
                            style={Styles.tbIconStyle}
                            source={require('../../resource/images/dollar.png')} />;
                    }
                },
            }
        },
        Report: {
            screen: ResultScreen,
            navigationOptions: {
                tabBarLabel: 'Report',
                tabBarIcon: ({ focused, tintColor }) => {
                    if (focused) {
                        return <Image
                            style={[Styles.tbIconStyle, { tintColor: Colors.tintColor }]}
                            source={require('../../resource/images/wallet.png')} />;
                    } else {
                        return <Image
                            style={Styles.tbIconStyle}
                            source={require('../../resource/images/wallet.png')} />;
                    }
                },
            }
        }
    },
    {
        ...TabNavigator.Presets.AndroidTopTabs,
        tabBarOptions: {
            activeTintColor: Colors.base_color,
            inactiveTintColor: Colors.text_black,
            upperCaseLabel: false,
            showIcon: showIcon,
            style: {
                backgroundColor: Colors.white
            },
            labelStyle: {
                fontSize: showIcon ? 11 : 16,
                marginTop: 0,
                marginBottom: 0,
            },
            indicatorStyle: {
                backgroundColor: Colors.base_color,
            },
        },
        tabBarPosition: 'top',
    }
);

export default RootStackNavigator = StackNavigator(
    {
        mainNav: {
            // if want to use new scroolTabView replace the below screen to 'ScrollTabNavigator'
            screen: RootNavigator,
            // screen: ScrollTabNavigator
        },
        portListNav: {
            screen: PortListView,
        },
        selectionList: {
            screen: SelectionList,
        }
    },
    {
        navigationOptions: {
            title: 'Voyage Estimator',
            headerTintColor: Colors.white,
            headerStyle: { backgroundColor: Colors.base_color },
            headerTitleStyle: { flex: 1, textAlign: 'center' },
        }
    }
);
