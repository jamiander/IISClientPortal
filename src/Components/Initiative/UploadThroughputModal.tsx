import { Company } from "../../Store/CompanySlice";
import  Modal  from 'react-modal';
import { cancelButtonStyle, modalStyle, submitButtonStyle } from "../../Styles";

interface ThroughputModalProps{
    companyList:Company[],
    uploadIsOpen: boolean,
    setUploadIsOpen:(value:boolean)=>void,
}

export default function UploadThroughputModal(props:ThroughputModalProps){
     return(
        <Modal
        isOpen={props.uploadIsOpen}
        onRequestClose={()=>props.setUploadIsOpen(false)}
        style={{'content': {...modalStyle.content, 'width' : '25%'}}}
        appElement={document.getElementById('root') as HTMLElement}>
            <p className="text-3xl">Upload Throughput Data</p>
            <input type={'file'} accept={'.csv'}/>
            <button className={submitButtonStyle + ' mt-6'}>
                Submit
            </button> {/*submit button does nothing right now*/}
            <button className={cancelButtonStyle} onClick={() => props.setUploadIsOpen(false)}>Close</button> 
        </Modal>
     )
}