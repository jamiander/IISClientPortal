import { AdminUser, TestConstants } from "./TestHelpers";

const user = {
  email: "AAAtest@testing.com",
  password: "password",
  initaitiveIds: []
}

const consts = TestConstants;
const navIds = consts.navPanelIds;
const failMessage = consts.validationFailedMessage;
const snackbarId = consts.snackbarId;
const admin = AdminUser;

beforeEach(() => {
  cy.visit('http://localhost:3000/Login');
  cy.get('#email').clear().type(admin.email);
  cy.get('#password').clear().type(admin.password);
  cy.wait(500);
  cy.get('button').contains('Submit').click();
})

describe('add user spec', () => {

  const company = {
    id: "82bf634e-77c8-4abe-b55c-e2b5e8020892"//Id of a client WITH NO USERS
  }

  const modalIds = consts.editUserModalIds;

  beforeEach(() => {
    cy.get(navIds.company).click();
    cy.get("#editUserDataButton"+company.id).click();
    cy.get(modalIds.addButton).click({force:true});
  })

  specify('add a new user', () => {
    cy.get(modalIds.email).type(user.email);
    cy.get(modalIds.password).type(user.password);

    cy.get(modalIds.saveChangesButton).click();
    cy.get(modalIds.modal).within(() => {
      cy.get(modalIds.email)
      .invoke('val')
      .should('equal', user.email);
    })
    cy.get(modalIds.saveChangesButton).should('not.exist');
    cy.get(modalIds.editButton).should('exist');
  })

  specify('cannot add a user with invalid input', () => {
    cy.get(modalIds.saveChangesButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot add multiple users at once', () => {
    cy.get(modalIds.addButton).should('be.disabled');
  })

  specify('cancel does not leave behind a blank user', () => {
    cy.get(modalIds.cancelChangesButton).click();
    cy.get(modalIds.editButton).should('not.exist');
  })

  specify('close button closes the modal', () => {
    cy.get(modalIds.closeModalButton).click();
    cy.get(modalIds.modal).should('not.exist');
  })
})

describe("add admin user spec", () => {
  const pageIds = consts.integrityPageIds;

  beforeEach(() => {
    cy.get(navIds.integrity).click();
    cy.wait(500);
    cy.get(pageIds.addButton).click();
  })

  specify('add a new admin user', () => {
    cy.get(pageIds.email).type(user.email);
    cy.get(pageIds.password).type(user.password);
    cy.get(pageIds.isAdmin).check();

    cy.get(pageIds.saveChangesButton).click();
    cy.get(pageIds.email)
      //.invoke('val')
      .should('contain', user.email);
    
    cy.get(pageIds.saveChangesButton).should('not.exist');
    cy.get(pageIds.editButton).should('exist');
  })

  specify('cannot add a user with invalid input', () => {
    cy.get(pageIds.saveChangesButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot add multiple users at once', () => {
    cy.get(pageIds.addButton).should('be.disabled');
  })

  specify('cancel does not leave behind a blank user', () => {
    cy.get(pageIds.cancelChangesButton).click();
    cy.get(pageIds.email).contains(user.email).should('not.exist');
  })

})

export {}