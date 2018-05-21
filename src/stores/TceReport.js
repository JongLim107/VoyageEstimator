import { observable, action, computed, autorun } from 'mobx';
import { MyFormatting, MyParseInt, MyParseFloat } from '../utility/ValueChecker';
import { TceParams } from './TceParams';

let JLLog = (msg) => {
    if (typeof str == 'string') {
        console.log(`>> TceReport.js << ${msg}`);
    } else {
        console.log(`>> TceReport.js << ${JSON.stringify(msg)}`);
    }
}

export const TceReport = observable({
    TotalFreight: '0',
    TotalVoyageDays: '0',
    TotalProfitLoss: '0',
    NetEarningPerDay: '0',

    CharterHireCost: '0',
    BunkerCost: '0',
    VoyageRelatedCost: '0',

    TotalOtherCost: '0',

    FreightPerUnit: '0',
});

export const TceDays = observable({
    Ballast: 0,
    Laden: 0,
    Work: 0,
    Idle: 0,
    get total() {
        let sum = TceDays.Ballast + TceDays.Laden + TceDays.Work + TceDays.Idle;
        return parseFloat(sum.toFixed(2));
    },
});

export const TceCalculate = action(() => {
    let ballast = 0, laden = 0, work = 0, idle = 0;
    if (TceParams.PortDtls !== undefined && TceParams.PortDtls.length > 1) {
        TceParams.PortDtls.map(function (item, key) {
            if (key < TceParams.PortDtls.length - 1) {
                ballast += item.LegType === 'Laden' ? 0 : (!item.VoyageDays ? 0 : item.VoyageDays);
                laden += item.LegType === 'Laden' ? (!item.VoyageDays ? 0 : item.VoyageDays) : 0;
            }
            work += item.PortDaysWork;
            idle += item.PortDaysIdle;
        });
    }

    TceDays.Ballast = parseInt(ballast.toFixed(1) * 10) / 10;
    TceDays.Laden = parseInt(laden.toFixed(1) * 10) / 10;
    TceDays.Work = parseInt(work * 10) / 10;
    TceDays.Idle = parseInt(idle * 10) / 10;
    
    let foil = ( (parseInt(TceParams.Ballast * 10) * parseInt(TceDays.Ballast * 10)) +
        (parseInt(TceParams.Laden * 10) * parseInt(TceDays.Laden * 10)) +
        (parseInt(TceParams.fWork * 10) * parseInt(TceDays.Work * 10)) +
        (parseInt(TceParams.fIdle * 10) * parseInt(TceDays.Idle * 10)) 
    ) * parseInt(MyParseFloat(TceParams.FOUnitPrice) * 100);

    let AtSea = parseInt(TceDays.Ballast * 10) + parseInt(TceDays.Laden * 10);

    let doil = ( (parseInt(TceParams.AtSea * 10) * AtSea) +
        (parseInt(TceParams.dWork * 10) * parseInt(TceDays.Work*10)) +
        (parseInt(TceParams.dIdle * 10) * parseInt(TceDays.Idle*10))
        ) * parseInt(MyParseFloat(TceParams.DOUnitPrice) * 100);

    let bc = (foil + doil) / 10000;
    TceReport.BunkerCost = (bc && !isNaN(bc)) ? MyFormatting(bc, 2) : '0';

    let sum = parseInt(TceDays.total*10) * MyParseInt(TceParams.DailyHireRate) / 10;
    TceReport.CharterHireCost = (sum && !isNaN(sum)) ? MyFormatting(sum, 2) : '0';

    let num = parseInt(MyParseFloat(TceParams.perUnit)*100) * MyParseInt(TceParams.CargoQty) / 100;
    TceReport.TotalFreight = (num && !isNaN(num)) ? MyFormatting(num, 2) : '0';
})

export const TceParseReport = action((ret) => {
    TceReport.TotalFreight = (ret.TotalFreight && !isNaN(ret.TotalFreight)) ? MyFormatting(ret.TotalFreight, 2) : '0';
    TceReport.TotalVoyageDays = (ret.TotalVoyageDays && !isNaN(ret.TotalVoyageDays)) ? MyFormatting(ret.TotalVoyageDays, 1) : '0';
    TceReport.TotalProfitLoss = (ret.TotalProfitLoss && !isNaN(ret.TotalProfitLoss)) ? MyFormatting(ret.TotalProfitLoss, 2) : '0';
    TceReport.NetEarningPerDay = (ret.NetEarningPerDay && !isNaN(ret.NetEarningPerDay)) ? MyFormatting(ret.NetEarningPerDay, 2) : '0';

    TceReport.CharterHireCost = (ret.CharterHireCost && !isNaN(ret.CharterHireCost)) ? MyFormatting(ret.CharterHireCost, 2) : '0';
    TceReport.BunkerCost = (ret.BunkerCost && !isNaN(ret.BunkerCost)) ? MyFormatting(ret.BunkerCost, 2) : '0';
    TceReport.VoyageRelatedCost = (ret.VoyageRelatedCost && !isNaN(ret.VoyageRelatedCost)) ? MyFormatting(ret.VoyageRelatedCost, 2) : '0';
    TceReport.TotalOtherCost = (ret.TotalCost && !isNaN(ret.TotalCost)) ? MyFormatting(ret.TotalCost, 2) : '0';
    
    TceReport.FreightPerUnit = (ret.FreightPerUnit && !isNaN(ret.FreightPerUnit)) ? MyFormatting(ret.FreightPerUnit, 2) : '0';
    JLLog({ TceReport });
})
