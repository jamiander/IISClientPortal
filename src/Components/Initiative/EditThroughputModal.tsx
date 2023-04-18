import Modal from "react-modal";
import { useEffect, useState } from "react";
import { ThroughputData } from "../../Services/CompanyService";
import { Company, Initiative } from "../../Store/CompanySlice";
import { cancelButtonStyle, modalStyle, submitButtonStyle } from "../../Styles";
import SelectCompanyAndInitiative from "./SelectCompanyAndInitiative";
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
    
  useEffect(() => {
    setSelectedCompany(undefined);
    setSelectedInitiativeIndex(-1);
  },[props.editIsOpen])

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

        <SelectCompanyAndInitiative companyList={props.companyList} selectedCompany={selectedCompany}  selectedInitiativeIndex={selectedInitiativeIndex} setSelectedCompany={setSelectedCompany} setSelectedInitiativeIndex={setSelectedInitiativeIndex}></SelectCompanyAndInitiative>
        <div>
            <table className="table-auto w-full outline outline-3 rounded-md bg-white">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Items Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {(selectedInitiativeIndex >= 0) && selectedCompany?.initiatives.at(selectedInitiativeIndex)?.itemsCompletedOnDate.map((throughput, key) => {
                        return (
                        <tr key={key} className="odd:bg-gray-100">
                            <td className="border border-spacing-x-0 border-y-gray-700 focus-within:bg-gray-200 hover:bg-gray-200">
                                <input className="px-2 w-full bg-inherit focus:outline-none" id={EditThroughputIds.date} type="date" value={MakeDateString(throughput.date)} 
                                onChange={(e) => EditDate(key, e.target.value)}/>                        
                            </td>
                            <td className="border border-spacing-x-0 border-y-gray-700 focus-within:bg-gray-200 hover:bg-gray-200">
                                <input className="px-2 w-full bg-inherit focus:outline-none" id={EditThroughputIds.itemsComplete} type="number" min="0" value={throughput.itemsCompleted}
                                onChange={(e) =>EditItems(key, e.target.value)}/>
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
    </Modal>
  )
}
