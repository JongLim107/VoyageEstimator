import {observable, action, computed, autorun, toJS} from 'mobx'
import { TceParams } from './TceParams';

let JLLog = (msg) => {
    console.log(`>> PortListStore.js << ${msg}`);
}

/**
 * Actually this one also use in FreightScreen, so this list format need to follow that one
 */
export class PortBean {

    @observable Port = '';
    @observable name = '';
    @observable Location = [];
    @observable PortDaysWork = 0;
    @observable PortDaysIdle = 0;
    @observable LegType = '';       // Use in TCE also
    @observable VoyageDays = 0;     // Use in TCE also
    @observable Speed = 0;     // Use in TCE also
    
    key = '0';
    Distance = '0';       // Only use in TCE
    @observable PortCharges = 0;    // Only use in TCE
    @observable chFalse = false;    // Only use in TCE

    constructor(js) {
        if (js) {
            this.key = js.key;
            this.Port = js.Port ? js.Port : '';
            this.name = js.name ? js.name : '';
            this.Location = js.Location;
            this.PortDaysWork = js.PortDaysWork ? js.PortDaysWork : 0;
            this.PortDaysIdle = js.PortDaysIdle ? js.PortDaysIdle : 0;
            this.LegType = js.LegType ? js.LegType : 'Ballast';
            this.VoyageDays = js.VoyageDays ? js.VoyageDays : 0;
            this.PortCharges = js.PortCharges ? js.PortCharges : 0;
            this.Speed = js.Speed ? js.Speed : 12.5;
            this.Distance = js.Distance ? js.Distance : 0;
        }
    }

    @action setName = (newValue) => {
        this.Port = newValue;
        this.name = newValue;
    }
    @action setLocation = (newValue) => {
        this.Location = newValue;
    }
    @action setWorkDay = (newValue) => {
        this.PortDaysWork = parseFloat(newValue);
    }

    @action setIdleDay = (newValue) => {
        this.PortDaysIdle = parseFloat(newValue);
    }
    @action setLegType = (newValue) => {
        this.LegType = newValue;
    }
    @action calTravelDay = (dis, speed) => {
        let day = (dis/speed/24).toFixed(1);
        let day10 = parseFloat(day) * 10;
        this.VoyageDays = parseInt(day10) / 10;
    }
}

const Ports = observable([]);

const savePorts = action((newPorts) => {
    Ports.replace(newPorts);
    TceParams.PortDtls.clear();
    TceParams.PortDtls.replace(Ports.peek());
});

const setPortName = (value, charge, index) => {
    Ports[index].Port = value;
    Ports[index].PortCharges = charge;
    JLLog(Ports[index]);
}

const PickerLegType = [
    {label: "Ballast", value: 'Ballast'},
    {label: "Laden", value: 'Laden'}
]

/** Template source , will replace by network response */
const Days = [
    {label: "0 Days", value: '0'},
    {label: "0.5 Days", value: '0.5'},
    {label: "1 Days", value: '1'},
    {label: "1.5 Days", value: '1.5'},
    {label: "2 Days", value: '2'},
    {label: "2.5 Days", value: '2.5'},
    {label: "3 Days", value: '3'},
    {label: "3.5 Days", value: '3.5'},
    {label: "4 Days", value: '4'},
    {label: "4.5 Days", value: '4.5'},
    {label: "5 Days", value: '5'},
    {label: "5.5 Days", value: '5.5'},
    {label: "6 Days", value: '6'},
    {label: "6.5 Days", value: '6.5'},
    {label: "7 Days", value: '7'},
    {label: "7.5 Days", value: '7.5'},
    {label: "8 Days", value: '8'},
    {label: "8.5 Days", value: '8.5'},
    {label: "9 Days", value: '9'},
    {label: "9.5 Days", value: '9.5'},
    {label: "10 Days", value: '10'},
    {label: "10.5 Days", value: '10.5'},
    {label: "11 Days", value: '11'},
    {label: "11.5 Days", value: '11.5'},
    {label: "12 Days", value: '12'},
    {label: "12.5 Days", value: '12.5'},
    {label: "13 Days", value: '13'},
    {label: "13.5 Days", value: '13.5'},
    {label: "14 Days", value: '14'},
    {label: "14.5 Days", value: '14.5'},
    {label: "15 Days", value: '15'},
    {label: "15.5 Days", value: '15.5'},
    {label: "16 Days", value: '16'},
    {label: "16.5 Days", value: '16.5'},
    {label: "17 Days", value: '17'},
    {label: "17.5 Days", value: '17.5'},
    {label: "18 Days", value: '18'},
    {label: "18.5 Days", value: '18.5'},
    {label: "19 Days", value: '19'},
    {label: "19.5 Days", value: '19.5'},
    {label: "20 Days", value: '20'}
]

const distancePort = observable.array([
    {
        "countrycode": "JPCHB",
        "name": "Chiba",
        "lat": "35.591667175292969",
        "lon": "140.08500671386719"
    }, {
        "countrycode": "DKCPH",
        "name": "Copenhagen",
        "lat": "55.7066650390625",
        "lon": "12.608333587646484",
    }, {
        "countrycode": "USLO8",
        "name": "LOOP Terminal",
        "lat": "28.809999465942383",
        "lon": " -89.881668090820312"
    }
]);

export default {
    Ports,
    setPortName,
    PickerLegType,
    Days,
    distancePort,
    savePorts,
};

//Mock data
export const PortSource = [
    new PortBean({
        Port: "Chiba Try A Very Long Name",
        name: "Chiba",
        PortDaysIdle: 1,
        PortDaysWork: 1,
        LegType: "Ballast",
        VoyageDays: 7,
        Speed: 20,
        key: '1',
        Distance: 3360,
        PortCharges: 7000,
        Demurrage: 0,
        Despatch: 0,
        SeaDaysTotal: 0,
        PortDaysTotal: 0,
        Location: [35.591667175292969, 140.08500671386719]
    }),
    new PortBean({
        Port: "Copenhagen",
        name: "Copenhagen",
        PortDaysIdle: 1,
        PortDaysWork: 1,
        LegType: "Laden",
        VoyageDays: 15,
        Speed: 15,
        key: '1',
        Distance: 5400,
        PortCharges: 8000,
        Demurrage: 0,
        Despatch: 0,
        SeaDaysTotal: 0,
        PortDaysTotal: 0,
        Location: [55.7066650390625, 12.608333587646484]
    }),
    new PortBean({
        Port: "Loop Terminal",
        name: "Loop Terminal",
        PortDaysIdle: 1,
        PortDaysWork: 1,
        LegType: "Laden",
        VoyageDays: 25,
        Speed: 12,
        key: '1',
        Distance: 7200,
        PortCharges: 5600,
        Demurrage: 0,
        Despatch: 0,
        SeaDaysTotal: 0,
        PortDaysTotal: 0,
        Location: [28.809999465942383, -89.881668090820312],
    })
];

export const SelectedLegType = {
    item: {}
}
export const SelectedIdleDay = {
    item: {}
}
export const SelectedWorkDay = {
    item: {}
}
