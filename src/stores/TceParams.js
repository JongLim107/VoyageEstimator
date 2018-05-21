import { observable, action, computed, autorun, toJS, has } from 'mobx';
import { MyParseInt, MyParseFloat } from '../utility/ValueChecker';

let JLLog = (msg) => {
    if (typeof str == 'string') {
        console.log(`>> TceParams.js << ${msg}`);
    } else {
        console.log(`>> TceParams.js << ${JSON.stringify(msg)}`);
    }
}

export class TceBean {
    constructor(obj) {
        this.isMobile = true;
        this.VesselName = obj ? obj.VesselName : '';
        this.DailyHireRate = obj ? MyParseInt(obj.DailyHireRate) : 0;
        this.OilConsump = {
            FO: { // Fuel Oil
                Ballast: obj ? MyParseFloat(obj.Ballast) : 0,
                Laden: obj ? MyParseFloat(obj.Laden) : 0,
                Work: obj ? MyParseFloat(obj.fWork) : 0,
                Idle: obj ? MyParseFloat(obj.fIdle) : 0,
            },
            DO: {
                AtSea: obj ? MyParseFloat(obj.AtSea) : 0,
                Work: obj ? MyParseFloat(obj.dWork) : 0,
                Idle: obj ? MyParseFloat(obj.dIdle) : 0,
            }
        };
        this.Bunker = {
            FOUnitPrice: obj ? MyParseFloat(obj.FOUnitPrice) : 0,
            DOUnitPrice: obj ? MyParseFloat(obj.DOUnitPrice) : 0,
        };

        this.PortDtls = [];
        if(obj && obj.PortDtls){
            let str = JSON.stringify(obj.PortDtls); //系列化对象
            this.PortDtls = JSON.parse(str); //还原
            // this.PortDtls = obj.PortDtls.slice();
            // this.PortDtls = obj.PortDtls.concat();
            this.PortDtls.map(function (item, index) {
                if (item !== undefined && item.PortCharges !== undefined) {
                    item.PortCharges = MyParseInt(item.PortCharges);
                }
            });
        }        

        this.RelatedCost = {
            OtherCost: obj ? MyParseInt(obj.OtherCost) : 0,
            totalCommissionPer: obj ? MyParseFloat(obj.totalCommissionPer) : 0,
        };
        this.Freight = {
            FreightPerUnit: obj ? MyParseFloat(obj.perUnit) : 0,
            CargoQty: obj ? MyParseInt(obj.CargoQty) : 0,
        };
    }
}

export const TceParams = observable({
    VesselName: '',
    DailyHireRate: '',
    Ballast: '',
    Laden: '',
    fWork: '',
    fIdle: '',
    AtSea: '',
    dWork: '',
    dIdle: '',
    FOUnitPrice: '',
    DOUnitPrice: '',
    // Freight Screen.
    PortDtls: [],
    OtherCost: '0',
    totalCommissionPer: '0',
    perUnit: '',
    CargoQty: ''
});

export const TceEroArray = {
    /**
     * true mean that this property must be fill in valid data. 
     * And when all data equal to false then can call net work api.
     */
    marks: [
        true, // daily hire cost
        true, true, true, false, // FO MT/day
        true, true, false, // DO MT/day
        true, true, // bunker price
        false, false, // other cost
        true, true // freight
    ],
}

export const TceHasError = action(() => {
    // JLLog(TceEroArray);
    let hasError = false;
    for (let i = 0; i < TceEroArray.marks.length; i++) {
        hasError = TceEroArray.marks[i];
        if (hasError) break;
    }
    if (!hasError && TceParams.PortDtls.length > 0) {
        for (let j = 0; j < TceParams.PortDtls.length; j++) {
            if (TceParams.PortDtls[j].chFalse) {
                hasError = true;
                break;
            }
        }
    }
    return hasError;
});

export const TcePicker = observable({
    bkList: [],
    bkPort: '',
    bkFOLabel: '',
    selected: {},
});

const TceBunkerSrc = [];

/** Rebuild the port list format to match the Antd-Picker data format */
export const TceParseBunkerList = action((source) => {
    if (source !== undefined && source.constructor == Array) {
        let defKey = -1;
        TceBunkerSrc = source.slice(0);
        source.map(function (value, key) {
            let objKey = Object.keys(value);
            let HSFO180 = value[objKey[0]].HSFO180.price;
            let RMG380 = value[objKey[0]].RMG380.price;

            let childArray = [];
            if (RMG380 != null) {
                childArray.push({
                    label: 'RMG380',
                    value: 'RMG380',
                    children: [{ label: '$ ' + RMG380, value: '' + RMG380 }]
                })
            }
            if (HSFO180 != null) {
                childArray.push({
                    label: 'HSFO180',
                    value: 'HSFO180',
                    children: [{ label: '$ ' + HSFO180, value: '' + HSFO180 }]
                })
            }
            childArray.push({
                label: 'Other',
                value: 'Other',
                children: [{ label: '0', value: '0' }]
            })

            TcePicker.bkList.push({
                label: objKey[0],
                value: key.toString(),
                children: childArray
            })

            if (objKey[0].toUpperCase() === 'SINGAPORE') {
                defKey = key;
            }
        });

        if (defKey != -1) {
            TceOnSelectBunker([defKey.toString(), 'RMG380', '0.00']);
            TceEroArray.marks[8] = false;
            TceEroArray.marks[9] = false;
        }
    }
});

export const TceOnSelectBunker = action((data) => {
    // JLLog({ data })
    let value = TceBunkerSrc[parseInt(data[0])];
    if (value) {
        let objKey = Object.keys(value);
        // JLLog({objKey}); // >> ["label", "value", "children"]
        TcePicker.bkPort = objKey[0];
        TceParams.DOUnitPrice = value[objKey[0]].MGO.price

        let HSFO180 = value[objKey[0]].HSFO180.price
        let RMG380 = value[objKey[0]].RMG380.price
        if ((HSFO180 === null && RMG380 === null) || data[1] === 'Other') {
            TcePicker.bkFOLabel = 'Other';
            TceParams.FOUnitPrice = 0;
            TcePicker.selected = [data[0], "Other", "0"];
        } else {
            TcePicker.bkFOLabel = (data[1] == 'HSFO180') ? 'HSFO180' : 'RMG380';
            TceParams.FOUnitPrice = (data[1] == 'HSFO180') ? HSFO180 : RMG380;
            TcePicker.selected = [data[0], TcePicker.bkFOLabel, TceParams.FOUnitPrice.toString()];
        }
    } else {
        TcePicker.selected = data;
    }
});
