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

function AddArticle()
{
  EditArticle(true);
}

function EditArticle(add?: boolean)
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
  cy.getByData(modalIds.saveChangesButton).click();

  cy.getByData(modalIds.saveChangesButton).should('not.exist');
  cy.contains(article.title).parent().within(() => {
    cy.getByData(modalIds.text).should('contain',article.text);
    cy.getByData(modalIds.updatedBy).should('contain',article.updatedBy);
    //cy.getByData(modalIds.updatedDate).should('contain',article.updatedDate);
  });
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

}

function CannotEditInvalidArticle()
{

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

  specify('Cannot add/edit article with invalid input', () => {
    cy.login(integrityAdmin);
    GoToArticles();
    CannotAddInvalidArticle();
    AddArticle();
    CannotEditInvalidArticle();
  })

  specify('Canceling an add/edit does not save changes', () => {

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
});

describe('add initiative-level article', () => {
  Specs(GoToInitiativeArticles);
});

export {}