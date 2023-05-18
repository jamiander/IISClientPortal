import { InitiativeDisplayRadioIds } from "../../src/Components/Initiative/ManageInitiativesDisplay";
import { InitiativeModalIds } from "../../src/Components/Initiative/UpdateInitiativeListModal";
import { ToastIds } from "../../src/Components/Toast";
import { ValidationFailedPrefix } from "../../src/Services/Validation";
import { UploadThroughputIds } from "../../src/Components/Initiative/UploadThroughputModal";
import { InitiativeTableIds } from "../../src/Components/Initiative/InitiativesTable";
import { EditThroughputIds } from "../../src/Components/Initiative/EditThroughputModal";
import { DecisionModalIds } from "../../src/Components/Initiative/DecisionDataModal";
import { DeleteDecisionAlertIds } from "../../src/Components/Initiative/DeleteDecisionAlert";
import { NavPanelIds } from "../../src/Layout/NavPanel";
import { EditUserDataIds } from "../../src/Components/User/EditUserDataModal";
import { IntegrityPageIds } from "../../src/Pages/IntegrityPage";
import { ClientPageIds } from "../../src/Pages/ClientPage";
import { LoginPageIds } from "../../src/Pages/LoginPage";
import { UsersPageIds } from "../../src/Pages/UsersPage";
import { AdminAddUserModalIds } from "../../src/Components/User/AdminAddUserModal";

//cypress can find items by id using "#id"
export function AddHash(obj: Record<string,any> | string)
{
  if(typeof(obj) === 'string')
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
  snackbarId: "#notistack-snackbar",
  initiativeModalIds: AddHash(InitiativeModalIds),
  initiativeDisplayRadioIds: AddHash(InitiativeDisplayRadioIds),
  uploadThroughputIds: AddHash(UploadThroughputIds),
  editThroughputIds: AddHash(EditThroughputIds),
  initiativeTableIds: AddHash(InitiativeTableIds),
  decisionModalIds: AddHash(DecisionModalIds),
  deleteDecisionAlertIds: AddHash(DeleteDecisionAlertIds),
  navPanelIds: AddHash(NavPanelIds),
  usersPageIds: AddHash(UsersPageIds),
  editUserModalIds: AddHash(EditUserDataIds),
  integrityPageIds: AddHash(IntegrityPageIds),
  clientPageIds: AddHash(ClientPageIds),
  loginPageIds: AddHash(LoginPageIds),
  adminAddUserModalIds: AddHash(AdminAddUserModalIds),
  snackbarWaitTime: 1000,   //how long it should wait for the snackbar to go away after requesting a new one
}

export const IntegrityUser = {
  email: "notanadmin@integrityinspired.com",
  password: "notadmin"
}

export const AdminUser = {
  email: "admin@integrityinspired.com",
  password: "admin"
}

export const MBPIUser = {
  email: "info@mbpi.com",
  password: "testingMBPI"
}

export const MBPIAdminUser = {
  email: "admin@mbpi.com",
  password: "testingMBPI"
}

export const MBPICompany = {
  name: "MBPI",
  id: "38cd148a-b402-4f54-9cc9-b639c51837ad"
  
}
