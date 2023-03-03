import { InitiativeRadioIds } from "../../src/Components/Initiative/ManageInitiativesDisplay";
import { InitiativeModalIds } from "../../src/Components/Initiative/UpdateInitiativeListModal";
import { ToastId } from "../../src/Components/Toast";
import { UserRadioIds } from "../../src/Components/User/ManageUsersDisplay";
import { EditUserModalIds } from "../../src/Components/User/UpdateUserListModal";
import { ValidationFailedPrefix } from "../../src/Services/Validation";
import { UploadThroughputIds } from "../../src/Components/Initiative/UploadThroughputModal";
import { InitiativeTableIds } from "../../src/Components/Initiative/InitiativesTable";

//cypress can find items by id using "#id"
export function AddHash(obj: Record<string,any> | string)
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
  userRadioIds: AddHash(UserRadioIds),
  uploadThroughputIds: AddHash(UploadThroughputIds),
  initiativeTableIds: AddHash(InitiativeTableIds)
}
