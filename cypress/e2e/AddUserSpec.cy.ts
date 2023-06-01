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
const snackbarWaitTime = consts.snackbarWaitTime;
const admin = AdminUser;

describe('add non-Integrity user as Integrity spec', () => {

  const company = MBPICompany;

  const pageIds = consts.usersPageIds;

  beforeEach(() => {
    cy.login(admin);
    
    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.users).click();
    cy.wait(500);
    cy.getByData(pageIds.addButton).click();
  })

  specify('add a new user as an Integrity user', () => {
    cy.getByData(pageIds.selectCompany).parent()
      .click()
      .get(`ul > li[data-value="${company.id}"]`)
      .click();

    cy.getByData(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.getByData(pageIds.editEmail).type(user.email);
      cy.getByData(pageIds.editPassword).type(user.password);
    })
    
    cy.getByData(pageIds.saveChangesButton).click();
    cy.getByData(pageIds.saveChangesButton).should('not.exist');
    cy.contains(user.email);
  })

  specify('cannot add a user with invalid input', () => {
    cy.getByData(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.getByData(pageIds.editEmail).type(user.email);
      cy.getByData(pageIds.editPassword).type(user.password);
    })

    cy.getByData(pageIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(pageIds.selectCompany).parent()
      .click()
      .get(`ul > li[data-value="${company.id}"]`)
      .click();

    cy.getByData(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.getByData(pageIds.editEmail).clear();
      cy.getByData(pageIds.editPassword).clear().type(user.password);
    })
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.getByData(pageIds.editPassword).clear();
      cy.getByData(pageIds.editEmail).clear().type(user.email);
    })
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    
  })

  specify('cancel does not leave behind the new user', () => {
    cy.getByData(pageIds.selectCompany).parent()
      .click()
      .get(`ul > li[data-value="${company.id}"]`)
      .click();

    cy.getByData(pageIds.saveChangesButton).parent().parent().within(() => {
      cy.getByData(pageIds.editEmail).type(user.email);
      cy.getByData(pageIds.editPassword).type(user.password);
    })

    cy.getByData(pageIds.cancelChangesButton).click();
    cy.contains(user.email).should('not.exist');
    cy.getByData(pageIds.saveChangesButton).should('not.exist');
  })
})


describe("add non-Integrity user as non-Integrity user spec", () => {

  const pageIds = consts.usersPageIds;

  beforeEach(() => {
    cy.login(MBPIAdminUser);

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.users).click();
    cy.wait(1000);
    cy.getByData(pageIds.addButton).click();
  })

  specify('add a new non-Integrity user as non-Integrity user',  () => {
    cy.getByData(pageIds.editEmail).type(user.email);
    cy.getByData(pageIds.editPassword).type(user.password);

    cy.getByData(pageIds.saveChangesButton).click();
    cy.getByData(pageIds.email)
      .should('contain', user.email);
    
    cy.getByData(pageIds.saveChangesButton).should('not.exist');
    cy.getByData(pageIds.editButton).should('exist');
  })

  specify('cannot add a user with invalid input', () => {
    cy.getByData(pageIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(pageIds.editEmail).type(user.email);
    cy.getByData(pageIds.editPassword).type(user.password);

    cy.getByData(pageIds.editEmail).clear();
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(pageIds.editEmail).type(user.email);

    cy.getByData(pageIds.editPassword).clear();
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add multiple users at once', () => {
    cy.getByData(pageIds.addButton).should('be.disabled');
  })

  specify('cancel does not leave behind the new user', () => {
    cy.getByData(pageIds.cancelChangesButton).click();
    cy.getByData(pageIds.email).contains(user.email).should('not.exist');
  })
})


describe("add Integrity user spec", () => {
  const pageIds = consts.integrityPageIds;

  beforeEach(() => {
    cy.login(admin);

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.integrity).click();
    cy.wait(500);
    cy.getByData(pageIds.addButton).click();
  })

  specify('add a new Integrity user', () => {
    cy.getByData(pageIds.editEmail).type(user.email);
    cy.getByData(pageIds.editPassword).type(user.password);
    cy.getByData(pageIds.editIsAdmin).find('input').check();

    cy.getByData(pageIds.saveChangesButton).click();
    cy.getByData(pageIds.email)
      //.invoke('val')
      .should('contain', user.email);
    
    cy.getByData(pageIds.saveChangesButton).should('not.exist');
    cy.getByData(pageIds.editButton).should('exist');
  })

  specify('cannot add a user with invalid input', () => {
    cy.getByData(pageIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(pageIds.editEmail).type(user.email);
    cy.getByData(pageIds.editPassword).type(user.password);

    cy.getByData(pageIds.editEmail).clear();
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(pageIds.editEmail).type(user.email);

    cy.getByData(pageIds.editPassword).clear();
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add multiple users at once', () => {
    cy.getByData(pageIds.addButton).should('be.disabled');
  })

  specify('cancel does not leave behind the new user', () => {
    cy.getByData(pageIds.cancelChangesButton).click();
    cy.getByData(pageIds.email).contains(user.email).should('not.exist');
  })

})

export {}