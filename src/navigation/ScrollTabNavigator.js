import React from 'react';
import { Text, View, ScrollView, } from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import VoyageScreen from '../screens/VoyageScreen';
import PortListView from '../screens/PortListView';

import BunkerScreen from '../screens/BunkerScreen';
import FreightScreen from '../screens/FreightScreen';
import ResultScreen from '../screens/ResultScreen';

import PortList from '../screens/PortListView';
import Colors from '../../resource/Colors';

const ScrollTabNavigator = ({ navigation }) => {
    return (
        <ScrollableTabView
            style={{height:20}}
            tabBarUnderlineStyle={{ backgroundColor: Colors.base_color, height: 2 }}
            tabBarBackgroundColor={Colors.white}
            tabBarActiveTextColor={Colors.base_color}
            tabBarInactiveTextColor={Colors.black}
            tabBarTextStyle={{ fontSize: 16 }}>
            <VoyageScreen tabLabel="Voyage" />
            <BunkerScreen tabLabel="Bunker" />
            <FreightScreen tabLabel="Freight" />
            <ResultScreen tabLabel="Report" />
        </ScrollableTabView>
    );
}

export default ScrollTabNavigator;