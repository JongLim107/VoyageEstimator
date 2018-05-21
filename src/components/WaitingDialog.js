"use strict";

import React, {Component,} from "react"

import {
    View, ActivityIndicator, Modal,
    Dimensions, BackHandler, TouchableHighlight
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const colorIndicator = "#FFFFFF";

class WaitingDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    render() {
        return (
            <Modal
                visible={this.state.show}
                transparent
                onRequestClose={() => {
                    this.dismiss();
                }}
                onClose={() => {
                    this.dismiss();
                }}
                maskClosable={true}>

                <TouchableHighlight
                    style={{
                        flex: 1,
                        backgroundColor: "#00000088",
                        width: screenWidth,
                        height: screenHeight,
                    }}
                    onPress={() => {
                        this.dismiss();
                    }}>
                    <ActivityIndicator
                        style={{
                            flex: 1,
                            alignSelf: "center",
                        }}
                        animating={true}
                        size="large"
                        color={colorIndicator}/>
                </TouchableHighlight>

            </Modal>
        );
    }

    // componentDidMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this._back());
    //
    // }
    //
    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this._back());
    // }
    //
    // _back = () => {
    //     if (this.state.show) {
    //         this.dismiss();
    //     }
    // };

    show = () => {
        if (!this.state.show) {
            this.setState({
                show: true,
            });
        }

    };

    dismiss = () => {
        if (this.state.show) {
            this.setState({
                show: false,
            });
        }

    };

}

export default WaitingDialog;


