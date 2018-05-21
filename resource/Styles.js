import React from 'react';
import * as Dimens from "./Dimension";
import { StatusBar } from 'react-native';
import Colors from './Colors'

export const shapeWhiteCorner = {
    borderColor: "white",
    borderRadius: Dimens.radius,
    borderWidth: Dimens.line,
    backgroundColor: "white"
};

export const buttonBlue = {
    backgroundColor: Colors.button_blue,
    borderRadius: Dimens.radius,
    alignItems: "center",
    padding: 14,
};

export const buttonDisable = {
    backgroundColor: Colors.button_disable,
    borderRadius: Dimens.radius,
    alignItems: "center",
    padding: 14,
};

export const statusBarStyle = {
    statusBarColor: Colors.base_color,
    drawUnderStatusBar: false,
};

export const titleStyle = {
    // title
    navBarTextColor: Colors.white,
    navBarTextFontSize: 18,
    navBarBackgroundColor: Colors.base_color,
    navBarButtonColor: Colors.white,
    topBarElevationShadowEnabled: true,
    navigationBarColor: Colors.base_color,
    navBarTitleTextCentered: true,
    navBarTextFontBold: false,
    navBarHeight: Dimens.title_height,
};

export const tbIconStyle = {
    width: 24,
    height: 24,
};

export const matchParent = {
    flex:1,
};

module.exports = { matchParent, shapeWhiteCorner, buttonBlue, buttonDisable, statusBarStyle, titleStyle, tbIconStyle };
