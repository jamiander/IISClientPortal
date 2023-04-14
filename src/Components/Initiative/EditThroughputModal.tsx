import Modal from "react-modal";
import { useEffect, useState } from "react";
import { DateInfo, FindItemsRemaining, ThroughputData } from "../../Services/CompanyService";
import { Company, Initiative } from "../../Store/CompanySlice";
import { cancelButtonStyle, modalStyle, submitButtonStyle } from "../../Styles";
import { EditUserModalIds } from "../User/UpdateUserListModal";
import { MakeDateString } from "../DateInput";

export const EditThroughputIds = {
    modal: "editThroughputModal",
    selectCompany: "editThroughputCompanySelect",
    selectInitiative: "editThroughputInititia",
    submitButton: "editThroughputSubmitButton",
    closeButton: "editThroughputCloseButton",
    date: "editThroughputDate",
    itemsComplete: "editThroughputItemsComplete"
  }
  
  interface ThroughputModalProps{
    companyList: Company[],
    editIsOpen: boolean,
    setEditIsOpen: (value: boolean) => void,
    Submit: (companyId: number, initiativeId: number, dataList: ThroughputData[], emptyDataCheck: boolean) => void
  }

export default function EditThroughputModal(this: any, props: ThroughputModalProps){
    const [selectedCompany, setSelectedCompany] = useState<Company>();
    const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(-1);
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

  function GetInitiativeFromCompany(company: Company | undefined, initiativeIndex: number) : Initiative | undefined
  {
    let initiatives = company?.initiatives.at(initiativeIndex);
    return initiatives;
  }
    
  function EditDate(key: number, dateString: string)
  {
    var splitDate = dateString.split("-");
    var selectedCompanyClone = JSON.parse(JSON.stringify(selectedCompany));
    var changeThroughput = GetInitiativeFromCompany(selectedCompanyClone,selectedInitiativeIndex)?.itemsCompletedOnDate.at(key);
    if (changeThroughput)
    {
      changeThroughput.date.day = parseInt(splitDate[2]);
      changeThroughput.date.month = parseInt(splitDate[1]);
      changeThroughput.date.year = parseInt(splitDate[0]);

      setSelectedCompany(selectedCompanyClone);
    }
  }

  function EditItems(key: number, newItems: string)
  {
    var selectedCompanyClone = JSON.parse(JSON.stringify(selectedCompany));
    var changeThroughput = GetInitiativeFromCompany(selectedCompanyClone,selectedInitiativeIndex)?.itemsCompletedOnDate.at(key);
    if (changeThroughput)
    {
      changeThroughput.itemsCompleted = parseInt(newItems);

      setSelectedCompany(selectedCompanyClone);
    }
  }

  return(
    <Modal
        id={EditThroughputIds.modal}
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
          {selectedInitiativeIndex >= 0 && <p className="p-2">Items Remaining: {FindItemsRemaining(selectedCompany?.initiatives.at(selectedInitiativeIndex))}</p>}
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
                    {(selectedInitiativeIndex >= 0) && selectedCompany?.initiatives.at(selectedInitiativeIndex)?.itemsCompletedOnDate.map((throughput, key) => {
                        return (
                        <tr key={key}>
                            <td>
                                <input id={EditThroughputIds.date} type="date" value={MakeDateString(throughput.date)} 
                                onChange={(e) => EditDate(key, e.target.value)}/>                              
                            </td>
                            <td>
                                <input id={EditThroughputIds.itemsComplete} type="number" min="0" value={throughput.itemsCompleted} onChange={(e) =>EditItems(key, e.target.value)}/>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <div className="h-10 w-full">
          <button id={EditThroughputIds.submitButton} className={submitButtonStyle} onClick={() => props.Submit(selectedCompany?.id ?? -1, selectedCompany?.initiatives[selectedInitiativeIndex]?.id ?? -1, GetInitiativeFromCompany(selectedCompany,selectedInitiativeIndex)?.itemsCompletedOnDate ?? [], false)}>Submit</button>
          <button id={EditThroughputIds.closeButton} className={cancelButtonStyle} onClick={() => props.setEditIsOpen(false)}>Close</button>
        </div>
    </div>
    </Modal>
  )
}
