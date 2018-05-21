import AxiosManager from './AxiosManager'
import { TceBean, TceParseBunkerList } from '../stores/TceParams';
import { TceParseReport } from '../stores/TceReport';
import { CryptoMd5 } from '../utility/CryptoJS';
import PortList from "../stores/PortListStore";


let JLLog = (msg) => {
    if (typeof str == 'string') {
        console.log(`>> APIManager.js << ${msg}`);
    } else {
        console.log(`>> APIManager.js << ${JSON.stringify(msg)}`);
    }
}

const tce_url = "http://www.sit1.bwoilmarine.com/api";

const tce_data = "/voyage/api/tce/data";
const tce_bunker = "/voyage/api/reference/get-bunker-input";
const bunker_price = "/v1_0/price/get-bunker-price";
const ds_distance = "/distance/v1/calc";
const ds_port = "/mds/ports";

AxiosManager.setTimeout(6000);

AxiosManager.setErrorFunc((error) => {
    let { config, request, response } = error;
    let { _response, status } = request;
    let { data, status: status2 } = response;
    // JLLog({request});

    let { message, Message } = _response;
    if (message || Message) {
        // JLLog('Error msg1: ' + (message ? message : Message))
        return message ? message : Message;
    } else try {
        let { message, Message } = JSON.parse(_response);
        if (message || Message) {
            // JLLog('Error msg2: ' + (message ? message : Message))
            return message ? message : Message;
        }
    } catch (error) {
        // JLLog({_response});
    }

    if (status == 500) {
        return `Error: ${status}\nSorry. Internal server error`;
    } else if (status == 404) {
        return `Error: ${status}\nCan't find these property`;
    } else if (typeof status2 === 'number') {
        return 'Error code: ' + status2 + (data ? (', ' + data) : '');
    } else {
        return 'Error code: ' + status + (error ? (', ' + error) : '');
    }
})

const APIManager = {

    GetPortList: () => {
        AxiosManager.setBaseUrl(tce_url);
        return AxiosManager.get(ds_port)
            .then(function ({ data }) {
                // console.warn(`<< response data: ${JSON.stringify(data)}`);
                PortList.distancePort = data;
            })
            .catch(function (error) {
                console.warn(error);
            });
    },

    GetDistance: (addedPorts, ) => {
        AxiosManager.setBaseUrl(tce_url);
        return AxiosManager.post(ds_distance, { Ports: addedPorts, AntiPiracy: 'true' });
    },

    GetTceBunker: (wdlg) => {
        wdlg.show();
        JLLog('GetTceBunker');
        AxiosManager.setBaseUrl(tce_url);
        return AxiosManager.post(tce_bunker)
            .then(function ({ data }) {
                // console.log(`<< data: ${JSON.stringify(data)}`);
                return GetBunkerPrice(data, wdlg);
            })
            .catch(function (error) {
                // catch error that cause by code not by request.
                wdlg.dismiss();
                JLLog({ error })
            });
    },

    GetTceData: (params, wdlg) => {
        wdlg.show();
        AxiosManager.setBaseUrl(tce_url);
        return AxiosManager.post(tce_data, new TceBean(params))
            .then(function ({ data }) {
                wdlg.dismiss();
                // console.log(`<< data: ${JSON.stringify(data)}`);
                TceParseReport(data)
            })
            .catch(function (error) {
                // catch error that cause by code not by request.
                wdlg.dismiss();
                JLLog({ error })
            });
    }
}

function GetBunkerPrice(data, wdlg) {
    JLLog('GetBunkerPrice');
    // let date = new Date();
    // let time = date.getTime();
    // let md51 = CryptoMd5('yk46UBdySLSze55I' + time);

    var formData = new FormData();
    // formData.append("timestamp", time);
    // formData.append("verify", CryptoMd5(md51 + 'wHFOwhn.FLLA@I#Z'));
    // formData.append("platform", "marine-online");
    formData.append("timestamp", data.timestamp);
    formData.append("verify", data.verify);
    formData.append("platform", data.platform);

    AxiosManager.setBaseUrl('http://' + data.url);
    return AxiosManager.post(bunker_price, formData)
        .then(function ({ data }) {
            wdlg.dismiss();
            // console.log(`<< data: ${JSON.stringify(data)}`);
            if (data.code === 0) {
                TceParseBunkerList(data.info)
            }
        })
        .catch(function (error) {
            wdlg.dismiss();
        });
}

export default APIManager;
