import { AdminUser, TestConstants } from "./TestHelpers";

describe('add user spec', () => {

  const company = {
    id: "82bf634e-77c8-4abe-b55c-e2b5e8020892"//Id of a client WITH NO USERS
  }

  const user = {
    email: "test@testing.com",
    password: "password",
    initaitiveIds: []
  }

  const consts = TestConstants;
  const navIds = consts.navPanelIds;
  const modalIds = consts.editUserModalIds;
  const failMessage = consts.validationFailedMessage;
  const badToastId = consts.snackbarId;
  const admin = AdminUser;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type(admin.email);
    cy.get('#password').clear().type(admin.password);
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get(navIds.company).click();
    cy.get("#editUserDataButton"+company.id).click();
    cy.get(modalIds.addButton).click({force:true});
  })

  specify('add a new user', () => {
    cy.get(modalIds.email).type(user.email);
    cy.get(modalIds.password).type(user.password);

    cy.get(modalIds.saveChangesButton).click();
    cy.contains(user.email);
    cy.get(modalIds.saveChangesButton).should('not.exist');
    cy.get(modalIds.editButton).should('exist');
  })

  specify('cannot add a user with invalid input', () => {
    cy.get(modalIds.saveChangesButton).click();
    cy.get(badToastId).contains(failMessage);
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

export {}