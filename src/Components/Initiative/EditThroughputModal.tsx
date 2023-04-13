import Modal from "react-modal";
import { Fragment, useEffect, useState } from "react";
import { DateInfo, FindItemsRemaining, ThroughputData } from "../../Services/CompanyService";
import { Company, Initiative } from "../../Store/CompanySlice";
import { cancelButtonStyle, modalStyle } from "../../Styles";

export const EditThroughputIds = {
    selectCompany: "selectCompanyInThroughputModal",
    selectInitiative: "selectInitiativeInThroughputModal",
    manualSubmit: "submitThroughputAsSingleEntry",
    date: {
      month: "uploadModalMonth",
      day: "uploadModalDay",
      year: "uploadModalYear"
    },
    itemsComplete: "uploadModalComplete"
  }
  
  interface ThroughputModalProps{
    companyList: Company[],
    editIsOpen: boolean,
    setEditIsOpen: (value: boolean) => void,
    Submit: (companyId: number, initiativeId: number, dataList: ThroughputData[]) => void
  }

  export function addLeadingZero(num: number){
    return ((num < 10) ? "0" : "") + num.toString();
  }

export default function EditThroughputModal(this: any, props:ThroughputModalProps){;
    const [selectedCompany, setSelectedCompany] = useState<Company>();
    const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(-1);
    const emptyDate: DateInfo = {month: 0, day: 0, year: 0};
    const fakeEntry: ThroughputData[] = [{date:emptyDate,itemsCompleted:0}];
    const fakeInit: Initiative = {id:-1, title:'', targetDate:emptyDate, totalItems:0, itemsCompletedOnDate:fakeEntry};
    const tableDataStyle = "outline outline-1 text-center ";
    
  useEffect(() => {
    setSelectedCompany(undefined);
    setSelectedInitiativeIndex(-1);
  },[props.editIsOpen])

  function SelectCompany(companyId: number)
  {
    setSelectedCompany(props.companyList.find(company => company.id === companyId));
    setSelectedInitiativeIndex(-1);
  }

  function SelectInitiative(initiativeIndex: number)
  {
    if(selectedCompany)
    {
      if(selectedCompany.initiatives[initiativeIndex])
        setSelectedInitiativeIndex(initiativeIndex);
      else
        setSelectedInitiativeIndex(-1);
    }
  }

    
  function EditDate(key: number, e: string)
  {
    var date = e.split("-");
    var selectedCompanyClone = JSON.parse(JSON.stringify(selectedCompany));
    var changeThroughput = selectedCompanyClone?.initiatives?.at(selectedInitiativeIndex)?.itemsCompletedOnDate.at(key);
    if (changeThroughput != null)
    {
        changeThroughput.date.day = parseInt(date[2]);
        changeThroughput.date.month = parseInt(date[1]);
        changeThroughput.date.year = parseInt(date[0]);
    }

    setSelectedCompany(selectedCompanyClone);
    console.log(changeThroughput);
    console.log(selectedCompanyClone);
    console.log(selectedCompany);
  }

  function EditItems(key: number, e: string)
  {
    var selectedCompanyClone = JSON.parse(JSON.stringify(selectedCompany));
    var changeThroughput = selectedCompanyClone?.initiatives?.at(selectedInitiativeIndex)?.itemsCompletedOnDate.at(key);
    if (changeThroughput != null)
        changeThroughput.itemsCompleted = parseInt(e);

    setSelectedCompany(selectedCompanyClone);
    console.log(changeThroughput.itemsComplete);
    console.log(selectedCompanyClone);
  }

  return(
    <Modal
        isOpen={props.editIsOpen}
        onRequestClose={()=>props.setEditIsOpen(false)}
        style={{'content': {...modalStyle.content, 'width' : 'fit-content', 'height' : 'fit-content'}}}
        appElement={document.getElementById('root') as HTMLElement}>

      <div className="space-y-5">
        <p className="text-3xl w-full">Edit Throughput Data</p>
        <div className="space-x-5 flex w-full">
          <select id={EditThroughputIds.selectCompany} onChange={(e) => SelectCompany(parseInt((e.target as HTMLSelectElement).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Company</option>
              {props.companyList.map((company,index)=>{
                return(
                  <option value={company.id} key={index}>{company.name}</option>
                )
              })}
          </select>
          <select id={EditThroughputIds.selectInitiative} value={selectedInitiativeIndex} onChange={(e) => SelectInitiative(parseInt((e.target as HTMLSelectElement).value))} className="outline outline-1 rounded w-56 h-10">
            <option>Select Initiative</option>
              {selectedCompany?.initiatives.map((initiative,index)=>{
                return(
                  <option value={index} key={index}>{initiative.title}</option>
                )
              })}
          </select>
          {!selectedInitiativeIndex && <p className="p-2">Items Remaining: {FindItemsRemaining(selectedCompany?.initiatives.at(selectedInitiativeIndex) ?? fakeInit)}</p>}
        </div>
        <div>
            <table className="table-auto w-[98%] outline outline-3">
                <thead>
                    <tr>
                        <th className="w-8">Date</th>
                        <th>Items Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedCompany?.initiatives.at(selectedInitiativeIndex)?.itemsCompletedOnDate.map((throughput, key) => {
                        return (
                        <tr key={key}>
                            <td>
                                <input type="date" value={throughput.date.year + "-" + addLeadingZero(throughput.date.month) + "-" + addLeadingZero(throughput.date.day)} 
                                onChange={(e) => EditDate(key, (e.target.value))}/>                              
                            </td>
                            <td>
                                <input type="number" value={throughput.itemsCompleted} onChange={(e) =>EditItems(key, (e.target.value))}/>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <div className="h-10 w-full">
          <button className={cancelButtonStyle} onClick={() => props.setEditIsOpen(false)}>Close</button>
        </div>
    </div>
    </Modal>
  )
}
