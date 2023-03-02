import { Company } from "../../Store/CompanySlice";
import  Modal  from 'react-modal';
import { cancelButtonStyle, modalStyle, submitButtonStyle } from "../../Styles";
import { useState } from "react";

interface ThroughputModalProps{
    companyList:Company[],
    uploadIsOpen: boolean,
    setUploadIsOpen:(value:boolean)=>void,
}

export default function UploadThroughputModal(props:ThroughputModalProps){
    const fakeCompany : Company = {id: -1, name: "N/A", initiatives: []};
    const [selectedCompany, setSelectedCompany] = useState(fakeCompany);
     return(
        <Modal
        isOpen={props.uploadIsOpen}
        onRequestClose={()=>props.setUploadIsOpen(false)}
        style={{'content': {...modalStyle.content, 'width' : '25%'}}}
        appElement={document.getElementById('root') as HTMLElement}>
            <div className="space-y-5">
                <p className="text-3xl">Upload Throughput Data</p>

                <select onChange={(e)=>setSelectedCompany({...fakeCompany, name:(e.target as HTMLSelectElement).value})} className="outline rounded w-[200px] h-[40px]">
                    <option>Select Company</option>
                    {props.companyList.map((company,index)=>{
                        return(
                            <option key={index}>{company.name}</option>
                        )
                    })}
                </select>
                <select className="outline rounded w-[200px] h-[40px]">
                    <option>Select Initiative</option>
                    {props.companyList.find((e) => e.name === selectedCompany.name)?.initiatives.map((initiative,index)=>{
                        return(
                            <option key={index}>{initiative.title}</option>
                        )
                        
                    })}
                </select>
                <input type={'file'} accept={'.csv'}/>
                <div className='h-10'>
                    <button className={submitButtonStyle + ' mt-6'}>Submit</button> {/*submit button does nothing right now*/}
                    <button className={cancelButtonStyle} onClick={() => props.setUploadIsOpen(false)}>Close</button>
                </div>
                 
            </div>
        </Modal>
     )
}