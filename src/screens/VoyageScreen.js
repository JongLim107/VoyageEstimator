import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { observer } from 'mobx-react';
import SlidingUpPanel from "rn-sliding-up-panel";

import Colors from '../../resource/Colors';
import GeoJSONExample from "../stores/example.json";
import MapboxComponent from "../components/MapboxComponent";
import PortList, { PortSource } from '../stores/PortListStore';
import MyAxios from '../network/APIManager';
import {MyFormatting} from "../utility/ValueChecker";

let JLLog = (msg) => {
    if (typeof str == 'string') {
        console.log(`>> VoyageScreen.js << ${msg}`);
    } else {
        console.log(`>> VoyageScreen.js << ${JSON.stringify(msg)}`);
    }
}

const { height } = Dimensions.get("window");

const btnHeight = 80; // previously iOS 100
const dragTop = Platform.OS === 'android' ? height / 1.4 : height / 1.05;
const dragBottom = Platform.OS === 'android' ? 200 : 240;
const flatListHeight = Platform.OS === 'android' ? (dragTop - dragBottom - 15) : (dragTop - 200);

JLLog('height = ' + height + ', dragTop = ' + dragTop + ', dragBottom = ' + dragBottom + ', flatListHeight = ' + flatListHeight)

let axios = require("axios");

@observer
class VoyageScreen extends React.Component {

    annotationPoints = [];
    static defaultProps = {
        draggRange: { top: dragTop, bottom: dragBottom }
    };

    constructor(props) {
        super(props);
        this.navigation = this.props.navigation;

        this.state = {
            isSlid2Top: true,
            routingPoints: { "type": "LineString", "coordinates": [[0, 0]] },
            totalDistance: "",
            totalDays: 0
        };
    }

    componentWillMount() {
        this.navigation.addListener('willFocus', () => {
            this.annotationPoints = []
            this.annotationPoints = PortList.Ports.map((item) => { return [item.Location[1], item.Location[0]] });
            let addedPorts = PortList.Ports.map((item) => { return item.name });

            let test = [[0, 0]];

            if (PortList.Ports.length < 2) {
                this.setState({
                    routingPoints: { "type": "LineString", "coordinates": test }
                });
            } else {
                MyAxios.GetDistance(addedPorts)
                    .then((response) => {
                        // JLLog({response});
                        test = response.data['Waypoints']
                        let Legs = response.data.Legs;
                        let TotalVoyageDays = 0;
                        let PortDays = 0;

                        PortList.Ports.map(function (item, index) {
                            PortDays = PortDays + parseFloat(item.PortDaysIdle) + parseFloat(item.PortDaysWork);
                        })

                        Legs.map(function (item, index) {
                            let dis = item.Distance.toFixed(2);
                            PortList.Ports[index].Distance = dis;
                            let speed = PortList.Ports[index].Speed;
                            PortList.Ports[index].calTravelDay(dis, speed);
                            TotalVoyageDays = TotalVoyageDays + PortList.Ports[index].VoyageDays;
                        })

                        TotalVoyageDays = TotalVoyageDays + PortDays;
                        let tempTotalDistance  =  response.data['TotalDistance'];
                        tempTotalDistance = (tempTotalDistance && !isNaN(tempTotalDistance)) ? MyFormatting(tempTotalDistance, 2) : '0';

                        this.setState({
                            routingPoints: { "type": "LineString", "coordinates": test },
                            totalDistance: tempTotalDistance,//response.data['TotalDistance'].toFixed(2),
                            totalDays: TotalVoyageDays.toFixed(1)
                        });
                    }).catch((error) => {

                    PortList.Ports.map(function (item, index) {
                        PortList.Ports[index].Distance = 0;
                        PortList.Ports[index].VoyageDays = 0;
                    })

                    this.setState({
                        routingPoints: { "type": "LineString", "coordinates": [[0, 0]] },
                        totalDistance: 0,
                        totalDays: 0
                    });


                    });
            }
        });
    }

    componentDidMount() {
        MyAxios.GetPortList();
    }

    _slidingBtnClick = () => {
        if (this.state.isSlid2Top) {
            this._panel.transitionTo({ toValue: dragBottom })
            this.setState({ isSlid2Top: false })
        } else {
            this._panel.transitionTo({ toValue: dragTop })
            this.setState({ isSlid2Top: true })
        }
    }

    _renderItem = (item, index) => {
        return (
            <View style={{ paddingLeft: 10 }}>
                <View style={{ flexDirection: 'row' }}>

                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <View style={styles.floatIcon}>
                            <Text style={styles.floatText}>{`${index + 1}`}</Text>
                        </View>
                        <View style={styles.floatLine} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={this._goPortList} style={{ margin: 12 }}>
                            <Text style={styles.fontBold}>{item.Port}</Text>
                            <View height={6} />
                            <View style={styles.rowPanel}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.valueStyle}>{item.PortDaysWork + ' Days'}</Text>
                                    <Text style={styles.unitStyle}>{"Port(work)"}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.valueStyle}>{item.PortDaysIdle + ' Days'}</Text>
                                    <Text style={styles.unitStyle}>{"Port(idle)"}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {this._renderDistanceView(item, index)}

                    </View>

                </View>
            </View>
        )
    };

    _renderDistanceView = (item, index) => {

        if (index === PortList.Ports.length - 1) {
            return null
        } else {
            return (
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#F4F4F4', padding: 10, marginRight: 10, marginTop: 8, marginBottom: 8 }}>
                    <Text style={styles.valueStyle}>{item.Distance}</Text>
                    <Text style={styles.unitStyle}>{"NM"}</Text>
                    <View width={5} />
                    <Text style={styles.valueStyle}>{item.VoyageDays.toString()}</Text>
                    <Text style={styles.unitStyle}>{"Days"}</Text>
                    <View width={5} />
                    <Text style={styles.valueStyle}>{item.LegType}</Text>
                    <View width={5} />
                    <Text style={styles.valueStyle}>{parseFloat(item.Speed).toFixed(2)}</Text>
                    <Text style={styles.unitStyle}>{"/h"}</Text>
                </View>
            )
        }

    };

    _renderButton = () => {
        return (
            <TouchableOpacity height={btnHeight} onPress={this._slidingBtnClick}>
                <View height={btnHeight - 10} style={{ paddingLeft: 20, paddingRight: 20, backgroundColor: 'white', justifyContent: 'center' }}>
                    <View style={styles.rowPanel}>
                        <View style={{ flex: 1 }} height={20}>
                            <Text style={styles.unitStyle}>{" Distance"}</Text>
                        </View>

                        <View style={{ flex: 1 }} height={20}>
                            <Text style={styles.unitStyle}>{" Voyage Days"}</Text>
                        </View>
                    </View>
                    <View style={styles.rowPanel}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.textBoldStyle}>{this.state.totalDistance}</Text>
                            <Text style={styles.unitStyle}>{" NM"}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.textBoldStyle}>{this.state.totalDays}</Text>
                            <Text style={styles.unitStyle}>{" Days"}</Text>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', right: 20 }}>
                        <Image style={{ width: 20, height: 20, tintColor: Colors.tintColor }}
                            source={this._renderIcon()} />
                    </View>
                </View>
                <View height={10} style={{ marginLeft: 0, marginRight: 0, backgroundColor: 'transparent' }} />
            </TouchableOpacity>
        )
    }

    _renderIcon = () => {
        JLLog("Is Slliding to Top " + this.state.isSlid2Top);
        if (this.state.isSlid2Top) {
            return require('../../resource/images/darrow_down.png');
        } else {
            return require('../../resource/images/darrow_up.png');
        }
    }

    _renderSlidingUpPanel = () => {
        if (PortList.Ports.length > 1) {
            return (
                <SlidingUpPanel
                    visible={true}
                    ref={c => { this._panel = c }}
                    draggableRange={this.props.draggRange}
                    allowDragging={false}
                    showBackdrop={false}>
                    <View height={flatListHeight + btnHeight} >
                        {this._renderButton()}
                        <FlatList
                            height={flatListHeight}
                            style={{ paddingBottom: 10, backgroundColor: 'white' }}
                            data={PortList.Ports}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => this._renderItem(item, index)} />
                    </View>
                </SlidingUpPanel>
            )
        } else {
            return (
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={[{ margin: 10 }, styles.button]} onPress={this._goPortList}>
                        <Text style={{ color: 'white', fontSize: 14 }}> {"Add Port"} </Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    _goPortList = () => {
        this.navigation.navigate("portListNav");

        // PortList.Ports.push(PortSource[0]);
        // PortList.Ports.push(PortSource[1]);  
        // PortList.Ports.push(PortSource[2]);      
        // PortList.Ports.push(PortSource[1]);  
        // PortList.Ports.push(PortSource[2]);  
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <MapboxComponent featureCollection={this.state.routingPoints} annotation={this.annotationPoints} />

                {this._renderSlidingUpPanel()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    fontBold: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold'
    },
    textBoldStyle: {
        // fontFamily: "Cochin",
        fontSize: 20,
        color: "#2a2a2a",
        fontWeight: "bold",
        marginRight: 3
    },
    valueStyle: {
        // fontFamily: "Cochin",
        fontSize: 13,
        color: "#2a2a2a",
        fontWeight: "bold",
        marginRight: 3
    },
    unitStyle: {
        flex: 1,
        fontSize: 13,
        color: "grey",
    },
    rowPanel: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    floatLine: {
        flex: 1,
        width: 1,
        backgroundColor: '#307ccb',
    },
    floatText: {
        paddingTop: 2,
        fontWeight: 'bold',
        color: 'white',
    },
    floatIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#307ccb',
        alignItems: 'center',
    },
    button: {
        height: 42,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#307ccb",
        borderRadius: 42,
    }
});

export default VoyageScreen;