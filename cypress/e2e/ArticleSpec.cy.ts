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

}

function GoToInitiativeArticles()
{
  cy.getByData(initTableIds.actionMenu.menuButton).first().click();
  cy.getByData(initTableIds.actionMenu.articleButton).click();
}

function AddArticle()
{
  cy.getByData(modalIds.addButton).click();
  cy.getByData(modalIds.editTitle).type(articleToAdd.title);
  cy.getByData(modalIds.editText).type(articleToAdd.text);
  cy.getByData(modalIds.editUpdatedBy).type(articleToAdd.updatedBy);
  cy.getByData(modalIds.editUpdatedDate).setDatePicker(articleToAdd.updatedDate);
  cy.getByData(modalIds.saveChangesButton).click();

  cy.getByData(modalIds.saveChangesButton).should('not.exist');
  cy.contains(articleToAdd.title).parent().within(() => {
    cy.getByData(modalIds.text).should('contain',articleToAdd.text);
    cy.getByData(modalIds.updatedBy).should('contain',articleToAdd.updatedBy);
    //cy.getByData(modalIds.updatedDate).should('contain',articleToAdd.updatedDate);
  });
}

function EditArticle()
{
  cy.getByData(modalIds.editButton).first().click();
  cy.getByData(modalIds.editTitle).clear().type(editedArticle.title);
  cy.getByData(modalIds.editText).clear().type(editedArticle.text);
  cy.getByData(modalIds.editUpdatedBy).clear().type(editedArticle.updatedBy);
  cy.getByData(modalIds.editUpdatedDate).setDatePicker(editedArticle.updatedDate);
  cy.getByData(modalIds.saveChangesButton).click();

  cy.getByData(modalIds.saveChangesButton).should('not.exist');
  cy.contains(editedArticle.title).parent().within(() => {
    cy.getByData(modalIds.text).should('contain',editedArticle.text);
    cy.getByData(modalIds.updatedBy).should('contain',editedArticle.updatedBy);
    //cy.getByData(modalIds.updatedDate).should('contain',articleToAdd.updatedDate);
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

}

describe('add client-level article', () => {

  specify('Client users cannot add/edit articles', () => {
    cy.login(clientUser);
    GoToClientArticles();
    CannotAdd();
    CannotEdit();
  })

  specify('Client admins cannot add/edit articles', () => {
    cy.login(clientAdmin);
    GoToClientArticles();
    CannotAdd();
    CannotEdit();
  })

  specify('Integrity users can add/edit articles', () => {
    cy.login(integrityUser);
    GoToClientArticles();
    AddArticle();
    EditArticle();
  })

  specify('Integrity admins can add/edit articles', () => {
    cy.login(integrityAdmin);
    GoToClientArticles();
    AddArticle();
    EditArticle();
  })

  specify('Cannot add/edit article with invalid input', () => {
    cy.login(integrityAdmin);
    GoToClientArticles();
    CannotAddInvalidArticle();
    AddArticle();
    CannotEditInvalidArticle();
  })

  specify('Client cannot see Integrity-only articles', () => {
    cy.login(integrityAdmin);
    GoToClientArticles();
    //add integrity-only article
    //log out
    cy.login(clientAdmin);
    GoToClientArticles();
    //should not exist
  })

  specify('close button closes the modal', () => {
    cy.login(integrityAdmin);
    GoToClientArticles();
    CloseModal();
  })
  
});

describe.only('add initiative-level article', () => {

  specify('Client users cannot add/edit articles', () => {
    //TODO: for editing, we need to ensure an article is there in the first place
    cy.login(clientUser);
    GoToInitiativeArticles();
    CannotAdd();
    CannotEdit();
  })

  specify('Client admins cannot add/edit articles', () => {
    //TODO: same here
    cy.login(clientAdmin);
    GoToInitiativeArticles();
    CannotAdd();
    CannotEdit();
  })

  specify('Integrity users can add/edit articles', () => {
    cy.login(integrityUser);
    GoToInitiativeArticles();
    AddArticle();
    EditArticle();
  })

  specify.only('Integrity admins can add/edit articles', () => {
    cy.login(integrityAdmin);
    GoToInitiativeArticles();
    AddArticle();
    EditArticle();
  })

  specify('Cannot add/edit article with invalid input', () => {
    cy.login(integrityAdmin);
    GoToInitiativeArticles();
    CannotAddInvalidArticle();
    AddArticle();
    CannotEditInvalidArticle();
  })

  specify('Client cannot see Integrity-only articles', () => {
    cy.login(integrityAdmin);
    GoToInitiativeArticles();
    //add integrity-only article
    //log out
    cy.login(clientAdmin);
    GoToInitiativeArticles();
    //should not exist
  })

  specify('close button closes the modal', () => {
    cy.login(integrityAdmin);
    GoToInitiativeArticles();
    CloseModal();
  })

});

export {}