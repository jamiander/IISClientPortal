import { AdminUser, MBPIAdminUser, MBPICompany, TestConstants } from "./TestHelpers";

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
const snackbarWaitTime = consts.snackbarWaitTime;
const admin = AdminUser;

describe('add non-Integrity user as Integrity spec', () => {

  const company = MBPICompany;

  const pageIds = consts.usersPageIds;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(admin.email);
    cy.get(loginIds.password).clear().type(admin.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();
    
    cy.get(navIds.menuButton).click();
    cy.get(navIds.users).click();
    cy.wait(500);
    //cy.get("#editUserDataButton"+company.id).click();
    cy.get(pageIds.addButton).click();
  })

  specify('add a new user as an Integrity user', () => {
    cy.get(pageIds.selectCompany).parent()
      .click()
      .get(`ul > li[data-value="${company.id}"]`)
      .click();

    cy.get(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.get(pageIds.email).type(user.email);
      cy.get(pageIds.password).type(user.password);
    })
    
    cy.get(pageIds.saveChangesButton).click();
    cy.get(pageIds.saveChangesButton).should('not.exist');
    cy.contains(user.email);
  })

  specify('cannot add a user with invalid input', () => {
    cy.get(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.get(pageIds.email).type(user.email);
      cy.get(pageIds.password).type(user.password);
    })

    cy.get(pageIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(pageIds.selectCompany).parent()
      .click()
      .get(`ul > li[data-value="${company.id}"]`)
      .click();

    cy.get(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.get(pageIds.email).clear();
      cy.get(pageIds.password).clear().type(user.password);
    })
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);

    cy.get(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.get(pageIds.password).clear();
      cy.get(pageIds.email).clear().type(user.email);
    })
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    
  })

  specify('cancel does not leave behind the new user', () => {
    cy.get(pageIds.selectCompany).parent()
      .click()
      .get(`ul > li[data-value="${company.id}"]`)
      .click();

    cy.get(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.get(pageIds.email).type(user.email);
      cy.get(pageIds.password).type(user.password);
    })

    cy.get(pageIds.cancelChangesButton).click();
    cy.contains(user.email).should('not.exist');
    cy.get(pageIds.saveChangesButton).should('not.exist');
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

    cy.get(navIds.menuButton).click();
    cy.get(navIds.users).click();
    //cy.get("#editUserDataButton"+company.id).click();
    cy.wait(1000);
    cy.get(pageIds.addButton).click();
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
    cy.get(snackbarId).should('contain',failMessage);

    cy.get(pageIds.email).type(user.email);
    cy.get(pageIds.password).type(user.password);

    cy.get(pageIds.email).clear();
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(pageIds.email).type(user.email);

    cy.get(pageIds.password).clear();
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add multiple users at once', () => {
    cy.get(pageIds.addButton).should('be.disabled');
  })

  specify('cancel does not leave behind the new user', () => {
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

    cy.get(navIds.menuButton).click();
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
    cy.get(snackbarId).should('contain',failMessage);

    cy.get(pageIds.email).type(user.email);
    cy.get(pageIds.password).type(user.password);

    cy.get(pageIds.email).clear();
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(pageIds.email).type(user.email);

    cy.get(pageIds.password).clear();
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add multiple users at once', () => {
    cy.get(pageIds.addButton).should('be.disabled');
  })

  specify('cancel does not leave behind the new user', () => {
    cy.get(pageIds.cancelChangesButton).click();
    cy.get(pageIds.email).contains(user.email).should('not.exist');
  })

})

export {}