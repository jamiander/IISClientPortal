import { Fragment, useEffect } from "react";
import { selectAllCompanies } from "../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { getUserById, selectAllUsers, selectCurrentUser } from "../Store/UserSlice";

export function CompanyPage()
{
  const companies = useAppSelector(selectAllCompanies);
  const users = useAppSelector(selectAllUsers);
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  useEffect(() =>
  {
    if(currentUser?.email === "admin@integrityinspired.com")
      dispatch(getUserById({}));
  }, [currentUser])

  return (
    <>
    {
      companies.map((company,index) => {
        const usersAtCompany = users.filter(user => user.companyId === company.id);
        return (
          <Fragment key={index}>
            <Card>
              <CardHeader>
                {company.name}
              </CardHeader>
              <CardContent>
                {
                  usersAtCompany.map((user,jndex) => {
                    return(
                      <Fragment key={jndex}>
                        {user.email}
                      </Fragment>
                    )
                  })
                }
              </CardContent>
              <CardActions>
                
              </CardActions>
            </Card>
          </Fragment>
        )
      })
    }
    </>
  )
}

