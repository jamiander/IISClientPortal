import ProfileInitiativesTable from "../Components/ProfileInitiativesTable";
import ProfileTable from "../Components/ProfileTable";

export default function ProfilePage(){
  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-4">
        <p className="text-5xl py-[10px]">Profile</p>
      </div>
      <div className="col-span-4">
        <p className="text-3xl bg-[#2ed7c3] rounded h-[90%]">User Information</p>
      </div>
      <div className="col-span-4 py-[5px]">
        <ProfileTable/>
      </div>
      <div className="col-span-4">
        <p className="text-3xl bg-[#2ed7c3] rounded h-[90%]">Company Initiatives</p>
      </div>
      <div className="col-span-4 py-[5px]">
        <ProfileInitiativesTable/>
      </div>
    </div>
  )
}