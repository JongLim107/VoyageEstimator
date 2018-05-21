/**
 * modify by @JongLim: 
 *      Add error msg for data verification.
 * 
*/

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Animated, Platform } from 'react-native'
import PropTypes from 'prop-types';

let JLLog = (msg) => {
	console.log(`>> StaticLabel << ${msg}`);
}

class StaticLabel extends Component {
    constructor(props) {
        super(props);
        let initialOpacity = 0;

        if (this.props.visible) {
            initialOpacity = 1;
        }

        this.state = {
            opacityAnim: new Animated.Value(initialOpacity)
        }
    }

    componentWillReceiveProps(newProps) {
        Animated.timing(this.state.opacityAnim, {
            toValue: newProps.visible ? 1 : 0,
            duration: 230
        }).start();
    }

    render() {
        if (this.props.visible) {
            return (
                <Animated.View style={{ opacity: this.state.opacityAnim }}>
                    {this.props.children}
                </Animated.View>
            );
        } else {
            return null;
        }
    }
}

class TextFieldHolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marginAnim: new Animated.Value(this.getPadding(this.props.noError))
        }
    }

    getPadding(noError) {
        if (this.props.borderType === 'line' || this.props.borderType === 'none'
            || this.props.label === undefined) {
            return 0;
        } else {
            return noError ? 5 : 1;
        }
    }

    componentWillReceiveProps(newProps) {
        return Animated.timing(this.state.marginAnim, {
            toValue: this.getPadding(newProps.noError),
            duration: 230
        }).start();
    }

    render() {
        return (
            <Animated.View style={{ marginTop: this.state.marginAnim }}>
                {this.props.children}
            </Animated.View>
        );
    }
}

class StaticError extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noError: true,
        }
    }

    render() {
        if (this.props.noError) {
            return null;
        } else {
            return (
                <View >
                    {this.props.children}
                </View>
            );
        }
    }
}


class StaticLabelTextField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noError: true,
            focused: false,
            text: this.props.value,
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.hasOwnProperty('value') && newProps.value !== this.state.text) {
            this.setState({ text: newProps.value })
        }
    }

    leftPadding() {
        return { paddingLeft: this.props.leftPadding || 0 }
    }

    contentPadding() {
        if (this.props.borderType === 'line') {
            return {
                paddingLeft: this.props.contentPadding || 5,
                paddingRight: this.props.contentPadding || 5,
                paddingBottom: 0,
                paddingTop: 0,
            }
        } else if (this.props.borderType === 'none') {
            return {
                padding: 0,
            }
        } else { // default is box
            return {
                paddingLeft: this.props.contentPadding || 5,
                paddingRight: this.props.contentPadding || 5,
            }
        }

    }

    withBorder() {
        if (this.props.borderType === 'line') {
            if (this.state.focused) {
                return [styles.withLine, { borderColor: "#1482fe" }];
            } else {
                return styles.withLine;
            }

        } else if (this.props.borderType === 'none') {
            return null;

        } else { // default is box
            if (this.props.editable !== undefined && !this.props.editable) {
                return [styles.withBorder, { backgroundColor: "#EEE" }];
            } else if (this.state.focused) {
                return [styles.withBorder, { borderColor: "#1482fe" }];
            } else {
                return styles.withBorder;
            }
        }
    }

    inputRef() {
        // JLLog('this.inputRef()');
        return this.refs.input;
    }

    focus() {
        // JLLog('this.inputRef().focus()');
        this.inputRef().focus();
    }

    blur() {
        // JLLog('this.inputRef().blur()');
        this.inputRef().blur();
    }

    isFocused() {
        return this.inputRef().isFocused();
    }

    clear() {
        this.inputRef().clear();
    }

    setFocus() {
        // JLLog('setFocus()');
        this.setState({
            focused: true
        });
        try {
            return this.props.onFocus();
        } catch (_error) { }

    }

    unsetFocus() {
        // JLLog('unsetFocus()');
        this.setState({
            focused: false
        });
        try {
            return this.props.onBlur();
        } catch (_error) { }
    }

    labelStyle() {
        if (this.state.focused) {
            return styles.focused;
        }
    }

    errormsgValue() {
        if (this.state.text) {
            return this.props.errormsg;
        } else {
            return 'Can not be blank';
        }
    }

    setText(value) {
        this.setState({
            text: value,
            noError: this.props.hasOwnProperty('onChangeValue') ? this.props.onChangeValue(value) : true
        });
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <StaticLabel visible={this.props.label}>
                    <Text style={[styles.fieldLabel, this.labelStyle()]}>{this.props.label}</Text>
                </StaticLabel>

                <TextFieldHolder
                    {...this.props}
                    noError={this.state.noError}>
                    <View
                        style={this.withBorder()}
                        onResponderRelease={() => {
                            this.focus = false;
                            if (this.props.onPress) {
                                if (!this.props.editable)
                                    this.props.onPress();
                            }
                        }}>
                        <TextInput {...this.props}
                            ref='input'
                            secureTextEntry={this.props.password}
                            underlineColorAndroid="transparent"
                            style={[styles.valueText, this.contentPadding(), this.props.style]}
                            defaultValue={this.props.defaultValue}
                            value={this.state.text}
                            maxLength={this.props.maxLength}
                            onFocus={() => this.setFocus()}
                            onBlur={() => this.unsetFocus()}
                            onChangeText={(value) => this.setText(value)}
                        />
                    </View>
                </TextFieldHolder>

                <StaticError noError={this.state.noError}>
                    <Text style={styles.fieldError}>{this.errormsgValue()}</Text>
                </StaticError>

            </View>
        );
    }

}

StaticLabel.propTypes = {
    // label
    label: PropTypes.string,
    labelProps: PropTypes.objectOf(Text.propTypes),
    labelStyle: Text.propTypes.style,

    // input
    value: PropTypes.string,
    keyboardType: TextInput.propTypes.keyboardType,
    password: PropTypes.bool,
    placeholder: PropTypes.string,
    inputStyle: TextInput.propTypes.style,

    onChange: PropTypes.func,
    onChangeValue: PropTypes.func,

    // error
    errormsg: PropTypes.string,
    errorStyle: Text.propTypes.style,
    errorProps: PropTypes.objectOf(Text.propTypes),

    // line
    borderType: PropTypes.oneOf(['box', 'line', 'none']),
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    fieldLabel: {
        height: 15,
        fontSize: 11,
        color: '#AAA'
    },
    fieldError: {
        fontSize: 11,
        color: '#F11'
    },
    withBorder: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#CCC',
    },
    withLine: {
        borderBottomWidth: 1 / 2,
        borderColor: '#CCC',
    },
    valueText: {
        fontSize: 14,
        paddingTop: 2,
        paddingBottom: 2,
        color: '#111'
    },
    focused: {
        color: "#1482fe"
    }
});

export default StaticLabelTextField;