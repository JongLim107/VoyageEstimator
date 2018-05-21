import React from 'react';
import { Dimensions, Text, Image, View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Picker } from 'antd-mobile';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import MyAxios from '../network/APIManager';
import FormInput from '../components/FormInput';
import WaitingDialog from '../components/WaitingDialog';
import { TceParams, TceHasError } from '../stores/TceParams';
import { TceReport } from '../stores/TceReport';

const { width, height } = Dimensions.get('window');

let wrongNumber = "Input correct number";
let wrongLength = "Name is too long";
let wdlg;

let JLLog = (msg) => {
    if (typeof str == 'string') {
        console.log(`>> ResultScreen.js << ${msg}`);
    } else {
        console.log(`>> ResultScreen.js << ${JSON.stringify(msg)}`);
    }
}

class ResultScreen extends React.Component {
    constructor(props) {
        super(props);
        this.props.navigation.addListener('willFocus', () => {
            if (wdlg && !TceHasError()) {
                MyAxios.GetTceData(TceParams, wdlg);
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView
                    ref={(view) => { this.scrollView = view; }}
                    style={[{ alignSelf: 'stretch' }]}
                    keyboardShouldPersistTaps={'always'}
                    automaticallyAdjustContentInsets={true}
                    scrollEventThrottle={200}>
                    {EstimatorLayout()}
                    {ProfitAndLoss()}
                </ScrollView>
                {RenderOverlayView()}
            </View >
        );
    }
}

const RenderOverlayView = () => {
    if (TceHasError()) {
        wdlg = null;
        return (
            <View style={{ position: 'absolute', width: width, height: height, alignItems: 'center' }} >
                <View style={styles.overlay} />

                <View style={styles.dialog}>
                    <Text style={{ color: 'red', fontSize: 18, textAlign: 'center', lineHeight: 40 }}>
                        {`! ! !\nNeed to fill-up all information in \"Bunker\" and \"Freight\" pages.`}
                    </Text>
                </View>
            </View>
        )
    } else {
        return <WaitingDialog ref={(c) => wdlg = c} />;
    }
}

const EstimatorLayout = () => {
    return (
        <View style={styles.itemContainer}>
            <View style={[styles.bodyContainer, { marginTop: 22 }]}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <View style={{ flex: 1, }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.resultLabel}>Freight (USD)</Text>
                            <Text style={styles.resultValue}>$ {TceReport.TotalFreight}</Text>
                        </View>

                        <View style={[styles.horizontalLine, { margin: 10 }]} />

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.resultLabel}>Total Profit (USD)</Text>
                            <Text style={styles.resultValue}>$ {TceReport.TotalProfitLoss}</Text>
                        </View>
                    </View>

                    <View style={[styles.verticalLine, { margin: 8 }]} />

                    <View style={{ flex: 1, }}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.resultLabel}>Voyage Days</Text>
                            <Text style={styles.resultValue}>{TceReport.TotalVoyageDays}</Text>
                        </View>

                        <View style={[styles.horizontalLine, { margin: 10 }]} />

                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={styles.resultLabel}>Earning Per Days</Text>
                            <Text style={styles.resultValue}>$ {TceReport.NetEarningPerDay}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ position: 'absolute', alignSelf: 'center' }}>
                <Image style={{ width: 40, height: 40 }} source={require('../../resource/images/cost.png')} />
            </View>
        </View>
    )
}

const ProfitAndLoss = () => {
    return (
        <View style={styles.itemContainer}>
            <View style={[styles.bodyContainer, { marginBottom: 10 }]}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.itemTitle}>{'——· Profit & Loss ·——'}</Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, paddingRight: 8, paddingTop: 8 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
                        <Text style={styles.resultLabel}>Freight</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                        <Text style={[styles.resultValue, { paddingTop: 0 }]}>$ {TceReport.TotalFreight}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, paddingRight: 8, paddingTop: 8 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
                        <Text style={styles.resultLabel}>Charter Hire Cost</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                        <Text style={[styles.resultValue, { paddingTop: 0, color: '#888' }]}>$ {TceReport.CharterHireCost}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, paddingRight: 8, paddingTop: 8 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
                        <Text style={styles.resultLabel}>Total Bunker Cost</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                        <Text style={[styles.resultValue, { paddingTop: 0, color: '#888' }]}>$ {TceReport.BunkerCost}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, paddingRight: 8, paddingTop: 8 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
                        <Text style={styles.resultLabel}>Voyage Related Cost</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                        <Text style={[styles.resultValue, { paddingTop: 0, color: '#888' }]}>$ {TceReport.VoyageRelatedCost}</Text>
                    </View>
                </View>


                {/* horizontalLine */}
                <View style={[styles.horizontalLine, { marginTop: 10, marginLeft: 20, marginRight: 20 }]} />

                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, paddingRight: 8, paddingTop: 8 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
                        <Text style={styles.resultLabel}>{'Total Profit & Loss'}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                        <Text style={[styles.resultValue, { paddingTop: 0, }]}>$ {TceReport.TotalProfitLoss}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, paddingRight: 8, paddingTop: 8 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
                        <Text style={styles.resultLabel}>{'Total Voyage Days'}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                        <Text style={[styles.resultValue, { paddingTop: 0, color: '#888' }]}>{TceReport.TotalVoyageDays}</Text>
                    </View>
                </View>

                {/* horizontalLine */}
                <View style={[styles.horizontalLine, { marginTop: 10, marginLeft: 20, marginRight: 20 }]} />

                <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 8, paddingRight: 8, paddingTop: 8 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 20 }}>
                        <Text style={styles.resultLabel}>{'Net Earning Per Day'}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                        <Text style={[styles.resultValue, { paddingTop: 0, }]}>$ {TceReport.NetEarningPerDay}</Text>
                    </View>
                </View>

            </View >
        </View >
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        width: width,
        height: height,
        backgroundColor: 'black',
        opacity: 0.4,
    },
    dialog: {
        position: 'absolute',
        flex: 1,
        margin: 24,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 40,
        paddingBottom: 50,
        backgroundColor: 'white',
        top: Platform.OS === 'ios' ? 160 : 100,
        borderRadius: Platform.OS === 'ios' ? 16 : 8
    },
    container: {
        flex: 1,
        backgroundColor: '#EEE',
    },
    itemContainer: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    bodyContainer: {
        // position: 'absolute',
        flex: 1,
        marginTop: 15,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 12,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    itemTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#49F',
    },
    horizontalLine: {
        height: 1,
        backgroundColor: '#DDD',
    },
    verticalLine: {
        width: 1,
        backgroundColor: '#DDD',
    },
    inputStyle: {
        paddingLeft: 4,
        paddingRight: 4,
        paddingVertical: 2,
    },
    resultLabel: {
        fontSize: 13,
        color: '#888'
    },
    resultValue: {
        paddingTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#49F'
    },
});

export default observer(ResultScreen);