import { CompareDateInfos, EqualDateInfos, MakeDate } from "../Components/DateInput";
import { Initiative } from "../Store/CompanySlice";
import { DateInfo, ThroughputData } from "./CompanyService";

interface MaybeProbability {
  value: number | undefined
  status: string
}

export function GenerateProbability(initiative: Initiative, itemsRemaining: number) : MaybeProbability
{
  if(initiative.itemsCompletedOnDate.length === 0)
    return { value: undefined, status: "No data available to calculate probability" };
  
  if (initiative.itemsCompletedOnDate.every(item => item.itemsCompleted === 0))
    return { value: undefined, status: "No data available to calculate probability" };

  let throughput = AddZeroEntries(initiative);

  return { value: Simulation(MakeDate(initiative.targetDate), itemsRemaining, throughput), status: "" };
}

function Simulation(targetDate: Date, itemsRemaining: number, historicalData: ThroughputData[]) : number
{
  let endDates: Date[] = [];
  let today = new Date();
  today.setHours(0,0,0,0);      //remove timestamp for comparison reasons, as the dateInfos don't use timestamps

  for (let i = 0; i < 10000; i++)
  {
    let incompleteItems = itemsRemaining;
    let days = 0;
    while (incompleteItems > 0)
    {
      let index = Math.floor(Math.random() * historicalData.length);
      let items = historicalData[index].itemsCompleted;
      incompleteItems = incompleteItems - items;
      days ++;
    }
    let endDate = AddDays(today,days);
    endDates.push(endDate);
  }
      
  let successDates = endDates.filter(function (date) {
    return date <= targetDate});
  
  let probability = Math.round((successDates.length/endDates.length) * 100);
    if (probability === 100)
      return 99;
    else
      return probability;
}

function AddDays(date: Date, days: number)
{
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function AddZeroEntries(initiative: Initiative) : ThroughputData[]
{
  let throughput: ThroughputData[] = JSON.parse(JSON.stringify(initiative.itemsCompletedOnDate)).sort((a:ThroughputData, b:ThroughputData) => CompareDateInfos(a.date,b.date));
  let startDate = initiative.startDate;
  let lastThroughput: ThroughputData = JSON.parse(JSON.stringify(throughput.at(-1)));
  let endDate = MakeDate(lastThroughput.date);
  if(CompareDateInfos(throughput[0].date,startDate) === -1)
    startDate = JSON.parse(JSON.stringify(throughput[0].date));

  let currentDate = MakeDate(startDate);
  let lastDateIndex = 0;
  while(currentDate.getTime() < endDate.getTime())
  {
    let currentDateInfo: DateInfo = {day: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear()};
    let foundDate = false;
    for(let i = lastDateIndex; i < throughput.length; i++)
    {
      let data = throughput[i];
      if(EqualDateInfos(currentDateInfo,data.date))
      {
        foundDate = true;
        lastDateIndex = i;
        break;
      }
    }
    if(!foundDate)
      throughput.push({date: currentDateInfo, itemsCompleted: 0});
    
    currentDate = AddDays(currentDate,1);
  }

  return throughput;
}