import { AdminUser, IntegrityUser, MBPIAdminUser, MBPIUser, SimpleUser, TestConstants } from "./TestHelpers";

const integrityUser = IntegrityUser;
const integrityAdmin = AdminUser;
const clientUser = MBPIUser;
const clientAdmin = MBPIAdminUser;

const consts = TestConstants;
const initPageIds = consts.initiativesPageIds;
const initTableIds = consts.initiativeTableIds;
const clientPageIds = consts.clientPageIds;
const modalIds = consts.articleModalIds;
const docModalIds = consts.documentModalIds;
const navIds = consts.navPanelIds;
const snackbarId = consts.snackbarId;
const snackbarWaitTime = consts.snackbarWaitTime;
const failMessage = consts.validationFailedMessage;

const articleToAdd = {
  title: "New Article",
  text: "Hello. This is my new article.",
  updatedDate: "01012023",
  updatedBy: "Johnny Test",
}

const editedArticle = {
  title: "Edited Article",
  text: "Goodbye.",
  updatedDate: "01022023",
  updatedBy: "Jimmy Toast"
}

function GoToClientArticles(companyName?: string)
{
  cy.getByData(navIds.menuButton).click();
  cy.getByData(navIds.client).click();
  if(companyName)
    cy.getByData(clientPageIds.keywordFilter).type(companyName);
  cy.getByData(clientPageIds.actionMenu.menuButton).first().click();
  cy.getByData(clientPageIds.actionMenu.articleButton).click();
}

function GoToInitiativeArticles(companyName?: string, initiativeName?: string)
{
  cy.getByData(navIds.menuButton).click();
  cy.getByData(navIds.initiatives).click();
  if(companyName)
    cy.getByData(initPageIds.companyNameFilter).type(companyName);
  if(initiativeName)
    cy.getByData(initPageIds.initiativeTitleFilter).type(initiativeName);
  cy.getByData(initTableIds.actionMenu.menuButton).first().click();
  cy.getByData(initTableIds.actionMenu.articleButton).click();
}

function AddArticle(submit: boolean = true, integrityOnly?: boolean)
{
  EditArticle(submit, integrityOnly, true);
}

function EditArticle(submit: boolean = true, integrityOnly?: boolean, add?: boolean)
{
  let article = editedArticle;
  if(add)
  {
    article = articleToAdd;
    cy.getByData(modalIds.addButton).click();
  }
  else
    cy.getByData(modalIds.editButton).first().click();

  cy.getByData(modalIds.editTitle).clear().type(article.title);
  cy.getByData(modalIds.editText).clear().type(article.text);
  cy.getByData(modalIds.editUpdatedBy).clear().type(article.updatedBy);
  cy.getByData(modalIds.editUpdatedDate).setDatePicker(article.updatedDate);
  if(integrityOnly)
    cy.getByData(modalIds.isIntegrityOnly).find('input').check();
  
  if(submit)
  {
    cy.getByData(modalIds.saveChangesButton).click();

    cy.getByData(modalIds.saveChangesButton).should('not.exist');
    cy.contains(article.title).parent().within(() => {
      cy.getByData(modalIds.text).should('contain',article.text);
      cy.getByData(modalIds.updatedBy).should('contain',article.updatedBy);
      //cy.getByData(modalIds.updatedDate).should('contain',article.updatedDate);
    });
  }
}

function CannotAdd()
{
  cy.getByData(modalIds.addButton).should('not.exist');
}

function CannotEdit()
{
  cy.getByData(modalIds.editButton).should('not.exist');
}

function CannotAddInvalidArticle()
{
  CannotEditInvalidArticle(true);
}

function CannotEditInvalidArticle(add?: boolean)
{
  if(add)
    AddArticle(false);
  else
    EditArticle(false);
  
  TestEmptyField(modalIds.editTitle);
  TestEmptyField(modalIds.editText);
  TestEmptyField(modalIds.editUpdatedBy);
  TestEmptyDate(modalIds.editUpdatedDate);

  cy.getByData(modalIds.cancelChangesButton).click();
}

function TestEmptyField(data: string)
{
  cy.getByData(data).then(($txt) => {
    let originalText = $txt.text();

    cy.getByData(data).clear();

    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(data).type(originalText);
  })
}

function TestEmptyDate(data: string)
{
  cy.getByData(data).find('input').invoke('val').then(($val) => {
    let originalDate = $val as string;
    cy.getByData(data).setDatePicker("");

    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(data).setDatePicker(originalDate);
  });
}

function CloseModal()
{
  cy.getByData(modalIds.modal).should('exist');
  cy.getByData(modalIds.closeModalButton).click();
  cy.getByData(modalIds.modal).should('not.exist');
  cy.get('body').click(0,0);
}

function LogOut()
{
  cy.get('button').contains("Log Out").click();
}


function Specs(GoToArticles: (companyName?: string) => void, GoToDocuments: (login: SimpleUser) => void)
{
  specify('Client users cannot add/edit articles', () => {
    cy.login(clientUser);
    GoToArticles();
    CannotAdd();
    CannotEdit();
    //We can't actually test for existing articles to edit because adding an article as an Integrity user doesn't persist
    //when we log in as a client user.
  })

  specify('Client admins cannot add/edit articles', () => {
    cy.login(clientAdmin);
    GoToArticles();
    CannotAdd();
    CannotEdit();
  })

  specify('Integrity users can add/edit articles', () => {
    cy.login(integrityUser);
    GoToArticles();
    AddArticle();
    EditArticle();
  })

  specify('Integrity admins can add/edit articles', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    AddArticle();
    EditArticle();
  })

  specify('Canceling an add/edit does not save changes', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    AddArticle(false);
    cy.contains(articleToAdd.title).should('exist');
    cy.getByData(modalIds.cancelChangesButton).click();
    cy.contains(articleToAdd.title).should('not.exist');
  })

  specify('Cannot add/edit article with invalid input', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    CannotAddInvalidArticle();
    AddArticle();
    CannotEditInvalidArticle();
  })

  specify('Close button closes the modal', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    CloseModal();
  })

  specify('Cannot add/edit while already adding/editing', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    AddArticle(); //need another article so the edit button isn't replaced by save button

    AddArticle(false);
    cy.getByData(modalIds.addButton).should('be.disabled');
    CannotEdit();
    cy.getByData(modalIds.saveChangesButton).click();
    cy.getByData(modalIds.addButton).should('not.be.disabled');
    cy.getByData(modalIds.editButton).should('not.be.disabled');

    EditArticle(false);
    cy.getByData(modalIds.addButton).should('be.disabled');
    CannotEdit();
    cy.getByData(modalIds.saveChangesButton).click();
    cy.getByData(modalIds.addButton).should('not.be.disabled');
    cy.getByData(modalIds.editButton).should('not.be.disabled');
  })

  //We can't test for document upload permissions unless we already have an article to work with in the database
  //As of 6/27/23, there are two articles under MBPI Test Project called "MBPI" and "Integrity Only" to work with
  specify.only('Integrity admins can upload files', () => {
    GoToDocuments(integrityAdmin);

    cy.getByData(docModalIds.documentUpload.chooseFileButton).should('exist');
  })

  specify.only('Integrity users can upload files', () => {
    GoToDocuments(integrityUser);

    cy.getByData(docModalIds.documentUpload.chooseFileButton).should('exist');
  })

  specify.only('Client admins cannot upload files', () => {
    GoToDocuments(MBPIAdminUser);

    cy.getByData(docModalIds.documentUpload.chooseFileButton).should('not.exist');
  })

  specify.only('Client users cannot upload files', () => {
    GoToDocuments(MBPIUser);

    cy.getByData(docModalIds.documentUpload.chooseFileButton).should('not.exist');
  })
}

function GoToClientDocuments(loginUser: SimpleUser)
{
  cy.login(loginUser);
  //only Integrity has a view of the client page that allows for filtering
  if(loginUser.email === integrityAdmin.email || loginUser.email === integrityUser.email)
    GoToClientArticles("MBPI");
  else
    GoToClientArticles();

  cy.getByData(modalIds.keywordFilter).type('MBPI');
  cy.getByData(modalIds.documents).click();
  cy.getByData(docModalIds.modal).should('exist');
}

function GoToInitiativeDocuments(loginUser: SimpleUser)
{
  cy.login(loginUser);
  GoToInitiativeArticles(undefined, "MBPI Test Project");
  cy.getByData(modalIds.keywordFilter).type('MBPI');
  cy.getByData(modalIds.documents).click();
  cy.getByData(docModalIds.modal).should('exist');
}

describe('add client-level article', () => {
  Specs(GoToClientArticles,GoToClientDocuments);

  specify('Cannot see initiative-level articles from client view', () => {
    cy.login(integrityAdmin);
    GoToInitiativeArticles("MBPI");
    AddArticle();
    cy.contains(articleToAdd.title).should('exist');
    CloseModal();
    GoToClientArticles("MBPI");
    cy.contains(articleToAdd.title).should('not.exist');
  })

  specify('Client cannot see Integrity-only articles', () => {
    cy.login(clientAdmin);
    GoToClientArticles();
    CloseModal();
    cy.getByData(clientPageIds.name).then(($txt) => {
      let companyName = $txt.text();

      LogOut(); //This clears the store, so this test will always pass; not sure how to work around this without having
                //an existing Integrity-only article created outside of the tests.

      cy.login(integrityAdmin);
      GoToClientArticles(companyName);
      AddArticle(true,true);
      CloseModal();

      LogOut();

      cy.login(clientAdmin);
      GoToClientArticles();
      cy.contains(articleToAdd.title).should('not.exist');
    });
  })
});

describe('add initiative-level article', () => {
  Specs(GoToInitiativeArticles,GoToInitiativeDocuments);

  specify('Cannot see client-level articles from initiative view', () => {
    cy.login(integrityAdmin);
    GoToClientArticles("MBPI");
    AddArticle();
    cy.contains(articleToAdd.title).should('exist');
    CloseModal();
    GoToInitiativeArticles("MBPI");
    cy.contains(articleToAdd.title).should('not.exist');
  })

  specify('Client cannot see Integrity-only articles', () => {
    cy.login(clientAdmin);
    GoToInitiativeArticles();
    CloseModal();
    cy.getByData(initTableIds.initiativeTitle).first().then(($txt) => {
      let initiativeName = $txt.text();

      LogOut();

      cy.login(integrityAdmin);
      GoToInitiativeArticles("MBPI",initiativeName);
      AddArticle(true,true);
      CloseModal();

      LogOut();

      cy.login(clientAdmin);
      GoToInitiativeArticles();
      cy.contains(articleToAdd.title).should('not.exist');
    });
  })
});

export {}