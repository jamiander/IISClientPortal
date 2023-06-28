import { useAppSelector } from "../Store/Hooks";
import { selectCurrentUser } from "../Store/UserSlice";
import { ClientPage } from "./ClientPage";
import InitiativesPage from "./InitiativesPage";
import UsersPage from "./UsersPage";

export function DashboardPage()
{
const currentUser = useAppSelector(selectCurrentUser);

    return (
        <>
        <div className="text-center text-2xl font-bold pt-4">Initiatives</div>
            <InitiativesPage></InitiativesPage>
            {currentUser?.isAdmin &&
        <><div className="text-center text-2xl font-bold pt-4">Users</div>
            <UsersPage></UsersPage></>}
        <div className="text-center text-2xl font-bold pt-4">Company Information</div>
            <ClientPage></ClientPage>
        </>
    )
}