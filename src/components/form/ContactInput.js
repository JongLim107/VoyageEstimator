"use strict";

import React, {Component} from "react"
import {Platform, ColorPropType, Text, TextInput, TouchableOpacity, View} from "react-native";
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import {observable} from "mobx";
import FormInput, {isEmpty} from "./FormInput";
import Flags from "react-native-phone-input/lib/resources/flags/index";
import PhoneNumber from "react-native-phone-input/lib/phoneNumber";
import SelectionListStore from "../selectionlist/SelectionListObservable";

const textColor = "#333333", textSize = 14;
const space_2 = 2, space_least = 10;
const border = 1, borderColor = "#D9D9D9";
const radius = 4;
const errorColor = "#EF4438";
const defBoxBackground = "#FFFFFF";
const defFocusColor = "#0081CC", defDisableColor = '#EEE';

let phoneData;

@observer
class ContactInput extends Component {

    @observable focus = false;
    @observable currentCountryCode;

    componentDidMount() {
        const {defaultCountryName} = this.props;

        if (phoneData === undefined || phoneData.length < 1) {
            phoneData = PhoneNumber
                .getAllCountries()
                .map((country, index) => {
                    const countryName = country.name;

                    const item = {
                        key: index,
                        image: Flags.get(country.iso2),
                        label: country.name,
                        dialCode: `+${country.dialCode}`,
                        iso2: country.iso2
                    };

                    if (defaultCountryName === countryName) {
                        this.currentCountryCode = item;
                    }

                    return item;
                });
        } else {
            for (let i = 0; i < phoneData.length; i++) {
                const country = phoneData[i];
                const countryName = country.label;

                if (defaultCountryName === countryName) {
                    this.currentCountryCode = country.label;
                    break;
                }
            }
        }

        if (this.currentCountryCode === undefined) {
            this.currentCountryCode = phoneData[0];
        }

    }

    _renderBody = ({
                       navigation,
                       code, onCodePress,
                       hint, value,
                       inputStyle, inputProps,
                       onChangeText, onChange,
                       disable, boxStyle,
                       error, showErrorBox,
                       focusColor, disableColor,
                   }) => {

        const selectCodeFunction = () => {
            if (onCodePress) {
                onCodePress();
            } else if (navigation) {
                this._onCodePressDefault(navigation, phoneData);
            }
        };

        // parser input background color
        let boxBackgroundColor;
        if (boxStyle !== undefined && boxStyle.backgroundColor !== undefined) {
            boxBackgroundColor = boxStyle.backgroundColor;

        } else {
            boxBackgroundColor = defBoxBackground;
        }

        let borderStyle = {
            borderWidth: border,
            borderRadius: radius,
            backgroundColor: disable && disableColor,
        };

        let lineColor, hasError = false;
        if (showErrorBox) {
            if (this.formInput !== undefined && this.formInput.hasError(error)) {
                hasError = true;
            } else {
                hasError = !isEmpty(error);
            }

        } else {
            hasError = false;

        }

        if (hasError) {
            lineColor = errorColor;
        } else {
            lineColor = disable ? borderColor : (this.focus ? focusColor : borderColor);
        }
        borderStyle.borderColor = lineColor;

        let currentCode;
        if (code !== undefined) {
            currentCode = code;
        } else if (this.currentCountryCode !== undefined) {
            currentCode = this.currentCountryCode.dialCode;
        } else {
            currentCode = "";
        }

        return (
            <View style={[
                {
                    flexDirection: "row",
                    paddingVertical: space_2,
                },
                borderStyle,
                boxStyle,
                {
                    backgroundColor: disable ? disableColor : boxBackgroundColor,
                }
            ]}>

                <TouchableOpacity
                    style={{
                        paddingHorizontal: space_least,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={selectCodeFunction}>

                    <Text style={{
                        fontWeight: "bold",
                        fontSize: textSize,
                        color: textColor,
                    }}>
                        {currentCode}
                    </Text>

                </TouchableOpacity>

                <View style={{
                    backgroundColor: lineColor,
                    width: border,
                }}/>

                <TextInput
                    underlineColorAndroid="#00000000"
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    returnKeyType="done"
                    onFocus={() => {
                        this.focus = true;
                    }}
                    onBlur={() => {
                        this.focus = false;
                    }}
                    {...inputProps}
                    editable={!disable}
                    placeholder={hint}
                    style={[
                        {
                            color: textColor,
                            fontSize: textSize,
                            paddingHorizontal: space_least,
                            paddingVertical: space_2,
                            flex: 1,
                            minHeight: 30,
                        },
                        inputStyle,
                    ]}
                    value={value}
                    onChange={onChange}
                    // onChange was executed before onChangeText
                    onChangeText={onChangeText}/>
            </View>
        )
    };

    render() {
        const props = this.props;

        const {
            layoutDirection, style,
            must, mustStyle, mustComponent,
            label, labelProps, labelStyle,
            error, errorProps, errorStyle,
        } = props;

        return (
            <FormInput
                style={ style }
                layoutDirection={layoutDirection}
                must={must}
                mustStyle={mustStyle}
                mustComponent={mustComponent}
                label={label}
                labelProps={labelProps}
                labelStyle={labelStyle}
                error={error}
                errorProps={errorProps}
                errorStyle={errorStyle}
                inputComponent={
                    this._renderBody(props)
                }
                ref={(component) => (this.formInput = component)}
            />
        );
    }

    componentWillUnmount() {
        phoneData = [];
    }

    _onCodePressDefault = (navigation, phoneData) => {
        SelectionListStore.setDataSource(phoneData);

        navigation.navigate(
            'selectionList',
            {
                title: 'Select Country Code',
                iconTag: 'image',
                textTag: 'label',
                valueTag: 'dialCode',
                onItemSelected: (item) => this._onSelectPhoneCountry(item),
                searchable: true,
                searchFunc: (text) => this._searchPhoneCountryWithText(text),
            });
    };

    _onSelectPhoneCountry = (item) => {
        this.currentCountryCode = item;
    };

    _searchPhoneCountryWithText = function (text) {
        let filtered = phoneData.filter((item) => {
            return item.label.toLowerCase().includes(text.toLowerCase()) === true;
        });

        let sorted = filtered.sort((a, b) => {
            return b.label < a.label
                ? 1 : b.label > a.label ? -1 : 0;
        });

        SelectionListStore.setDataSource(sorted);
    };

    getCountryArray = () => {
        return phoneData;
    };

    getCurrentCountry = () => {
        return this.currentCountryCode;
    }
}

const propsSheet = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
]);

ContactInput.propTypes = {
    // parent
    navigation: PropTypes.any,
    layoutDirection: PropTypes.oneOf([
        "row",
        "column",
    ]),

    // style: View.propTypes.style,
    disable: PropTypes.bool,
    disableColor: ColorPropType,

    // must
    must: PropTypes.bool,
    mustStyle: Text.propTypes.style,
    mustComponent: PropTypes.element,

    // label
    label: PropTypes.string,
    labelProps: propsSheet,
    labelStyle: Text.propTypes.style,

    // code
    code: PropTypes.string,
    onCodePress: PropTypes.func,
    defaultCountryName: PropTypes.string,

    // input
    value: PropTypes.string,
    hint: PropTypes.string,
    inputStyle: TextInput.propTypes.style,
    inputProps: propsSheet,
    focusColor: ColorPropType,

    onChange: PropTypes.func,
    onChangeText: PropTypes.func,

    // error
    error: PropTypes.string,
    errorStyle: Text.propTypes.style,
    errorProps: propsSheet,
    showErrorBox: PropTypes.bool,

};

ContactInput.defaultProps = {
    must: false,
    disable: false,
    showErrorBox: true,
    disableColor: defDisableColor,
    focusColor: defFocusColor,
};

export default ContactInput;
