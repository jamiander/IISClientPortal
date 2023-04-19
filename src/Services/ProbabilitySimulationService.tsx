import { MakeDateString } from "../Components/DateInput";
import { Initiative } from "../Store/CompanySlice";
import { ThroughputData } from "./CompanyService";

export function GenerateProbability(initiative: Initiative, itemsRemaining: number)
  {
    if(initiative.itemsCompletedOnDate.length > 0)
    {
      if (initiative.itemsCompletedOnDate.every(item => item.itemsCompleted === 0)) return;
      else {
        console.log(initiative.itemsCompletedOnDate);
        return Simulation(new Date(MakeDateString(initiative.targetDate)), itemsRemaining, initiative.itemsCompletedOnDate)
      };
    }

    function Simulation(targetDate: Date, itemsRemaining: number, historicalData: ThroughputData[])
    {
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
            }
            var endDate = addDays(days);
            endDates.push(endDate);
        }
        
        var successDates =  endDates.filter(function (date) {
            return date <= targetDate});
        
        var probability =  Math.round((successDates.length/endDates.length) * 100);
            if (probability === 100) return 99;
            else return probability;

        function addDays(days: number) {
            var result = new Date();
            result.setDate(result.getDate() + days);
            return result;
        }
    }
}



