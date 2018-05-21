import React from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet, Platform,Alert } from "react-native";
import {action, computed, observable} from "mobx";
import {observer} from "mobx-react/native";
import {Picker} from 'antd-mobile';

import FormInput from '../components/FormInput';
import WaitingDialog from '../components/WaitingDialog';
import SelectionListStore from '../components/selectionlist/SelectionListObservable';
import { CheckFloat } from '../utility/ValueChecker';

import Colors from '../../resource/Colors';
import PortList, {PortBean, SelectedLegType, SelectedIdleDay,SelectedWorkDay} from '../stores/PortListStore';

let displayPortList = [];

const padding = 16;
const badgeSize = 20;
const badgePaddingRight = 6;

let JLLog = (msg) => {
	console.log(`>> PortListView.js << ${msg}`);
}

const PortListView = ({navigation}) => {

	displayPortList = observable([]);

	const _checkPort = () => {
		if (PortList.Ports.length === 0) {
			// JLLog('Initial PortsList.');
			displayPortList.push(new PortBean({key: '0'}));
			displayPortList.push(new PortBean({key: '1'}));
		} else {
			displayPortList.replace(PortList.Ports);
		}
	};

	_checkPort();

	const _searchWithText = (text) => {
		let filtered = PortList.distancePort.filter((item) => {
			return item.name.toLowerCase().includes(text.toLowerCase()) === true;
		});

		let sorted = filtered.sort((a, b) => {
			return b.name < a.name
				? 1 : b.name > a.name ? -1 : 0;
		});

		SelectionListStore.setDataSource(sorted);
	};

	/**
	 * Press Event cannot be detech.
	 * Found out that this one cause by FormInput component.
	 * Later it will be update by TC. For now, i just use local one.
	 */
	const _renderPortView = observer(({model}) => {
		return (
			<FormInput
				style={{flex: 2, marginRight: 50}}
				type="press"
				label="Port Name"
				labelStyle={styles.labelStyle}
				hint={'Select Port'}
				inputStyle={styles.inputStyle}
				backgroundStyle="line"
				showLine={true}
				value={model.name}
				onPress={() => {
					//SelectionListStore.setDataSource(PortList.distancePort); // must call setDataSource to reset data
                    SelectionListStore.setDataSource([]);
					navigation.navigate('selectionList', {
						textTag: 'name',
						onItemSelected: (distanceItem) => {
							model.Location = [ parseFloat(distanceItem['lat']), parseFloat(distanceItem['lon'])];
							model.setName(distanceItem['name']);
						},
						searchable: true,
						title: 'Search Port',
						textStyle:{fontSize:14},
						searchFunc: (text) => _searchWithText(text),
					});
				}}
				onChangeText={(value) => {
					PortList.setPortName(value, 0);
				}}
			/>
		);
	});

	const _renderPickerView = observer(({model, index}) => {
		return (
			<View style={{
				flex: 1,
				flexDirection: "row",
				padding: 14,
				alignItems: 'stretch',
				backgroundColor: "white",
				paddingLeft: padding + badgeSize + badgePaddingRight,
				paddingRight: padding
			}}>
				<View style={{flex: 1}}>
					<Picker
						style={{flex: 1}}
						data={PortList.Days}
						cols={1}
						triggerType={"onPress"}
						itemStyle={{fontSize: 18, fontWeight: "normal", marginTop: 5, marginBottom: 5}}
						okText='OK'
						dismissText='Cancel'
						title='Work Days'
                        value={SelectedWorkDay.item}
						onChange={(value) => {
							if (value) {
                                SelectedWorkDay.item = value;
								model.setWorkDay(value[0]);
							}
						}}>
						<FormInput
							label="Port (Work Days)"
							labelStyle={styles.labelStyle}
							inputStyle={styles.inputStyle}
							showLine={true}
							type="press"
							backgroundStyle="line"
							style={{flex: 1}}
                            layoutDirection="column"
							icon={require("../../resource/images/next.png")}
							iconStyle={{transform: [{rotate: "90deg"}]}}
							value={`${model.PortDaysWork}`}
						/>
					</Picker>
				</View>

				<View width={20}/>
				<View style={{flex: 1}}>
					<Picker
						style={{flex: 1}}
						data={PortList.Days}
						cols={1}
						triggerType={"onPress"}
						itemStyle={{fontSize: 18, fontWeight: "normal", marginTop: 5, marginBottom: 5}}
						okText='OK'
						dismissText='Cancel'
						title='Idle days'
                        value={SelectedIdleDay.item}
						onChange={(value) => {
							if (value) {
                                SelectedIdleDay.item = value;
								model.setIdleDay(value.toLocaleString());
							}
						}}>
						<FormInput
							label="Port (Idle Days)"
							labelStyle={styles.labelStyle}
							inputStyle={styles.inputStyle}
							showLine={true}
							type="press"
							backgroundStyle="line"
							style={{flex: 1}}
                            layoutDirection="column"
							icon={require("../../resource/images/next.png")}
							iconStyle={{transform: [{rotate: "90deg"}]}}
							value={`${model.PortDaysIdle}`}
						/>
					</Picker>
				</View>
			</View>);
	});

	const _renderBottomView = observer(({model, index}) => {
		if (index === displayPortList.length - 1) {
			return null;
		} else {

			return (
				<View style={{
					flex: 1,
					flexDirection: "row",
					padding: 20,
					alignItems: 'stretch',
					backgroundColor: "#F9F9F9"
				}}>
					<View style={{flex: 1}}>
						<Picker
							style={{flex: 1}}
							data={PortList.PickerLegType}
							cols={1}
							triggerType={"onPress"}
							itemStyle={{fontSize: 18, fontWeight: "normal", marginTop: 5, marginBottom: 5}}
							okText='OK'
							dismissText='Cancel'
							title='Leg Type'
							value={SelectedLegType.item}
							onChange={(value) => {
								if (value) {
									SelectedLegType.item = value;
									model.setLegType(value.toLocaleString());
								}
							}}>
							<FormInput
								label="Leg Type"
								labelStyle={styles.labelStyle}
								inputStyle={styles.inputStyle}
								showLine={true}
								type="press"
								backgroundStyle="line"
								style={{flex: 1}}
                                layoutDirection="column"
								icon={require("../../resource/images/next.png")}
								iconStyle={{transform: [{rotate: "90deg"}]}}
								value={model.LegType}
							/>
						</Picker>
					</View>
					<View width={20}/>
					<View style={{flex: 1}}>
						<FormInput
							label="Speed"
							ref={c => model.speedRef = c}
							labelStyle={styles.labelStyle}
							inputStyle={styles.inputStyle}
							showLine={true}
							backgroundStyle="line"
							style={{flex: 1}}
                            layoutDirection="column"
							keyboardType="numeric"
							value={`${model.Speed}`}
							onVerify={(value) => {
								let { errMsg, number } = CheckFloat(value, 99.99, 0.1, 1);
								model.Speed = number;
								return errMsg;
							}}
						/>
					</View>
				</View>);
		}

	});

	const _renderDeleteBtn = (index) => {
		if (index < 2) {
			return null;
		} else {
			return <TouchableOpacity
				style={styles.deleteButton}
				onPress={() => {
					displayPortList.splice(index, 1);
				}}>
				<Text style={styles.floatText}> {"x"} </Text>
			</TouchableOpacity>;
		}
	};

	const _renderItem = observer(({model}) => {
		let item = model.item;
		let index = model.index;
		return (
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<View style={{flexDirection: 'row', paddingLeft: padding, paddingRight: padding, paddingTop: 15}}>
					<View style={styles.floatIcon}>
						<Text style={styles.floatText}>{`${index + 1}`}</Text>
					</View>

					<_renderPortView model={item}/>
					{_renderDeleteBtn(index)}

				</View>

				<_renderPickerView model={item} index={index}/>
				<_renderBottomView model={item} index={index}/>
			</View>);
	});

	return (
		<View style={{flex: 1}}>
			<FlatList 
				data={displayPortList} 
				keyExtractor={(item, index) => index.toString()}
				keyboardShouldPersistTaps={'handled'}
				renderItem={(itemList, indexList) => {
					return (<_renderItem model={itemList} index={indexList}/>);
				}} 
				enableEmptySections={true}/>

			<View style={{alignItems: 'center',}}>
				<TouchableOpacity
					style={[{margin: 10}, styles.addButton]}
					onPress={() => {
						if(displayPortList.length == 7){
                            Alert.alert('Information!', 'User restricted to add maximum 7 Ports!') ;
							return;
						}
						displayPortList.push(new PortBean({key: displayPortList.length.toString()}));
					}}>
					<Text style={{color: 'white', fontSize: 14}}> {"Add Port"} </Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const _backButtonHandler = (navigation) => {
	let newArr;
	newArr = displayPortList.filter((item) => {
		if (item.Location && item.Location.length == 2) {
			return true;
		}
		return false;
	});

	if (newArr === null || newArr.length < 2) {
		Platform.OS === 'android' ? 
			alert('Must Choose more than one port') :
			Alert.alert('Error', 'Add At least Two port to calculate Distance and Number of Voyage Days!') ;
		return;
	} 
	
	let hasError = false;
	newArr.map(
		function(item, index){
			if((index < newArr.length - 1) && item.speedRef && item.Speed < 0.01){
				item.speedRef.error = 'Wrong value'
				hasError = true;
			}
		}
	);

	if(!hasError){
		PortList.savePorts(newArr);
		navigation.goBack();
	}
};

PortListView.navigationOptions = ({navigation}) => ({
	title: 'Port List',
	headerStyle: {backgroundColor: Colors.base_color},
	headerTitleStyle: {flex: 1, textAlign: 'center'},
	headerRight: (
		<TouchableOpacity onPress={() => {
			_backButtonHandler(navigation);
		}}>
			<Text style={{paddingRight: 10, color: 'white', fontSize: 16, fontWeight: 'bold'}}>{"Done"}</Text>
		</TouchableOpacity>
	)
});

const styles = StyleSheet.create({
	deleteButton: {
		position: 'absolute',
		top: 12,
		right: 15,
		height: badgeSize,
		width: badgeSize,
		alignItems: 'center',
		borderRadius: badgeSize / 2,
		backgroundColor: "#DDD"
	},
	addButton: {
		height: 42,
		width: 200,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#307ccb",
		borderRadius: 42,
	},
	floatIcon: {
		width: badgeSize,
		height: badgeSize,
		borderRadius: badgeSize / 2,
		backgroundColor: '#307ccb',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: badgePaddingRight,
	},
	floatText: {
		color: 'white',
		fontSize: 13
	},
	labelStyle: {
		fontSize: 14,
		color: 'grey'
	},
	inputStyle: {
		paddingLeft: 4,
		paddingRight: 4,
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default PortListView;