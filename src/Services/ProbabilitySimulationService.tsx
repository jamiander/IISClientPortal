import { DateInfo, ThroughputData } from "./CompanyService";

export function Simulation(targetDate: Date, itemsRemaining: number, historicalData: ThroughputData[])
{
    if (historicalData.length === 0) return 0;
    var endDates: Date[] = [];
    for (var i = 0; i < 10000; i++)
    {
        var incompleteItems = itemsRemaining;
        var days = 0;
        while (incompleteItems > 0)
        {
            var index = Math.floor(Math.random() * historicalData.length);
            var items = historicalData[index].itemsCompleted;
            incompleteItems -= items;
            days ++;
            if (days > 100) break;
        }
        var endDate = addDays(days);
        console.log("days   " + days);
        endDates.push(endDate);
    }
    var successDates =  endDates.filter((date) => date <= targetDate);
    
    return ((successDates.length/endDates.length) * 100).toFixed();
}

function addDays(days: number) {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }



