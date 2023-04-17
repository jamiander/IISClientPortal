import InitiativesTable from "../Components/Initiative/InitiativesTable";
import ProfileInfoDisplay from "../Components/User/ProfileInfoDisplay";
import ValidateNewInitiative from "../Services/Validation";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks";
import { selectCurrentUser } from "../Store/UserSlice";

export default function ProfilePage(){
  const currentUser = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies).filter((company) => company.id === currentUser?.companyId);

  return(
    <div className="grid grid-cols-4 p-5">
      <div className="col-span-3 mr-5">
        <div className="h-fit mb-4 bg-[#2ed7c3] rounded-md py-4 pl-5">
          <p className="text-5xl font-bold">Profile</p>
        </div>
        <div className="col-span-3 bg-[#445362] rounded-md p-2 pl-5">
          <p className="text-3xl text-white h-[90%]">Company Initiatives</p>
        </div>
        <div className="col-span-3 py-1 flex justify-center mt-2">
          <InitiativesTable companyList={companyList} radioStatus={'active'} ValidateInitiative={ValidateNewInitiative} admin={false}/>
        </div>
      </div>

      <div className="col-span-1 bg-[#445362] rounded-md p-5 h-fit text-white min-h-fit min-w-fit">
        <p className="text-3xl text-center">User Info</p>
        <ProfileInfoDisplay/>
      </div>

    </div>
  )
}