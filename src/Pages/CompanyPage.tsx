import { Fragment, useEffect } from "react";
import { selectAllCompanies } from "../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { Card, CardActions, CardContent, CardHeader, Grid } from "@mui/material";
import { getUserById, selectAllUsers, selectCurrentUser, selectCurrentUserId } from "../Store/UserSlice";

export function CompanyPage()
{
  const companies = useAppSelector(selectAllCompanies);
  const users = useAppSelector(selectAllUsers);
  const currentUserId = useAppSelector(selectCurrentUserId);
  const dispatch = useAppDispatch();

  useEffect(() =>
  {
    if(users.find(user => user.id === currentUserId)?.email === "admin@integrityinspired.com")
      dispatch(getUserById({}));
  }, [currentUserId])

  return (
    <>
      <Grid container spacing={6}>
      {
        companies.map((company,index) => {
          const usersAtCompany = users.filter(user => user.companyId === company.id);
          return (
            <Fragment key={index}>
              <Grid item md={4}>
                <Card>
                  <CardHeader>
                    {company.name}
                  </CardHeader>
                  <CardContent>
                    <Grid container spacing={6}>
                    {
                      usersAtCompany.map((user,jndex) => {
                        return(
                          <Grid item md="auto" key={jndex}>
                            {user.email}
                          </Grid>
                        )
                      })
                    }
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <button>
                      Edit
                    </button>
                  </CardActions>
                </Card>
              </Grid>
            </Fragment>
          )
        })
      }
      </Grid>
    </>
  )
}

