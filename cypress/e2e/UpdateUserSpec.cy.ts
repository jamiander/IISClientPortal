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
const snackbarId = consts.snackbarId;
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
    cy.get(modalIds.email)
    .invoke('val')
    .should('equal', editedUser.email);
  })

  specify('cannot update with invalid input', () => {
    cy.get(modalIds.email).clear();
    cy.get(modalIds.saveChangesButton).click();
    cy.get(snackbarId).contains(failMessage);
    cy.get(modalIds.email).type(editedUser.email);

    cy.get(modalIds.password).clear();
    cy.get(modalIds.saveChangesButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cancel button cancels the edit', () => {
    cy.get(modalIds.cancelChangesButton).click();
    cy.get(modalIds.saveChangesButton).should('not.exist');
    cy.get(modalIds.email)
    .invoke('val')
    .should('equal', user.email);
  })

  specify('cannot edit multiple users at once', () => {
    cy.get(modalIds.editButton).should('not.exist');
  })
})

describe("update admin user spec", () => {
  const pageIds = consts.integrityPageIds;
  
  beforeEach(() => {
    cy.get(navIds.integrity).click();
    cy.wait(1000);
    cy.get(pageIds.addButton).click({force:true});
    cy.get(pageIds.email).type(user.email);
    cy.get(pageIds.password).type(user.password);
    cy.get(pageIds.isAdmin).check({force:true});
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(500);

    cy.get(pageIds.grid).children().last().within(() => {
      cy.get(pageIds.editButton).click();
      cy.get(pageIds.email).clear().type(editedUser.email);
      cy.get(pageIds.password).clear().type(editedUser.password);
      cy.get(pageIds.isAdmin).check({force:true});
    })
    
  })

  specify('update an admin user',() => {
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(500);
    cy.get(pageIds.grid).children().last().within(() => {
      cy.get(pageIds.email).invoke('val').should('equal',editedUser.email);
    })
  })

  specify('cannot update with invalid input', () => {
    cy.get(pageIds.grid).children().last().within(() => {
    
      cy.get(pageIds.email).clear();
      cy.get(pageIds.saveChangesButton).click();
    })

    cy.get(snackbarId).contains(failMessage);
    
    cy.get(pageIds.grid).children().last().within(() => {
      cy.get(pageIds.email).type(editedUser.email);

      cy.get(pageIds.password).clear();
      cy.get(pageIds.saveChangesButton).click();
    })
    
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cancel button cancels the edit', () => {
    cy.get(pageIds.cancelChangesButton).click();
    cy.get(pageIds.saveChangesButton).should('not.exist');
    cy.get(pageIds.grid).children().last().within(() => {
      cy.get(pageIds.email).invoke('val').should('equal',user.email);
    })
  })

  specify('cannot edit multiple users at once', () => {
    cy.get(pageIds.editButton).should('not.exist');
  })
})

export {}