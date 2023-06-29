import { useState } from "react";
import ArticleDataModal from "../Components/Articles/ArticleDataModal";
import { ArticleMenuItem } from "../Components/Articles/ArticleMenuItem";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks";
import { selectCurrentUser } from "../Store/UserSlice";
import { ClientPage } from "./ClientPage";
import InitiativesPage from "./InitiativesPage";
import UsersPage from "./UsersPage";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

export function DashboardPage()
{
const currentUser = useAppSelector(selectCurrentUser)!;
const companies = useAppSelector(selectAllCompanies);
const company = companies.find(c => c.id === currentUser.companyId)!;
const [isOpen, setIsOpen] = useState(false);

function HandleClose()
  {
    setIsOpen(false);
  }

    return (
        <>
        <div className="text-center text-2xl font-bold pt-4">Initiatives</div>
            <InitiativesPage></InitiativesPage>
            {currentUser?.isAdmin &&
        <><div className="text-center text-2xl font-bold pt-4">Users</div>
            <UsersPage></UsersPage></>}
            <Grid item md={12} sx={{ display: 'flex',
              justifyContent: 'self-center'
              }}> 
                <Button onClick={() => setIsOpen(true)}>Company Articles</Button>
            </Grid>
            <ArticleDataModal company={company} isOpen={isOpen} currentUser={currentUser} HandleClose={HandleClose} ></ArticleDataModal>

        {/* <div className="text-center text-2xl font-bold pt-4">Company Information</div>
            <ClientPage></ClientPage> */}
        </>
    )
}