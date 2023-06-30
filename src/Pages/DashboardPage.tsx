import { useState } from "react";
import ArticleDataModal from "../Components/Articles/ArticleDataModal";
import { selectAllCompanies } from "../Store/CompanySlice";
import { useAppSelector } from "../Store/Hooks";
import { selectCurrentUser } from "../Store/UserSlice";
import InitiativesPage from "./InitiativesPage";
import UsersPage from "./UsersPage";
import Button from "@mui/material/Button";
import FolderIcon from "@mui/icons-material/Folder";
import Grid from "@mui/material/Grid";
import { Divider } from "@mui/material";

export function DashboardPage()
{
const currentUser = useAppSelector(selectCurrentUser);
const companies = useAppSelector(selectAllCompanies);
const company = companies.find(c => c.id === currentUser?.companyId);
const [isOpen, setIsOpen] = useState(false);

function HandleClose()
  {
    setIsOpen(false);
  }

    return (
        <>
        <Grid container sx={{ display: 'flex',
              flexDirection: 'row',
              placeItems: 'center',
              p: 1,
              mt: 2,
              mb: 1,
              ml: 2,
              mr: 2,
              borderRadius: 1 }}>
            <Grid item md={12} sx={{ display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: 2,
                marginRight: 2
                }}> 
                <Button variant="contained" onClick={() => setIsOpen(true)}
                style={{outlineColor: 'blue'}} size="small" startIcon={<FolderIcon sx={{fontSize:"inherit"}}/>}>Company Articles</Button>
            </Grid>
        </Grid>
        <Grid container sx={{ display: 'flex',
              flexDirection: 'column',
              placeItems: 'center',
              p: 1,
              mt: 2,
              mb: 1,
              ml: 2,
              mr: 2,
              borderRadius: 1 }}>
             <Divider textAlign="center" sx={{width:'85%', color: "#21355B", fontSize: "1.4rem", fontWeight: "bold"}}>Initiatives</Divider>
                <Grid item sx={{ display: 'flex',
                    justifyContent: 'self-center',
                    marginBottom: 6
                    }}>
                        <InitiativesPage></InitiativesPage>
                    </Grid>

            {currentUser?.isAdmin &&
                <>                
                <Divider textAlign="center" sx={{width:'85%', color: "#21355B", fontSize: "1.4rem", fontWeight: "bold"}}>Users</Divider>
                    <Grid item sx={{
                    display: 'flex',
                    justifyContent: 'self-center',
                    marginBottom: 6
                }}>
                    <UsersPage></UsersPage>
                </Grid></>
                }
            </Grid>
        {currentUser && company &&
            <ArticleDataModal company={company} isOpen={isOpen} currentUser={currentUser} HandleClose={HandleClose} ></ArticleDataModal>     
        }
        </>
    )
}