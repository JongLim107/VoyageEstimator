'use strict';

import React from 'react';
import {StackNavigator} from 'react-navigation';
import {Image, TouchableOpacity} from "react-native";
import MainExample from "../MainExample";
import {AlphabeticSelectionList, SelectionList} from "../../index";

const baseColor = "#0081CC";

const RootStack = StackNavigator(
    {
        exampleMain: {
            screen: MainExample,
            navigationOptions: {
                headerTitle: 'Main Example',
            }
        },
        selectionList: {
            screen: SelectionList,
        },
        alphabeticSelectionList: {
            screen: AlphabeticSelectionList,
        },
    },
    {
        navigationOptions: ({navigation}) => ({
            // headerTintColor: Color.white,
            headerStyle: {
                backgroundColor: baseColor,
            },
            headerLeft: (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Image style={{
                        width: 19,
                        height: 19,
                        alignSelf: "center",
                        margin: 10,
                    }}
                           source={require("../../resource/images/back.png")}
                    />
                </TouchableOpacity>
            ),
            headerTitleStyle: {
                color: "white",
            },
        }),
    },
);

export default RootStack;
