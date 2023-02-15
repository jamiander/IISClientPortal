import { useAppSelector } from "../Store/Hooks"
import { selectCurrentUser } from "../Store/UserSlice"

export default function ProfilePage(){
  const user = useAppSelector(selectCurrentUser);
  return(
    <div className="m-[2%] grid grid-cols-4">
      <div className="col-span-4">
        <p className="text-5xl">Profile</p>
      </div>
      <div className="col-span-4">
      <table className="table-auto w-[100%] outline">
          <thead>
            <tr>
              <th>Company</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="outline"><p className="flex justify-center">{user?.companyId}</p></td>
              <td className="outline"><p className="flex justify-center">{user?.name}</p></td>
              <td className="outline"><p className="flex justify-center">{user?.email}</p></td>
              <td className="outline"><p className="flex justify-center">{user?.password}</p></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}