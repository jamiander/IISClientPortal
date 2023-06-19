import { AdminUser, IntegrityUser, MBPIAdminUser, MBPIUser } from "./TestHelpers";

const integrityUser = IntegrityUser;
const integrityAdmin = AdminUser;
const clientUser = MBPIUser;
const clientAdmin = MBPIAdminUser;

function GoToClientArticles()
{

}

function GoToInitiativeArticles()
{

}

function AddArticle()
{

}

function EditArticle()
{

}

function CannotAdd()
{

}

function CannotEdit()
{

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

describe('add initiative-level article', () => {

  specify('Client users cannot add/edit articles', () => {
    cy.login(clientUser);
    GoToInitiativeArticles();
    CannotAdd();
    CannotEdit();
  })

  specify('Client admins cannot add/edit articles', () => {
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

  specify('Integrity admins can add/edit articles', () => {
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