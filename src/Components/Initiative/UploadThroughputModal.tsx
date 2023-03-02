import { Company, Initiative } from "../../Store/CompanySlice";
import  Modal  from 'react-modal';
import { cancelButtonStyle, modalStyle, submitButtonStyle } from "../../Styles";
import { useRef, useState } from "react";
import { ThroughputData } from "../../Services/CompanyService";

interface ThroughputModalProps{
  companyList:Company[],
  uploadIsOpen: boolean,
  setUploadIsOpen:(value:boolean)=>void,
  Submit: (companyId: number, initiativeId: number, dataList: ThroughputData[]) => void
}

export default function UploadThroughputModal(props:ThroughputModalProps){;
  const [selectedCompany, setSelectedCompany] = useState<Company>();
  const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(-1);

  function SelectCompany(companyId: number)
  {
    setSelectedCompany(props.companyList[companyId]);
    setSelectedInitiativeIndex(-1);
  }

  function SelectInitiative(initiativeIndex: number)
  {
    if(selectedCompany)
    {
      setSelectedInitiativeIndex(initiativeIndex);
    }
  }

  return(
    <Modal
    isOpen={props.uploadIsOpen}
    onRequestClose={()=>props.setUploadIsOpen(false)}
    style={{'content': {...modalStyle.content, 'width' : '25%', 'height' : '25%'}}}
    appElement={document.getElementById('root') as HTMLElement}>
      <div className="flex flex-wrap space-y-5">
        <p className="text-3xl">Upload Throughput Data</p>

        <select onChange={(e)=>SelectCompany(parseInt((e.target as HTMLSelectElement).value))} className="outline rounded w-[200px] h-[40px]">
        <option>Select Company</option>
          {props.companyList.map((company,index)=>{
            return(
              <option value={company.id} key={index}>{company.name}</option>
            )
          })}
        </select>
        <select value={selectedInitiativeIndex} onChange={(e)=>SelectInitiative(parseInt((e.target as HTMLSelectElement).value))} className="outline rounded w-[200px] h-[40px]">
          <option>Select Initiative</option>
          {selectedCompany?.initiatives.map((initiative,index)=>{
            return(
              <option value={index} key={index}>{initiative.title}</option>
            )
          })}
        </select>
        <input type={'file'} accept={'.csv'}/>
        <div className='w-full flex justify-end h-10'>
          <button className={submitButtonStyle} onClick={() => props.Submit(selectedCompany?.id ?? -1, selectedCompany?.initiatives[selectedInitiativeIndex].id ?? -1, [])}>Submit</button> {/*submit button does nothing right now*/}
          <button className={cancelButtonStyle} onClick={() => props.setUploadIsOpen(false)}>Close</button>
        </div>
    </div>
    </Modal>
  )
}