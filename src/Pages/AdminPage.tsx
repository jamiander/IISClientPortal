import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManageClientDisplay from "../Components/ManageClientsDisplay";
import ManageInitiativesDisplay from "../Components/ManageInitiativesDisplay";
import { getCompanyInfo } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectCurrentUser } from "../Store/UserSlice";

export default function AdminPage(){
  const dispatch = useAppDispatch();
  //const [companyId, setCompanyId] = useState('');
  //const [companyModalIsOpen, setCompanyIsOpen] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  
  useEffect(() => {
    let kickThemOut = true;
    if(currentUser)
    {
      if(currentUser.companyId === 0)
      {
        kickThemOut = false;
      }
    }
    if(kickThemOut)
      navigate('/Login');
  }, [currentUser])


  /*function openCompanyModal(){
    setCompanyIsOpen(true);
  }
  function closeCompanyModal(){
    setCompanyIsOpen(false);
  }*/

  /*function ValidateCompany()
  {
    if(companyName)
      return true;
    return false;
  }

  function SubmitNewCompany()
  {
    let newCompany: Company = {
      id: -1,
      name: companyName,
    }
      
    let isTest = false;
    if((window as any).Cypress)
      isTest = true;
      
    console.log('cypress: ' + isTest)
  
    //dispatch(addCompany({company: newCompany, isTest: isTest}));
  
    setCompanyName('');
  
    closeCompanyModal();
  }*/

  useEffect(() => {
    dispatch(getCompanyInfo({})); //no args; admins get all companies/users
  },[])

  return(
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
    
      <div className="col-span-4 mb-4 h-fit">
        <p className="text-5xl">Admin Page</p>
      </div>
  
      <ManageClientDisplay />

      <ManageInitiativesDisplay />
      {/* <div className="col-span-3">
        <p className="text-3xl bg-[#2ed7c3] rounded my-1 h-[75%]">Companies</p>
      </div>
        
      <AddCompanyModal companyModalIsOpen={companyModalIsOpen} closeCompanyModal={closeCompanyModal} openCompanyModal={openCompanyModal} validateCompany={ValidateCompany} setCompanyName={setCompanyName} submitNewCompany={SubmitNewCompany} />
        
      <div className="col-span-4 py-[10px]">
        <CompaniesTable/>
      </div> */}
    </div>
  )
}