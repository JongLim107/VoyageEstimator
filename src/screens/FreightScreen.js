import React from 'react';
import { Keyboard, Image, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { observer } from 'mobx-react';

import Colors from '../../resource/Colors';
import FormInput from '../components/FormInput';
import WaitingDialog from '../components/WaitingDialog';

import { CheckFloat, CheckInt } from '../utility/ValueChecker';
import { TceParams, TceEroArray, TceHasError } from '../stores/TceParams';
import { TceReport, TceCalculate } from '../stores/TceReport';
import PortList from '../stores/PortListStore';
import MyAxios from '../network/APIManager';

let JLLog = (msg) => {
	if (typeof str == 'string') {
		console.log(`>> FreightScreen.js << ${msg}`);
	} else {
		console.log(`>> FreightScreen.js << ${JSON.stringify(msg)}`);
	}
}

class FreightScreen extends React.Component {

	constructor(props) {
		super(props)
		this.isKbShow = false;
	}

	componentWillMount() {
		this.props.navigation.addListener('willFocus', () => {
			// JLLog(' ---- willFocus ----');
			this.onHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
			this.onShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
			TceCalculate();
		});

		this.props.navigation.addListener('didBlur', () => {
			// JLLog(' ---- didBlur ----');
			this.onHideListener.remove();
			this.onShowListener.remove();
			Keyboard.dismiss();
		});
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<KeyboardAwareScrollView
					style={styles.container}
					keyboardShouldPersistTaps={'handled'}>
					{this.PortChargeLayout()}
					{this.OtherCostLayout()}
					{this.FreightLayout()}
					{this.ResultLayout()}
				</KeyboardAwareScrollView >
				<WaitingDialog ref={(c) => this.wdlg = c} />
			</View>
		);
	}

	/** API Calling function */
	onKeyboardDidHide = (value) => {
		TceCalculate();
		
		if (this.isKbShow && this.wdlg && !TceHasError()) {
			this.isKbShow = false;
			MyAxios.GetTceData(TceParams, this.wdlg);
		}
	}

	onKeyboardDidShow = (value) => {
		this.isKbShow = true;
	}

	PortChargeLayout = () => {
		return (
			<View style={[styles.itemContainer, { marginTop: 16 }]}>
				<Text style={styles.itemTitle}>——· Port Charge ·——</Text>

				{function () {
					if (PortList.Ports.length == 0) {
						return <Text style={{ alignItems: 'center', padding: 10, color: 'red' }}>
							{'You have to add Port info.'}
						</Text>
					} else {
						return <View style={{ position: 'relative', flex: 1, flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
							{/* Number of port */}
							<View style={{ alignItems: 'center', marginBottom: 10, marginTop: 12 }}>
								{MapPortNumViews()}
							</View>

							{/* Port name column */}
							<View style={{ flexGrow: 1, maxWidth: 160, paddingLeft: 10, justifyContent: 'space-around' }}>
								{MapPortNameViews(true)}
							</View>

							{/* Port price column */}
							<View style={{ flex: 1, minWidth: 80, paddingLeft: 10, justifyContent: 'space-around' }}>
								{MapPortPriceViews()}
							</View>

							{/* price unit column */}
							<View style={{ paddingLeft: 10, justifyContent: 'space-around' }}>
								{MapPortNameViews(false)}
							</View>
						</View>
					}
				}()}
			</View >
		)
	}

	OtherCostLayout = () => {
		return (
			< View style={styles.itemContainer} >
				<Text style={styles.itemTitle}>——· Other Related Cost ·——</Text>
				<View style={{ flexDirection: 'row' }}>
					<FormInput
						style={{ flex: 1 }}
						label={"Other Cost (USD)"}
						labelStyle={styles.labelStyle}
						value={TceParams.OtherCost}
						inputStyle={styles.inputStyle}
						keyboardType='numeric'
						onVerify={(value) => {
							let { errMsg, number } = CheckFloat(value, 9999999);
							TceParams.OtherCost = number;
							TceEroArray.marks[10] = (errMsg != null);
							return errMsg;
						}} />
					<View width={10} />
					<FormInput
						style={{ flex: 1, }}
						label='Commission Rate (%)'
						labelStyle={styles.labelStyle}
						value={TceParams.totalCommissionPer}
						inputStyle={styles.inputStyle}
						keyboardType='numeric'
						onVerify={(value) => {
							let { errMsg, number } = CheckFloat(value, 100, 0, 1);
							TceParams.totalCommissionPer = number;
							TceEroArray.marks[11] = (errMsg != null);
							return errMsg;
						}} />
				</View>
			</View >
		)
	}

	FreightLayout = () => {
		return (
			< View style={styles.itemContainer} >
				<Text style={styles.itemTitle}>——· Freight ·——</Text>
				<View style={{ flexDirection: 'row' }}>
					<FormInput
						style={{ flex: 0.8 }}
						label={"Quantity"}
						labelStyle={styles.labelStyle}
						value={TceParams.CargoQty}
						inputStyle={styles.inputStyle}
						keyboardType='numeric'
						onVerify={(value) => {
							let { errMsg, number } = CheckInt(value, 9999999, 1);
							TceParams.CargoQty = number;
							TceEroArray.marks[12] = (errMsg != null);
							return errMsg;
						}} />
					<FormInput
						style={{ flex: 0.7, paddingLeft: 10 }}
						label={"Per Unit (USD)"}
						labelStyle={styles.labelStyle}
						inputStyle={styles.inputStyle}
						value={TceParams.perUnit}
						keyboardType='numeric'
						onVerify={(value) => {
							let { errMsg, number } = CheckFloat(value, 99999999, 0.01);
							TceParams.perUnit = number;
							TceEroArray.marks[13] = (errMsg != null);
							return errMsg;
						}} />
				</View>
			</View >
		)
	}

	ResultLayout = () => {
		return (
			< View style={{ flexShrink: 1, flexDirection: 'row', marginTop: 15, padding: 16, backgroundColor: '#fff' }}>
				<View style={{ flex: 1 }}>
					<Text style={styles.resultLabel} ellipsizeMode='tail' numberOfLines={1}>Freight (USD)</Text>
					<Text style={styles.resultValue} ellipsizeMode='tail' numberOfLines={1}>$ {TceReport.TotalFreight}</Text>
				</View>
				<View width={8} />
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Text style={styles.resultLabel} ellipsizeMode='tail' numberOfLines={1}>Total Cost (USD)</Text>
					{/* <Text style={styles.resultValue}>$ {0}</Text> */}
					<Text style={styles.resultValue} ellipsizeMode='tail' numberOfLines={1}>$ {TceReport.TotalOtherCost}</Text>
				</View>
				<View width={8} />
				<View style={{ flex: 1, alignItems: 'flex-end' }}>
					<Text style={styles.resultLabel} ellipsizeMode='tail' numberOfLines={1}>Profit (USD)</Text>
					<Text style={styles.resultValue} ellipsizeMode='tail' numberOfLines={1}>$ {TceReport.TotalProfitLoss}</Text>
				</View>
			</View >
		)
	}

}

const MapPortNumViews = () => {
	if (PortList.Ports.length > 0) {
		return PortList.Ports.map((data, index) => {
			if (index == 0) {
				return (
					<View style={styles.floatIcon} >
						<Text style={styles.floatText}>{`${index + 1}`}</Text>
					</View>
				)
			} else {
				return (
					<View style={{ flex: 1, alignItems: 'center' }}>
						<View style={styles.floatLine} />

						<View style={styles.floatIcon} >
							<Text style={styles.floatText}>{`${index + 1}`}</Text>
						</View>
					</View>
				)
			}
		});
	} else {
		return null;
	}
}

const MapPortNameViews = (isName) => {
	if (PortList.Ports.length > 0) {
		return PortList.Ports.map((data, index) => {
			if (isName) {
				return <Text ellipsizeMode='tail' numberOfLines={1}>{data.Port}</Text>
			} else {
				return <Text style={{ color: '#AAA' }}>USD</Text>
			}
		});
	} else {
		return null;
	}
}

const MapPortPriceViews = () => {
	if (PortList.Ports.length > 0) {
		return PortList.Ports.map((data, index) => {
			return (
				<FormInput
					value={data.PortCharges.toString()}
					style={{ paddingBottom: 6, paddingTop: 6 }}
					inputStyle={styles.inputStyle}
					keyboardType='numeric'
					onVerify={(value) => {
						let { errMsg, number } = CheckInt(value, 9999999, 0);
						data.PortCharges = number.length == 0 ? 0 : number;
						data.chFalse = (errMsg != null);
						return errMsg;
					}}
				/>
			)
		});
	} else {
		return null;
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#EEE',
	},
	itemContainer: {
		flex: 1,
		marginTop: 15,
		marginLeft: 10,
		marginRight: 10,
		paddingTop: Platform.OS === 'ios' ? 20 : 10,
		paddingLeft: 12,
		paddingRight: 12,
		paddingBottom: 15,
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 5,
	},
	itemTitle: {
		flex: 1,
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 8,
		color: '#49F',
	},
	labelStyle: {
		fontSize: 12,
		color: '#AAA',
		marginBottom: 2,
	},
	inputStyle: {
		paddingLeft: 4,
		paddingRight: 4,
		paddingVertical: 2,
	},
	floatIcon: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#49F',
		alignItems: 'center',
	},
	floatLine: {
		flex: 1,
		width: 2,
		backgroundColor: '#49F',
	},
	floatText: {
		paddingTop: 2,
		fontWeight: 'bold',
		color: 'white',
	},
	portItemHeigth: {
		height: 40,
		alignContent: 'center'
	},
	resultLabel: {
		fontSize: 13,
		color: '#888',
	},
	resultValue: {
		paddingTop: 5,
		fontSize: 15,
		color: '#49F',
	},
});

export default observer(FreightScreen);