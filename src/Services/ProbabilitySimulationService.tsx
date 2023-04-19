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
            incompleteItems = incompleteItems - items;
            days ++;
            if (days > 100) break;
        }
        var endDate = addDays(days);
        endDates.push(endDate);
    }
    
    var successDates =  endDates.filter(function (date) {
        return date <= targetDate});
    
    return Math.round((successDates.length/endDates.length) * 100);

    function addDays(days: number) {
        var result = new Date();
        result.setDate(result.getDate() + days);
        return result;
    }
}



