import { InitiativeDisplayRadioIds } from "../../src/Components/Initiative/ManageInitiativesDisplay";
import { InitiativeModalIds } from "../../src/Components/Initiative/UpdateInitiativeListModal";
import { ToastIds } from "../../src/Components/Toast";
import { UserDisplayRadioIds } from "../../src/Components/User/ManageUsersDisplay";
import { EditUserModalIds } from "../../src/Components/User/UpdateUserListModal";
import { ValidationFailedPrefix } from "../../src/Services/Validation";
import { UploadThroughputIds } from "../../src/Components/Initiative/UploadThroughputModal";
import { InitiativeTableIds } from "../../src/Components/Initiative/InitiativesTable";
import { EditThroughputIds } from "../../src/Components/Initiative/EditThroughputModal";

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
  toastIds: AddHash(ToastIds),
  initiativeModalIds: AddHash(InitiativeModalIds),
  initiativeDisplayRadioIds: AddHash(InitiativeDisplayRadioIds),
  userModalIds: AddHash(EditUserModalIds),
  userDisplayRadioIds: AddHash(UserDisplayRadioIds),
  uploadThroughputIds: AddHash(UploadThroughputIds),
  editThroughputIds: AddHash(EditThroughputIds),
  initiativeTableIds: AddHash(InitiativeTableIds)
}
