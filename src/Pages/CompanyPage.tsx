import { Fragment, useEffect } from "react";
import { selectAllCompanies } from "../Store/CompanySlice"
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { Card, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { getUserById, selectAllUsers, selectCurrentUser, selectCurrentUserId } from "../Store/UserSlice";
import { Item, StyledCard, StyledCardActions, StyledCardContent } from "../Styles";

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
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="col-span-4 p-4">
        <Grid container spacing={2}>
        {
          companies.map((company,index) => {
            const usersAtCompany = users.filter(user => user.companyId === company.id);
            return (
              <Fragment key={index}>
                <Grid item md={4}>
                  <Item>
                    <StyledCard>
                      <StyledCardContent>
                        <Typography className="text-2xl">{company.name}</Typography>
                        <Grid container spacing={1}>
                        {
                          usersAtCompany.map((user,jndex) => {
                            return(
                              <Grid item md="auto" key={jndex}>
                                <Typography>{user.email}</Typography>
                              </Grid>
                            )
                          })
                        }
                        </Grid>
                      </StyledCardContent>
                      <StyledCardActions>
                      </StyledCardActions>
                    </StyledCard>
                  </Item>
                </Grid>
              </Fragment>
            )
          })
        }
        </Grid>
      </div>
    </div>
  )
}

