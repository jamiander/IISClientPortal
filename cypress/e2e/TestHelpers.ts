import { InitiativeRadioIds } from "../../src/Components/Initiative/ManageInitiativesDisplay";
import { InitiativeModalIds } from "../../src/Components/Initiative/UpdateInitiativeListModal";
import { ToastId } from "../../src/Components/Toast";
import { UserRadioIds } from "../../src/Components/User/ManageUsersDisplay";
import { EditUserModalIds } from "../../src/Components/User/UpdateUserListModal";
import { ValidationFailedPrefix } from "../../src/Services/Validation";

//cypress can find items by id using "#id"
export function AddHash(obj: any)
{
  if(typeof(obj) == 'string')
    return "#" + obj;

  const newObj = JSON.parse(JSON.stringify(obj));
  for(let key of Object.keys(obj))
  {
    newObj[key] = AddHash(obj[key]);
  }
  return newObj;
}


export const TestConstants = {
  validationFailedMessage: ValidationFailedPrefix,
  toastId: AddHash(ToastId),
  initiativeModalIds: AddHash(InitiativeModalIds),
  initiativeRadioIds: AddHash(InitiativeRadioIds),
  userModalIds: AddHash(EditUserModalIds),
  userRadioIds: AddHash(UserRadioIds)
}
