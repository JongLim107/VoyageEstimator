"use strict";

import React, { Component } from "react"
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import PropTypes from 'prop-types';
import { observer } from "mobx-react";
import { observable } from "mobx";

const paddingHorizontal = 12, paddingVertical = 7;
const background = "#FFFFFF";
const labelColor = "#2e2e2e", labelSize = 13;
const textColor = "#333333", textSize = 14;
const errorColor = "#EF4438", errorSize = labelSize;
const space_1 = 1, space_2 = 2, space_4 = 4, space_6 = 6, space_min = 8, space_least = 10;
const border = 1, borderColor = "#D9D9D9";
const lineHeight = 0.6, lineColor = "#DDDFE1";
const radius = 4;
const focusColor = "#0081CC", disableColor = '#EEE';

@observer
class FormInput extends Component {

    @observable focus: false;
    @observable errorMarginLeft: 0;
    @observable error: "";

    _onChangeText(text, onChangeTextCallback, onVerify) {

        if (onVerify) {
            this.error = onVerify(text);
        }

        if (onChangeTextCallback) {
            onChangeTextCallback(text);
        }
    }

    _renderTextInput = ({
        type, backgroundStyle, layoutDirection,
        keyboardType, password, hint,
        inputStyle, inputProps, value, onChange,
        onChangeText: onChangeTextCallback, onVerify,
        icon, iconProps, iconStyle,
        disable, onPress, boxStyle,
    }) => {

        let flexStyle = layoutDirection === "row" && { flex: 1 };

        let inputType;
        if (password) {
            inputType = "default";
        } else {
            inputType = keyboardType;
        }

        let borderStyle = {
            borderRadius: radius,
            backgroundColor: disable ? '#EEE' : 'transparent'
        };

        let focus = this.focus;
        if (backgroundStyle === "box") {
            borderStyle.borderWidth = border;
            borderStyle.borderColor = disable ? '#EEE' : (this.focus ? focusColor : borderColor);
        }

        let component;
        if (type === "press") {
            // press mode, just like a button

            let responder;
            if (disable) {
                responder = {};

            } else {
                responder = {
                    onStartShouldSetResponder: () => true,
                    onMoveShouldSetResponder: () => false,
                    onResponderGrant: () => this.focus = true,
                    onResponderRelease: () => {
                        this.focus = false;

                        if (!disable && onPress) {
                            onPress();
                        }
                    },
                    onResponderMove: () => this.focus = false,
                }
            }

            component = (
                <View style={[
                    borderStyle,
                    defaultStyle.horizontal,
                    {
                        paddingRight: space_6,
                    },
                    boxStyle
                ]}
                    {...responder}>

                    <TextInput
                        underlineColorAndroid="#00000000"
                        {...inputProps}
                        secureTextEntry={password}
                        placeholder={hint}
                        style={[
                            defaultStyle.input,
                            inputStyle,
                        ]}
                        value={value}
                        onChange={onChange}
                        // onChange was executed before onChangeText
                        onChangeText={(text) => {
                            this._onChangeText(text, onChangeTextCallback, onVerify);
                        }}
                        editable={false} />

                    <View // create a empty view to override the TextInput, because in iOS, the View has TextInput, it can't be press
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                    />

                    {this._renderIcon(icon, iconProps, iconStyle)}

                </View>
            );
        } else {
            // input mode,
            component = (
                <View style={[
                    defaultStyle.horizontal,
                    borderStyle,
                    {
                        paddingRight: space_6,
                    },
                    boxStyle
                ]}>

                    <TextInput
                        underlineColorAndroid="#00000000"
                        onFocus={() => {
                            this.focus = true;
                        }}
                        onBlur={() => {
                            this.focus = false;
                        }}
                        {...inputProps}
                        editable={!disable}
                        keyboardType={inputType}
                        secureTextEntry={password}
                        placeholder={hint}
                        style={[
                            defaultStyle.input,
                            inputStyle,
                        ]}
                        value={value}
                        onChange={onChange}
                        // onChange was executed before onChangeText
                        onChangeText={(text) => {
                            this._onChangeText(text, onChangeTextCallback, onVerify);
                        }} />

                    {this._renderIcon(icon, iconProps, iconStyle)}

                </View>
            );
        }

        return (
            <View style={flexStyle}>
                {component}
            </View>
        );
    };

    _renderIcon(icon, iconProps, iconStyle) {
        if (icon !== undefined
            || (iconProps !== undefined
                && iconProps.source !== undefined)) {

            let result = icon;
            if (result === undefined) {
                result = iconProps.source;
            }

            return (
                <Image {...iconProps}
                    source={result}
                    style={[
                        defaultStyle.icon,
                        iconStyle
                    ]}
                />
            );

        } else {
            return null;

        }
    }

    _renderMust = (must, layoutDirection) => {

        let marginLeft = layoutDirection === "column" ? space_2 : 0;
        let marginRight = layoutDirection === "column" ? 0 : space_2;

        return must && (
            <Text style={{
                marginLeft: marginLeft,
                marginRight: marginRight,
                textAlignVertical: "center",
                color: errorColor,
                fontSize: labelSize,
            }}>*</Text>
        );
    };

    _renderImage = (img, imgProps, imgStyle) => {
        if (img !== undefined
            || (imgProps !== undefined
                && imgProps.source !== undefined)) {

            let result = img;
            if (result === undefined) {
                result = imgProps.source;
            }

            return (
                <Image {...imgProps}
                    source={result}
                    style={[
                        defaultStyle.img,
                        imgStyle
                    ]}
                />
            );

        } else {
            return null;

        }
    };

    _renderError = ({ error, errorProps, errorStyle }) => {
        if (!isEmpty(error) || !isEmpty(this.error)) {

            let marginLeft = { marginLeft: (this.errorMarginLeft + space_2) };
            let errorDisplay = isEmpty(error) ? this.error : error;

            return (
                <Text style={[defaultStyle.error, marginLeft, errorStyle]}>
                    {errorDisplay}
                </Text>
            );
        } else {
            return null;
        }
    };

    _renderLabel = (layoutDirection, label, labelProps, labelStyle) => {
        if (label === undefined || label === null || label.length === 0) {
            return null;
        }
        if (layoutDirection === 'row') {
            return (
                <Text numberOfLines={1} {...labelProps}
                    style={[defaultStyle.label, labelStyle]}
                >
                    {label}
                </Text>
            );
        } else {
            return (
                <Text
                    {...labelProps}
                    style={[
                        defaultStyle.label, {
                            textAlignVertical: "center",
                            fontSize: labelSize,
                            marginLeft: space_2,
                            marginBottom: space_1,
                        },
                        labelStyle
                    ]}
                >
                    {label}
                </Text>
            );
        }
    };

    _renderBody = (props) => {

        let {
            layoutDirection, must, /*bodyStyle,*/
            img, imgProps, imgStyle,
            label, labelProps, labelStyle,
            inputComponent,
        } = props;

        if (layoutDirection === "row") {
            return (
                <View>
                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                        <View style={defaultStyle.horizontal}
                            onLayout={(event) => {
                                let { width } = event.nativeEvent.layout;
                                this.errorMarginLeft = width;
                            }}>

                            {this._renderMust(must, layoutDirection)}

                            {this._renderImage(img, imgProps, imgStyle)}

                            {this._renderLabel(layoutDirection, label, labelProps, labelStyle)}

                        </View>

                        {inputComponent !== undefined ? inputComponent : this._renderTextInput(props)}

                    </View>

                    {this._renderError(props)}

                </View>
            );

        } else {

            return (
                <View>
                    <View style={defaultStyle.horizontal}>

                        {this._renderMust(must, layoutDirection)}

                        {this._renderImage(img, imgProps, imgStyle)}

                        {this._renderLabel(layoutDirection, label, labelProps, labelStyle)}

                    </View>

                    {inputComponent !== undefined ? inputComponent : this._renderTextInput(props)}

                    {this._renderError(props)}

                </View>
            );
        }

    };

    _renderLine = (backgroundStyle, showLine) => {

        if (backgroundStyle === "line" && showLine) {

            let focus = this.focus;

            let line;
            if (focus) {
                line = focusColor;
            } else {
                line = lineColor;
            }

            return (
                <View style={{ height: lineHeight, backgroundColor: line }} />
            );
        }

        return null;
    };

    render() {
        let { style, backgroundStyle, showLine } = this.props;

        return (
            <View
                {...this.props}
                style={style}>

                {this._renderBody(this.props)}

                {this._renderLine(backgroundStyle, showLine)}

            </View>
        );
    }

}

export function isEmpty(text: String) {
    if (!text) {
        return true;
    }

    const regexNotEmpty = /^\s*$/;

    return regexNotEmpty.test(text);
}

FormInput.propTypes = {
    type: PropTypes.oneOf([
        "input",
        "press",
    ]),
    backgroundStyle: PropTypes.oneOf([
        "box",
        "line",
    ]),
    layoutDirection: PropTypes.oneOf([
        "row",
        "column",
    ]),
    must: PropTypes.bool,
    disable: PropTypes.bool,

    // img
    img: Image.propTypes.source,
    imgProps: PropTypes.objectOf(Image.propTypes),
    imgStyle: Image.propTypes.style,

    // label
    label: PropTypes.string,
    labelProps: PropTypes.objectOf(Text.propTypes),
    labelStyle: Text.propTypes.style,

    // input
    value: PropTypes.string,
    keyboardType: TextInput.propTypes.keyboardType,
    password: PropTypes.bool,
    hint: PropTypes.string,
    inputStyle: TextInput.propTypes.style,
    inputProps: PropTypes.objectOf(TextInput.propTypes),

    onChange: PropTypes.func,
    onChangeText: PropTypes.func,
    onVerify: PropTypes.func,

    inputComponent: PropTypes.element,

    // img
    icon: Image.propTypes.source,
    iconProps: PropTypes.objectOf(Image.propTypes),
    iconStyle: Image.propTypes.style,

    // error
    error: PropTypes.string,
    errorStyle: Text.propTypes.style,
    errorProps: PropTypes.objectOf(Text.propTypes),

    // line
    showLine: PropTypes.bool,

};

FormInput.defaultProps = {
    type: "input",
    backgroundStyle: "box",
    layoutDirection: "column",
    must: false,
    disable: false,

    showLine: false,
    password: false,
};

const defaultStyle = StyleSheet.create({
    horizontal: {
        flexDirection: "row",
    },
    img: {
        width: 20,
        height: 20,
        marginRight: space_min,
    },
    icon: {
        width: 20,
        height: 20,
        alignSelf: "center"
    },
    must: {
        alignSelf: "center",
        width: 8,
        height: 8,
        marginRight: space_2,
    },
    label: {
        fontSize: textSize,
        textAlign: "left",
        color: labelColor,
        marginRight: space_min,
    },
    input: {
        color: textColor,
        fontSize: textSize,
        minHeight: 30,
        paddingVertical: space_2,
        paddingLeft: space_4,
        paddingRight: space_4,
        flex: 1,
    },
    error: {
        color: errorColor,
        fontSize: errorSize,
        marginTop: space_1,
    },
});

export default FormInput;
