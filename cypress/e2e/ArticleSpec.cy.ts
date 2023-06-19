import { Article } from "../../src/Store/ArticleSlice";
import { AdminUser, IntegrityUser, MBPIAdminUser, MBPIUser, TestConstants } from "./TestHelpers";

const integrityUser = IntegrityUser;
const integrityAdmin = AdminUser;
const clientUser = MBPIUser;
const clientAdmin = MBPIAdminUser;

const consts = TestConstants;
const initTableIds = consts.initiativeTableIds;
const clientPageIds = consts.clientPageIds;
const modalIds = consts.articleModalIds;
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

function GoToClientArticles()
{
  cy.getByData(navIds.menuButton).click();
  cy.getByData(navIds.client).click();
  cy.getByData(clientPageIds.actionMenu.menuButton).first().click();
  cy.getByData(clientPageIds.actionMenu.articleButton).click();
}

function GoToInitiativeArticles()
{
  cy.getByData(initTableIds.actionMenu.menuButton).first().click();
  cy.getByData(initTableIds.actionMenu.articleButton).click();
}

function AddArticle(submit?: boolean)
{
  EditArticle(submit, true);
}

function EditArticle(submit?: boolean, add?: boolean)
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
  let article = editedArticle;
  if(add)
  {
    article = articleToAdd;
    AddArticle(false);
  }
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
}

function Specs(GoToArticles: () => void)
{
  specify('Client users cannot add/edit articles', () => {
    //TODO: for editing, we need to ensure an article is there in the first place
    cy.login(clientUser);
    GoToArticles();
    CannotAdd();
    CannotEdit();
  })

  specify('Client admins cannot add/edit articles', () => {
    //TODO: same here
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

  specify.only('Canceling an add/edit does not save changes', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    AddArticle(false);
    cy.getByData(modalIds.grid).its('length').then(($length) => {
      let length = $length;
      cy.getByData(modalIds.cancelChangesButton).click();
      if(length === 1)
        cy.getByData(modalIds.grid).children().should('not.exist');
      else
        cy.getByData(modalIds.grid).children().its('length').should('equal',length-1);
    });
  })

  specify('Cannot add/edit article with invalid input', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    CannotAddInvalidArticle();
    AddArticle();
    CannotEditInvalidArticle();
  })

  specify('Client cannot see Integrity-only articles', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    //add integrity-only article
    //log out
    cy.login(clientAdmin);
    GoToArticles();
    //should not exist
  })

  specify('Close button closes the modal', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    CloseModal();
  })
}

describe('add client-level article', () => {
  Specs(GoToClientArticles);

  specify('Cannot see initiative-level articles from client view', () => {

  })
});

describe('add initiative-level article', () => {
  Specs(GoToInitiativeArticles);

  specify('Cannot see client-level articles from initiative view', () => {

  })
});

export {}