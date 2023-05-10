import { AdminUser, TestConstants } from "./TestHelpers";

const user = {
  email: "test@testing.com",
  password: "password",
  initaitiveIds: []
}

const editedUser = {
  email: "toast@toasting.com",
  password: "p4$$20rd"
}

const consts = TestConstants;
const navIds = consts.navPanelIds;
const failMessage = consts.validationFailedMessage;
const badToastId = consts.snackbarId;
const admin = AdminUser;

beforeEach(() => {
  cy.visit('http://localhost:3000/Login');
  cy.get('#email').clear().type(admin.email);
  cy.get('#password').clear().type(admin.password);
  cy.wait(500);
  cy.get('button').contains('Submit').click();
})

describe("update user spec",() => {

  const company = {
    id: "82bf634e-77c8-4abe-b55c-e2b5e8020892"//Id of a client WITH NO USERS
  }

  const modalIds = consts.editUserModalIds;

  beforeEach(() => {
    cy.get(navIds.company).click();
    cy.get("#editUserDataButton"+company.id).click();
    cy.get(modalIds.addButton).click({force:true});
    cy.get(modalIds.email).type(user.email);
    cy.get(modalIds.password).type(user.password);
    cy.get(modalIds.saveChangesButton).click();

    cy.get(modalIds.editButton).click();
    cy.get(modalIds.email).clear().type(editedUser.email);
    cy.get(modalIds.password).clear().type(editedUser.password);
  })

  specify('update a user',() => {
    cy.get(modalIds.saveChangesButton).click();
    cy.contains(editedUser.email);
  })

  specify('cannot update with invalid input', () => {
    cy.get(modalIds.email).clear();
    cy.get(modalIds.saveChangesButton).click();
    cy.get(badToastId).contains(failMessage);
    cy.get(modalIds.email).type(editedUser.email);

    cy.get(modalIds.password).clear();
    cy.get(modalIds.saveChangesButton).click();
    cy.get(badToastId).contains(failMessage);
  })

  specify('cancel button cancels the edit', () => {
    cy.get(modalIds.cancelChangesButton).click();
    cy.get(modalIds.saveChangesButton).should('not.exist');
    cy.contains(user.email);
  })

  specify('cannot edit multiple users at once', () => {
    cy.get(modalIds.editButton).should('not.exist');
  })
})

describe("update admin user spec", () => {
  const modalIds = consts.adminEditUserModalIds;
  const pageIds = consts.integrityPageIds;
  
  beforeEach(() => {
    cy.get(navIds.integrity).click();
    cy.get(pageIds.editButton).click();
    cy.get(modalIds.addButton).click({force:true});
    cy.get(modalIds.email).type(user.email);
    cy.get(modalIds.password).type(user.password);
    cy.get(modalIds.isAdmin).check({force:true});
    cy.get(modalIds.saveChangesButton).click();

    cy.get(modalIds.editButton).click();
    cy.get(modalIds.email).clear().type(editedUser.email);
    cy.get(modalIds.password).clear().type(editedUser.password);
    cy.get(modalIds.isAdmin).check({force:true});
  })

  specify('update a user',() => {
    cy.get(modalIds.saveChangesButton).click();
    cy.contains(editedUser.email);
  })

  specify('cannot update with invalid input', () => {
    cy.get(modalIds.email).clear();
    cy.get(modalIds.saveChangesButton).click();
    cy.get(badToastId).contains(failMessage);
    cy.get(modalIds.email).type(editedUser.email);

    cy.get(modalIds.password).clear();
    cy.get(modalIds.saveChangesButton).click();
    cy.get(badToastId).contains(failMessage);
  })

  specify('cancel button cancels the edit', () => {
    cy.get(modalIds.cancelChangesButton).click();
    cy.get(modalIds.saveChangesButton).should('not.exist');
    cy.contains(user.email);
  })

  specify('cannot edit multiple users at once', () => {
    cy.get(modalIds.editButton).should('not.exist');
  })
})

export {}