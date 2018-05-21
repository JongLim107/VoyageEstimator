"use strict";

import { Platform, ToastAndroid, Alert } from "react-native";
import Axios, { AxiosPromise, AxiosRequestConfig } from "axios";

let client = Axios.create({
	timeout: 3000,
});

// Add a request interceptor
client.interceptors.request.use(
	function (config) {
		let { baseURL, url, method, headers, params, data } = config;
		console.log(
			`>> request(${method}) url: ${baseURL}${url ? url : ''}`
			// `\n>> request data: ${JSON.stringify(data)}`
			// `\n>> request headers: ${headers.common.Accept}` +
			// `\n>> request params: ${params}` +
		);
		return config;
	},
	function (error) {
		console.log(`<< request: ${error.toString()}`);
		return Promise.reject(error.toString());
	}
);

// Add a response interceptor
client.interceptors.response.use(
	function (response) {
		let { data: responseData, config, headers } = response;
		let { url, method, data } = config;
		console.log(
			'<< response success' +
			`\n<< url: ${url}`
			// `\n<< data: ${JSON.stringify(responseData)}`
			// `\n<< response headers: ${JSON.stringify(headers, null, 2)}`
		);
		return response;
	},
	function (error) {
		let { config, request, response } = error;
		let { url, method, data } = config;
		// let { _response, status } = request;
		// let { data, status: status2 } = response;
		console.log(
			'<< response error' +
			`\n<< ${method} url: ${url}` +
			`\n<< ${error}`
		);

		if (OnParseError) {
			error.message = OnParseError(error);
		} else {
			error.message = "Request is failed, please try again later."
		}
		showMessage(error.message);

		return Promise.reject(error.toString());
	}
);


function showMessage(message: string, title: ?string) {
	if (Platform.OS === 'android') {
		ToastAndroid.show(message, ToastAndroid.LONG);
	} else {
		Alert.alert(
			title,
			message,
			[{ text: 'OK' }],
			{ cancelable: true }
		);
	}
}

function getAxiosSource() {
	let CancelToken = Axios.CancelToken;
	return CancelToken.source();
}

function AxiosReport(config: AxiosRequestConfig, requestSource: CancelTokenSource, promise: AxiosPromise): AxiosPromise {
	if (config) {
		if (!config.cancelToken) {
			config.cancelToken = requestSource.token;
			promise.requestSrouce = requestSource;
		}
	} else {
		promise.requestSrouce = requestSource;
	}
	return promise;
}

let OnParseError;

const AxiosManager = {
	setErrorFunc: function(func){
		OnParseError = func
	},

	setBaseUrl: function (baseUrl: string) {
		Axios.defaults.baseURL = baseUrl;
	},

	setTimeout: function (timeout: number) {
		client.defaults.timeout = timeout;
	},

	request: function (config: AxiosRequestConfig): AxiosPromise {
		let requestSource = getAxiosSource();
		let promise = client.request(config ? config : { cancelToken: requestSource.token });
		return AxiosReport(config, requestSource, promise);
	},

	head: function (url: string, config?: AxiosRequestConfig): AxiosPromise {
		let requestSource = getAxiosSource();
		let promise = client.head(url, config ? config : { cancelToken: requestSource.token });
		return AxiosReport(config, requestSource, promise);
	},

	delete: function (url: string, config?: AxiosRequestConfig): AxiosPromise {
		let requestSource = getAxiosSource();
		let promise = client.delete(url, config ? config : { cancelToken: requestSource.token });
		return AxiosReport(config, requestSource, promise);
	},

	get: function (url: string, config?: AxiosRequestConfig): AxiosPromise {
		let requestSource = getAxiosSource();
		let promise = client.get(url, config ? config : { cancelToken: requestSource.token });
		return AxiosReport(config, requestSource, promise);
	},

	post: function (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		let requestSource = getAxiosSource();
		let promise = client.post(url, data, config ? config : { cancelToken: requestSource.token });
		return AxiosReport(config, requestSource, promise);
	},

	put: function (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		let requestSource = getAxiosSource();
		let promise = client.put(url, data, config ? config : { cancelToken: requestSource.token });
		return AxiosReport(config, requestSource, promise);
	},

	patch: function (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		let requestSource = getAxiosSource();
		let promise = client.patch(url, data, config ? config : { cancelToken: requestSource.token });
		return AxiosReport(config, requestSource, promise);
	},

};

export default AxiosManager;