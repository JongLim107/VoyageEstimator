"use strict";

import React, {Component} from "react"
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PropTypes from 'prop-types';

let space_1 = 1, space_min = 8, padding = 12, space = 16;
let background = "#FFFFFF";
let text = "#55565A", font_size_normal = 14, font_size_small = 12;
let lineHeight = 1, lineColor = "#DDDFE1";

function _renderIcon(icon, iconProps, iconStyle) {
    if ((icon !== undefined && icon != null)
        || (iconProps !== undefined
            && iconProps.source !== undefined)) {
        let source = icon;
        if (source === undefined) {
            source = iconProps.source;
        }

        return (
            <Image {...iconProps}
                   source={source}
                   style={[
                       defaultStyle.image,
                       {marginRight: space,},
                       iconStyle
                   ]}/>
        );
    }

    return null;
}

function _renderNext(props) {
    let {
        rightIcon, rightIconStyle,
        rightIconProps, arrowDirection,
    } = props;

    if (arrowDirection === "up"
        || arrowDirection === "down"
        || arrowDirection === "left"
        || arrowDirection === "right") {

        let rotate;
        switch (arrowDirection) {
            case "up": {
                rotate = "270deg";
                break;
            }
            case "down": {
                rotate = "90deg";
                break;
            }
            case "left": {
                rotate = "180deg";
                break;
            }
            case "right": {
                rotate = "0deg";
                break;
            }
        }

        let transformStyle = {
            transform: [{
                rotate: rotate
            }]
        };

        return (
            <Image {...rightIconProps}
                   source={rightIcon}
                   style={[
                       transformStyle,
                       defaultStyle.image,
                       rightIconStyle,
                   ]}/>
        );
    }

    return null;
}

function _renderError(error, errorProps, errorStyle) {
    // let error = this.state.error;
    if (error !== undefined && error != null && error.length > 0) {
        return (
            <Text {...errorProps}
                  style={[defaultStyle.error, errorStyle]}>
                {error}
            </Text>
        );
    } else {
        return null;
    }
}

function _renderForeground(disable) {
    if (disable) {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: lineHeight,
                    backgroundColor: '#FFFFFF88'
                }}
            />
        );
    }
    return null;
}

function _renderLine(showLine) {
    if (showLine) {
        return (
            <View style={{height: lineHeight, backgroundColor: lineColor}}/>
        );
    }

    return null;
}

function _renderValue(valueStyle, valueProps, value, onValueChange) {
    if (onValueChange) {
        onValueChange(value);
    }

    return <Text numberOfLines={1}
                 {...valueProps}
                 style={[
                     defaultStyle.value,
                     valueStyle
                 ]}>
        {value}
    </Text>;
}

const FormItem = (props) => {

    let {
        style, itemStyle, onPress, disable,
        icon, iconProps, iconStyle,
        text, textProps, textStyle,
        value, valueProps, valueStyle, onValueChange,
        error, errorStyle, errorProps,
        showLine,
    } = props;

    let dynamicItemStyle;
    if (error !== undefined && error != null && error.length > 0) {
        dynamicItemStyle = {
            paddingBottom: 0,
        }
    } else {
        dynamicItemStyle = {}
    }

    return (
        <View {...props}
              style={[defaultStyle.parent, style]}
              pointerEvents={disable ? 'none' : 'auto'}>

            <TouchableOpacity
                style={[
                    defaultStyle.item,
                    dynamicItemStyle,
                    itemStyle
                ]}
                onPress={onPress}>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>

                    {
                        _renderIcon(icon, iconProps, iconStyle)
                    }

                    <Text numberOfLines={1}
                          style={[
                              defaultStyle.label,
                              textStyle
                          ]}
                          {...textProps}>
                        {text}
                    </Text>

                    {
                        _renderValue(valueStyle, valueProps, value, onValueChange)
                    }
                    {
                        _renderNext(props)
                    }

                </View>

                {
                    _renderError(error, errorProps, errorStyle)
                }
            </TouchableOpacity>

            {
                _renderForeground(disable)
            }

            {
                _renderLine(showLine)
            }

        </View>
    );
};

const propsSheet = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
]);

FormItem.propTypes = {
    // parent
    onPress: PropTypes.func,
    disable: PropTypes.bool,

    // itemStyle: View.propTypes.style,

    // icon
    icon: Image.propTypes.source,
    iconProps: propsSheet,
    iconStyle: Image.propTypes.style,

    // label
    text: PropTypes.string,
    textProps: propsSheet,
    textStyle: Text.propTypes.style,

    // value
    value: PropTypes.string,
    valueProps: propsSheet,
    valueStyle: Text.propTypes.style,
    onValueChange: PropTypes.func,

    // next
    rightIcon: Image.propTypes.source,
    rightIconStyle: Image.propTypes.style,
    rightIconProps: propsSheet,
    arrowDirection: PropTypes.oneOf([
        "none", "up", "down", "left", "right",
    ]),

    // error
    error: PropTypes.string,
    errorStyle: Text.propTypes.style,
    errorProps: propsSheet,

    // line
    showLine: PropTypes.bool,
};

FormItem.defaultProps = {
    rightIcon: require("../resource/images/next.png"),
    arrayDirection: "right",
    showLine: true,
    disable: false,
};

const defaultStyle = StyleSheet.create({
    parent: {
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: background,
    },
    item: {
        padding: padding,
        flexDirection: "column",
    },
    image: {
        width: 24,
        height: 24,
    },
    label: {
        color: text,
        fontSize: font_size_small,
        alignSelf: "center",
        textAlign: "left",
    },
    value: {
        color: text,
        fontSize: font_size_normal,
        alignSelf: "center",
        textAlign: "right",
        flex: 1,
    },
    error: {
        color: "#EF4438",
        fontSize: 12,
        marginBottom: space_1,
    },
});

export default FormItem;
