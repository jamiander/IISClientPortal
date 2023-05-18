import { AdminUser, MBPIAdminUser, TestConstants } from "./TestHelpers";

const user = {
  email: "AAAtest@testing.com",
  password: "password",
  initaitiveIds: []
}

const consts = TestConstants;
const navIds = consts.navPanelIds;
const failMessage = consts.validationFailedMessage;
const snackbarId = consts.snackbarId;
const loginIds = consts.loginPageIds;
const admin = AdminUser;

describe('add non-Integrity user as Integrity spec', () => {

  const company = {
    id: "82bf634e-77c8-4abe-b55c-e2b5e8020892"//Id of a client WITH NO USERS
  }

  const pageIds = consts.usersPageIds;
  const modalIds = consts.adminAddUserModalIds;

  beforeEach(() => {
    cy.get(loginIds.shouldfail)
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(admin.email);
    cy.get(loginIds.password).clear().type(admin.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();
    
    cy.get(navIds.users).click();
    //cy.get("#editUserDataButton"+company.id).click();
    cy.get(pageIds.addButton).click({force:true});
  })

  specify('add a new user as a non-Integrity user', () => {
    cy.get(modalIds.email).type(user.email);
    cy.get(modalIds.password).type(user.password);
    cy.get(modalIds.isActive).check();
    cy.get(modalIds.saveChangesButton).click();
    cy.get(modalIds.modal).should('not.exist');
    cy.contains(user.email);
  })

  specify('cannot add a user with invalid input', () => {
    cy.get(modalIds.saveChangesButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot add multiple users at once', () => {
    cy.get(pageIds.addButton).should('be.disabled');
  })

  specify('cancel does not leave behind a blank user', () => {
    cy.get(modalIds.email).clear().type(user.email);
    cy.get(modalIds.cancelChangesButton).click();
    cy.contains(user.email).should('not.exist');
  })

  specify('close button closes the modal', () => {
    cy.get(pageIds.closeModalButton).click();
    cy.get(pageIds.modal).should('not.exist');
  })
})


describe("add non-Integrity user as non-Integrity user spec", () => {

  const pageIds = consts.usersPageIds;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(MBPIAdminUser.email);
    cy.get(loginIds.password).clear().type(MBPIAdminUser.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(navIds.users).click();
    //cy.get("#editUserDataButton"+company.id).click();
    cy.wait(1000);
    cy.get(pageIds.addButton).click({force:true});
  })

  specify('add a new non-Integrity user as non-Integrity user',  () => {
    cy.get(pageIds.email).type(user.email);
    cy.get(pageIds.password).type(user.password);

    cy.get(pageIds.saveChangesButton).click();
    cy.get(pageIds.email)
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


describe("add Integrity user spec", () => {
  const pageIds = consts.integrityPageIds;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(admin.email);
    cy.get(loginIds.password).clear().type(admin.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(navIds.integrity).click();
    cy.wait(500);
    cy.get(pageIds.addButton).click();
  })

  specify('add a new Integrity user', () => {
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