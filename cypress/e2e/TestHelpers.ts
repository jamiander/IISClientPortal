import { InitiativeModalIds } from "../../src/Components/Initiative/UpdateInitiativeListModal";
import { ValidationFailedPrefix } from "../../src/Services/Validation";
import { UploadThroughputIds } from "../../src/Components/Initiative/UploadThroughputModal";
import { InitiativeTableIds } from "../../src/Components/Initiative/InitiativesTable";
import { EditThroughputIds } from "../../src/Components/Initiative/EditThroughputModal";
import { DecisionModalIds } from "../../src/Components/Decisions/DecisionDataModal";
import { DeleteDecisionAlertIds } from "../../src/Components/Decisions/DeleteDecisionAlert";
import { NavPanelIds } from "../../src/Layout/NavPanel";
import { IntegrityPageIds } from "../../src/Pages/IntegrityPage";
import { ClientPageIds } from "../../src/Pages/ClientPage";
import { LoginPageIds } from "../../src/Pages/LoginPage";
import { UsersPageIds } from "../../src/Pages/UsersPage";
import { InitiativeDisplayRadioIds, InitiativesPageIds } from "../../src/Pages/InitiativesPage";
import { DocumentManagementModalIds } from "../../src/Components/Documents/DocumentManagementModal";
import { ArticleModalIds } from "../../src/Components/Articles/ArticleDataModal";

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
  snackbarId: "#notistack-snackbar",
  initiativeModalIds:InitiativeModalIds,
  initiativeDisplayRadioIds: InitiativeDisplayRadioIds,
  uploadThroughputIds: UploadThroughputIds,
  editThroughputIds: EditThroughputIds,
  initiativeTableIds: InitiativeTableIds,
  decisionModalIds: DecisionModalIds,
  deleteDecisionAlertIds: DeleteDecisionAlertIds,
  navPanelIds: NavPanelIds,
  usersPageIds: UsersPageIds,
  integrityPageIds: IntegrityPageIds,
  clientPageIds: ClientPageIds,
  loginPageIds: LoginPageIds,
  initiativesPageIds: InitiativesPageIds,
  documentModalIds: DocumentManagementModalIds,
  articleModalIds: ArticleModalIds,
  snackbarWaitTime: 1000,   //how long it should wait for the snackbar to go away after requesting a new one
}


export type SimpleUser = {email: string, password: string}

export const IntegrityUser: SimpleUser = {
  email: "notanadmin@integrityinspired.com",
  password: "notadmin"
}

export const AdminUser: SimpleUser = {
  email: "admin@integrityinspired.com",
  password: "admin"
}

export const MBPIUser: SimpleUser = {
  email: "info@mbpi.com",
  password: "testingMBPI"
}

export const MBPIAdminUser: SimpleUser = {
  email: "admin@mbpi.com",
  password: "testingMBPI"
}

export const MBPICompany = {
  name: "MBPI",
  id: "38cd148a-b402-4f54-9cc9-b639c51837ad"
}

export const StaplesCompany = {
  name: "Staples",
  id: "a9093993-0295-47b8-8a7a-4237094da43f"
}

export const MBPIInitiative = {
  title: "MBPI Test Project - Do not remove!",
  companyName: "MBPI"
}
