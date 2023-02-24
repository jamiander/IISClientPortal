import InitiativesTable from "../Components/Initiative/InitiativesTable";
import ProfileTable from "../Components/User/ProfileTable";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { selectCurrentUser } from "../Store/UserSlice";

export default function ProfilePage(){
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const companyList = useAppSelector(selectAllCompanies).filter((company) => company.id === currentUser?.companyId);

  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-4">
        <p className="text-5xl py-[10px]">Profile</p>
      </div>
      <div className="col-span-4 bg-[#2ed7c3] rounded-md p-2 pl-5 my-2">
        <p className="text-3xl h-[90%]">User Information</p>
      </div>
      <div className="col-span-4 py-[5px]">
        <ProfileTable/>
      </div>
      <div className="col-span-4 bg-[#2ed7c3] rounded-md p-2 pl-5 my-2">
        <p className="text-3xl h-[90%]">Company Initiatives</p>
      </div>
      <div className="col-span-4 py-[5px]">
        <InitiativesTable companyList={companyList} radioStatus={'active'}/>
      </div>
    </div>
  )
}