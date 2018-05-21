import React from 'react';
import { Image, Keyboard, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Picker } from 'antd-mobile';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FormInput from '../components/FormInput';
import WaitingDialog from '../components/WaitingDialog';

import { TceParams, TcePicker, TceOnSelectBunker, TceEroArray, TceHasError } from '../stores/TceParams';
import { TceReport, TceCalculate, TceDays } from '../stores/TceReport';
import { CheckLength, CheckFloat, CheckInt } from '../utility/ValueChecker';
import PortList from '../stores/PortListStore';
import MyAxios from '../network/APIManager';

let JLLog = (msg) => {
	if (typeof str == 'string') {
		console.log(`>> BunkerScreen.js << ${msg}`);
	} else {
		console.log(`>> BunkerScreen.js << ${JSON.stringify(msg)}`);
	}
}

class BunkerScreen extends React.Component {

	constructor(props) {
		super(props)
		this.isKbShow = false;
	}

	componentWillMount() {	
		this.props.navigation.addListener('willFocus', () => {
			// JLLog(' ---- willFocus ----');
			this.onKbHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
			this.onKbShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
			TceCalculate();
		});

		this.props.navigation.addListener('didBlur', () => {
			// JLLog(' ---- didBlur ----');
			this.onKbHideListener.remove();
			this.onKbShowListener.remove();
			Keyboard.dismiss();
		});
	}

	componentDidMount() {
		// If the first time call api faild. need to recall.
		if (this.wdlg && TcePicker.bkList.length == 0) {
			MyAxios.GetTceBunker(this.wdlg);
		}	
	}

	/**
	 * Refresh and 
	 * API Calling function 
	 */
	onKeyboardDidHide = (value) => {
		TceCalculate();

		//Noted: If move this function outside this class,
		// 		 Can not get the handle of waitDialog anymore after dismiss.	
		if (this.isKbShow && !TceHasError()) {
			MyAxios.GetTceData(TceParams, this.wdlg);
		}

		this.isKbShow = false;
	}

	onKeyboardDidShow = (value) => {
		this.isKbShow = true;
	}

	renderVesselLayout = () => {
		return (
			<View style={[styles.itemContainer, { marginTop: 3 }]}>
				<View style={[styles.bodyContainer, { flexDirection: 'row' }]}>
					<FormInput
						style={{ flex: 1, }}
						label='Vessel Name'
						labelStyle={styles.labelStyle}
						value={TceParams.VesselName}
						inputStyle={styles.inputStyle}
						onVerify={(value) => {
							TceParams.VesselName = value;
							return CheckLength(value, 60);
						}} />

					<View width={10} />

					<FormInput
						style={{ flex: 1, }}
						label={"Daily Hire Cost (USD)"}
						labelStyle={styles.labelStyle}
						value={TceParams.DailyHireRate}
						inputStyle={styles.inputStyle}
						keyboardType={"numeric"}
						onVerify={(value) => {
							let { errMsg, number } = CheckInt(value, 9999999, 0, false);
							TceParams.DailyHireRate = number;
							TceEroArray.marks[0] = (errMsg != null);
							return errMsg;
						}} />
				</View>
				<View style={[styles.iconContainer, { left: 20 }]}>
					<Image style={styles.floatIcon} source={require('../../resource/images/vessel.png')} />
				</View>
			</View>
		)
	}

	renderBunkerLayout = () => {
		return (
			<View style={styles.itemContainer}>
				<View style={[styles.bodyContainer, { paddingTop: 8 }]}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ fontSize: 16, color: '#5AF' }}>FO</Text>
						<Text style={{ fontSize: 12, color: 'grey' }}> MT/Day</Text>
					</View>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<FormInput
							style={{ flex: 1 }}
							label={"Ballast"}
							labelStyle={styles.labelStyle}
							value={TceParams.Ballast}
							inputStyle={styles.inputStyle}
							keyboardType={"numeric"}
							onVerify={(value) => {
								let { errMsg, number } = CheckFloat(value, 999, 0, 1, false);
								TceParams.Ballast = number;
								TceEroArray.marks[1] = (errMsg != null);
								return errMsg;
							}} />
						<View width={10} />
						<FormInput
							style={{ flex: 1, }}
							label={"Laden"}
							labelStyle={styles.labelStyle}
							value={TceParams.Laden}
							inputStyle={styles.inputStyle}
							keyboardType={"numeric"}
							onVerify={(value) => {
								let { errMsg, number } = CheckFloat(value, 999, 0, 1, false);
								TceParams.Laden = number;
								TceEroArray.marks[2] = (errMsg != null);
								return errMsg;
							}} />
						<View width={10} />
						<FormInput
							style={{ flex: 1, }}
							label={"Work"}
							labelStyle={styles.labelStyle}
							value={TceParams.fWork}
							inputStyle={styles.inputStyle}
							keyboardType={"numeric"}
							onVerify={(value) => {
								let { errMsg, number } = CheckFloat(value, 999, 0, 1, false);
								TceParams.fWork = number;
								TceEroArray.marks[3] = (errMsg != null);
								return errMsg;
							}} />
						<View width={10} />
						<FormInput
							style={{ flex: 1, }}
							label={"Idle"}
							labelStyle={styles.labelStyle}
							value={TceParams.fIdle}
							inputStyle={styles.inputStyle}
							keyboardType={"numeric"}
							onVerify={(value) => {
								let { errMsg, number } = CheckFloat(value, 999, 0, 1, true);
								TceParams.fIdle = number;
								TceEroArray.marks[4] = (errMsg != null);
								return errMsg;
							}} />
					</View>

					<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8 }}>
						<Text style={{ fontSize: 16, color: '#5AF' }}>DO</Text>
						<Text style={{ fontSize: 12, color: 'grey' }}> MT/Day</Text>
					</View>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<FormInput
							style={{ flex: 1, }}
							label={'At Sea'}
							labelStyle={styles.labelStyle}
							value={TceParams.AtSea}
							inputStyle={styles.inputStyle}
							keyboardType={"numeric"}
							onVerify={(value) => {
								let { errMsg, number } = CheckFloat(value, 999, 0, 1, false);
								TceParams.AtSea = number;
								TceEroArray.marks[5] = (errMsg != null);
								return errMsg;
							}} />
						<View width={10} />
						<FormInput
							style={{ flex: 1, }}
							label={"Work"}
							labelStyle={styles.labelStyle}
							value={TceParams.dWork}
							inputStyle={styles.inputStyle}
							keyboardType={"numeric"}
							onVerify={(value) => {
								let { errMsg, number } = CheckFloat(value, 999, 0, 1, false);
								TceParams.dWork = number;
								TceEroArray.marks[6] = (errMsg != null);
								return errMsg;
							}} />
						<View width={10} />
						<FormInput
							style={{ flex: 1, }}
							label={"Idle"}
							labelStyle={styles.labelStyle}
							value={TceParams.dIdle}
							inputStyle={styles.inputStyle}
							keyboardType={"numeric"}
							onVerify={(value) => {
								let { errMsg, number } = CheckFloat(value, 999, 0, 1, true);
								TceParams.dIdle = number;
								TceEroArray.marks[7] = (errMsg != null);
								return errMsg;
							}} />
						<View style={{ flex: 1 }} />
					</View>
				</View>

				<View style={[styles.iconContainer, { right: 20 }]}>
					<Image style={styles.floatIcon} source={require('../../resource/images/petrol.png')} />
				</View>
			</View>
		)
	}

	renderOilPriceLayout = () => {
		return (
			<View style={styles.itemContainer}>
				<View style={styles.bodyContainer}>
					<View style={{ marginBottom: 10 }} >
						<Picker
							data={TcePicker.bkList}
							cols={3}
							triggerType={"onPress"}
							style={{ fontSize: 18, fontWeight: "normal" }}
							itemStyle={{ fontSize: 18, fontWeight: "normal", marginTop: 5, marginBottom: 5 }}
							okText='OK'
							dismissText='Cancel'
							title='Bunker Price'
							value={TcePicker.selected}
							onChange={(value) => {
								TceOnSelectBunker(value);
								TceEroArray.marks[8] = false;
								TceEroArray.marks[9] = false;
								this.foPprice.error = null;
								this.doPprice.error = null;
								this.isKbShow = true;
								this.onKeyboardDidHide();
							}}>
							<FormInput
								type='press'
								label={"Bunker Port"}
								layoutDirection='row'
								labelStyle={[styles.labelStyle, { fontSize: 14, color: '#555' }]}
								icon={require("../../resource/images/next.png")}
								iconStyle={{ transform: [{ rotate: "90deg" }] }}
								value={TcePicker.bkPort}
								hint={'Select port'}
								inputStyle={styles.inputStyle} />
						</Picker>
					</View>
					{/* <View style={{ width: 1, height: 70, backgroundColor: '#CCC', marginLeft: 8, marginRight: 8 }} /> */}

					<View style={{ flex: 1, flexDirection: 'row' }}>

						<View style={{ flex: 1 }}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ fontSize: 14, color: '#5C4' }}>FO </Text>
								<Text style={{ fontSize: 14, color: '#333', marginRight: 6 }}>{TcePicker.bkFOLabel}</Text>
							</View>

							<FormInput
								style={{ flex: 1 }}
								ref={c => this.foPprice = c}
								value={TceParams.FOUnitPrice}
								inputStyle={styles.inputStyle}
								onChange={this.onNumberChange}
								onVerify={(value) => {
									let { errMsg, number } = CheckFloat(value, 9999, 0.01);
									TceParams.FOUnitPrice = number;
									TceEroArray.marks[8] = (errMsg != null);
									return errMsg;
								}}
								keyboardType='numeric' />
						</View>

						<View width={12} />

						<View style={{ flex: 1 }}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ fontSize: 14, color: '#5C4' }}>DO </Text>
								<Text style={{ fontSize: 14, color: '#333', marginRight: 6 }}>MGO</Text>
							</View>

							<FormInput
								style={{ flex: 1 }}
								ref={c => this.doPprice = c}
								value={TceParams.DOUnitPrice}
								inputStyle={styles.inputStyle}
								onVerify={(value) => {
									let { errMsg, number } = CheckFloat(value, 9999, 0.01);
									TceParams.DOUnitPrice = number;
									TceEroArray.marks[9] = (errMsg != null);
									return errMsg;
								}}
								keyboardType='numeric' />
						</View>

					</View>
				</View>

				<View style={[styles.iconContainer, { left: 20 }]}>
					<Image style={styles.floatIcon} source={require('../../resource/images/currency.png')} />
				</View>
			</View>
		)
	}

	renderCalendarLayout = () => {
		return (
			<View style={styles.itemContainer}>
				<View style={styles.bodyContainer}>
					<View style={{ flex: 1, flexDirection: 'row' }}>

						<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
							<Text style={styles.labelStyle}>Ballast(day)</Text>
							<Text style={[styles.resultValue, { color: '#000' }]}>{TceDays.Ballast}</Text>
						</View>

						<View width={10} />

						<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
							<Text style={styles.labelStyle}>Laden(day)</Text>
							<Text style={[styles.resultValue, { color: '#000' }]}>{TceDays.Laden}</Text>
						</View>

						<View width={10} />

						<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
							<Text style={styles.labelStyle}>Work(day)</Text>
							<Text style={[styles.resultValue, { color: '#000' }]}>{TceDays.Work}</Text>
						</View>

						<View width={10} />

						<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
							<Text style={styles.labelStyle}>Idle(day)</Text>
							<Text style={[styles.resultValue, { color: '#000' }]}>{TceDays.Idle}</Text>
						</View>
					</View>

				</View>

				<View style={[styles.iconContainer, { right: 20 }]}>
					<Image style={styles.floatIcon} source={require('../../resource/images/calendar.png')} />
				</View>
			</View>
		)
	}

	renderResultLayout = () => {
		return (
			<View style={{ marginTop: 20, padding: 20, backgroundColor: '#fff' }}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
						<Text style={styles.resultLabel}>Total Bunker Cost (USD)</Text>
						<Text style={{ paddingTop: 5, fontSize: 15, color: '#49F' }}>$ {TceReport.BunkerCost}</Text>
					</View>
					<View width={10} />
					<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
						<Text style={styles.resultLabel}>Charterer Hire Cost (USD)</Text>
						<Text style={{ paddingTop: 5, fontSize: 15, color: '#49F' }}>$ {TceReport.CharterHireCost}</Text>
					</View>
				</View>
			</View>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<KeyboardAwareScrollView
					ref={(view) => { this.scrollView = view; }}
					style={[{ flex: 1, alignSelf: 'stretch' }]}
					keyboardShouldPersistTaps={'handled'}
					automaticallyAdjustContentInsets={true}
					//onLayout={(e) => { var { x, y, width, height } = e.nativeEvent.layout; JLLog(height); }}
					scrollEventThrottle={200}>
					{this.renderVesselLayout()}
					{this.renderBunkerLayout()}
					{this.renderOilPriceLayout()}
					{this.renderCalendarLayout()}
					{this.renderResultLayout()}
				</KeyboardAwareScrollView>
				<WaitingDialog ref={(c) => this.wdlg = c} />
			</View >
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EEE',
	},
	itemContainer: {
		flex: 1,
		marginTop: 2,
		marginLeft: 10,
		marginRight: 10,
	},
	iconContainer: {
		position: 'absolute',
	},
	bodyContainer: {
		// position: 'absolute',
		flex: 1,
		marginTop: 18,
		paddingTop: 20,
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 12,
		borderRadius: 5,
		backgroundColor: '#fff',
	},
	floatIcon: {
		width: 40,
		height: 40,
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

export default observer(BunkerScreen);