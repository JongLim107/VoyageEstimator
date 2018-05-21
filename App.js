import React from 'react';
import { PermissionsAndroid, Platform, StatusBar, View, Text } from 'react-native';
import RootNavigation from './src/navigation/RootNavigation';
import Colors from './resource/Colors';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
	'Warning: isMounted(...) is deprecated',
	'Warning: Each child in an array or iterator should have',
	'VirtualizedList: missing keys for items,',
]);

function IS_ANDROID() {
	return Platform.OS !== 'ios'
}

let JLLog = (msg) => {
    if (typeof str == 'string') {
        console.log(`>> App.js << ${msg}`);
    } else {
        console.log(`>> App.js << ${JSON.stringify(msg)}`);
    }
}

JLLog('init');

// example
async function requestCameraPermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.CAMERA,
			{
				'title': 'Cool Photo App Camera Permission',
				'message': 'Cool Photo App needs access to your camera ' +
					'so you can take awesome pictures.'
			}
		)
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			JLLog("You can use the camera")
		} else {
			JLLog("Camera permission denied")
		}
	} catch (err) {
		console.warn(err)
	}
}

export default class App extends React.Component {
	state = {
		isAndroidPermissionGranted: true
	};

	render() {		
		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				<StatusBar hidden={false} backgroundColor={Colors.base_color} />
				<RootNavigation />
			</View>
		);
	}
}