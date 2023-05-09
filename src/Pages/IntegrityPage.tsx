import { Grid } from "@mui/material";
import { IntegrityId, selectAllCompanies } from "../Store/CompanySlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks"
import { User, getUserById, selectAllUsers, selectCurrentUserId } from "../Store/UserSlice";
import { Item, StyledCard, StyledCardActions, StyledCardContent, cancelButtonStyle, submitButtonStyle, yellowButtonStyle } from "../Styles";
import { useEffect, useState } from "react";
import AdminEditUserDataModal from "../Components/User/AdminEditUserDataModal";

export const IntegrityPageIds = {
  editButton: "IntegrityPageEditButton"
}

export function IntegrityPage(){
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector(selectCurrentUserId);
  const allUsers = useAppSelector(selectAllUsers);
  const allCompanies = useAppSelector(selectAllCompanies);
  const integrityUsers = allUsers.filter(user => user.companyId === IntegrityId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() =>
  {
    if(allUsers.find(user => user.id === currentUserId)?.isAdmin)
      dispatch(getUserById({}));
  }, [currentUserId]);

  return (
    <div className="my-[1%] mx-[2%] grid grid-cols-4">
      <div className="col-span-4 p-2">
      <div className="flex justify-end">
          <button id={IntegrityPageIds.editButton} className={yellowButtonStyle + " mb-4"} onClick={() => setIsModalOpen(true)}>
            Edit Users
          </button>
        </div>
        <Grid container spacing={2}>
        {
          integrityUsers.map((user, index) => {
            return (
              <Grid item md={4} key={index}>
                <Item>
                  <StyledCard>
                    <StyledCardContent>
                      {user.email}
                    </StyledCardContent>
                    <StyledCardActions>
                      
                    </StyledCardActions>
                  </StyledCard>
                </Item>
              </Grid>
            )
          })
        }
        </Grid>
      </div>
      <AdminEditUserDataModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} companies={allCompanies} users={integrityUsers}/>
    </div>
  )
}