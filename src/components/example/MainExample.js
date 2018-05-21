/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ContactInput, FormInput, FormItem, WaitingDialog} from "../index";
import {font_size_normal, font_size_small, margin_horizontal, space, space_6, space_min} from "./constants/Dimension";
import SelectionListStore from "../selectionlist/SelectionListObservable";
import DatePicker from "../datepicker/datepicker";

const baseColor = "#0081CC";

let countryArray;

class MainExample extends Component {

    componentDidMount() {
        countryArray = this.contactInput.getCountryArray();
    }

    render() {
        const {navigation} = this.props;

        return (

            <View>
                <ScrollView>
                    <View style={{
                        flex: 1,
                        backgroundColor: "white",
                        padding: margin_horizontal,
                    }}>
                        <Text style={Styles.description}>FormInput box style press to open Selection List</Text>

                        <FormInput
                            style={Styles.gap}
                            type="press"
                            boxStyle={{
                                backgroundColor: "red",
                            }}
                            must={true}
                            label="Wage Scale Standard"
                            hint="Please select"
                            onPress={() => openSelectionList(navigation, countryArray)}/>

                        <Text style={Styles.description}>FormInput line style press to open Alphabetic Selection
                            List</Text>

                        <FormInput
                            style={Styles.gap}
                            type="press"
                            backgroundStyle="line"
                            label="Open Alphabetic Selection List"
                            hint="Please select"
                            showLine={true}
                            onPress={() => openAlphabeticSelectionList(navigation, countryArray)}/>

                        <Text style={Styles.description}>FormInput the box style vertical input</Text>

                        <FormInput
                            style={Styles.gap}
                            label="Input something"
                            hint="Please input something"
                            icon={require("../resource/images/robot-prod.png")}
                            showLine={true}
                            onVerify={(text) => {
                                if(text.length > 5) {
                                    return "Test error";
                                }else {
                                    return "";
                                }
                            }}
                            onPress={() => openAlphabeticSelectionList(navigation, countryArray)}/>

                        <Text style={Styles.description}>FormInput the line style horizontal input</Text>

                        <FormInput
                            arrowDirection="row"
                            backgroundStyle="line"
                            style={Styles.gap}
                            boxStyle={{
                                backgroundColor: "white",
                            }}
                            img={require("../resource/images/robot-dev.png")}
                            label="Input something"
                            hint="Please input something"
                            showLine={true}
                            onPress={() => openAlphabeticSelectionList(navigation, countryArray)}/>

                        <Text style={Styles.description}>ContactInput Example:</Text>

                        <ContactInput
                            navigation={navigation}
                            style={Styles.gap}
                            label="Contact Number"
                            hint="Mobile number"
                            must={true}
                            defaultCountryName="Singapore"
                            error={"aaaa"}
                            ref={(component) => this.contactInput = component}/>

                        <Text style={Styles.description}>WaitingDialog Example:</Text>

                        <View style={[
                            Styles.gap,
                            {
                                flexDirection: "row",
                            }
                        ]}>
                            <TouchableOpacity
                                style={{
                                    padding: space_min,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: baseColor,
                                }}
                                onPress={() => this.waitingDialog.show()}>

                                <Text style={{
                                    color: "white"
                                }}>show WaitingDialog</Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    padding: space_min,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: baseColor,
                                    marginLeft: space,
                                }}
                                onPress={() => {
                                    this.waitingDialog.dismiss();

                                    let currentCountry = this.contactInput.getCurrentCountry();
                                    console.warn(currentCountry.label)

                                }}>

                                <Text style={{
                                    color: "white"
                                }}>dismiss WaitingDialog</Text>

                            </TouchableOpacity>
                        </View>

                        <Text style={Styles.description}>FormItem horizontal style open Date Picker</Text>

                        <DatePicker
                            androidMode='spinner'
                            mode='date'
                            placeholder='Select date'
                            label="Select Date"
                            showIcon={false}
                            cancelBtnText='Cancel'
                            confirmBtnText='Confirm'
                            onDateChange={(dateStr, date) =>
                                console.warn(dateStr)
                            }
                            customStyles={{
                                dateContent: {
                                    paddingLeft: 12,
                                    marginRight: 0
                                },
                                dateLabel: {
                                    color: "#55565A",
                                    fontSize: font_size_small,
                                    fontWeight: 'normal'
                                },
                                placeholderText: {
                                    marginLeft: -10
                                },
                                dateText: {
                                    marginLeft: -10
                                }
                            }}>

                            <FormItem
                                icon={require("../resource/images/robot-dev.png")}
                                text="Open Date Picker"
                                value="for display value"
                                arrowDirection="right" />

                        </DatePicker>
                    </View>

                </ScrollView>

                <WaitingDialog ref={(component) => this.waitingDialog = component}/>
            </View>
        );
    }
}

function openSelectionList(navigation, phoneData) {
    SelectionListStore.setDataSource(phoneData); // must call setDataSource to reset data

    navigation.navigate(
        'selectionList',
        {
            title: 'Selection List',
            iconTag: 'image',
            textTag: 'label',
            valueTag: 'dialCode',
            onItemSelected: (item) => onListSelected(item),
            searchable: true,
            searchFunc: (text) => searchWithText(text),
        });
}

function openAlphabeticSelectionList(navigation, phoneData) {
    SelectionListStore.setDataSource(phoneData); // must call setDataSource to reset data

    navigation.navigate(
        'alphabeticSelectionList',
        {
            title: 'Alphabetic Selection List',
            iconTag: 'image',
            textTag: 'label',
            valueTag: 'dialCode',
            onItemSelected: (item) => onListSelected(item),
            searchable: true,
            searchFunc: (text) => searchWithText(text),
        });
}

function searchWithText(text) {
    let filtered = countryArray.filter((item) => {
        return item.label.toLowerCase().includes(text.toLowerCase()) === true;
    });

    let sorted = filtered.sort((a, b) => {
        return b.label < a.label
            ? 1 : b.label > a.label ? -1 : 0;
    });

    SelectionListStore.setDataSource(sorted);
}

function onListSelected(item) {
    console.warn(item);
}

const Styles = StyleSheet.create({
    description: {
        fontSize: font_size_normal,
        color: "#90A4AE",
        marginTop: space,
    },
    gap: {
        marginTop: space_6,
    },
});

export default MainExample;
