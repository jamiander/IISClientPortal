import { AdminUser, IntegrityUser, MBPICompany, MBPIUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const failMessage = consts.validationFailedMessage;
const snackbarId = consts.snackbarId;
//const radioIds = consts.userDisplayRadioIds;
const navIds = consts.navPanelIds;
const pageIds = consts.clientPageIds;
const loginIds = consts.loginPageIds;
const admin = AdminUser;
const user = MBPIUser;

beforeEach(() => {
  cy.visit('http://localhost:3000/Login');
})

describe('add company spec (as Integrity admin)', () => {

  const company = {
    name: "BTest Company",
    email: "test@test.com",
    password: "test"
  }

  const existingCompany = MBPICompany;

  const init = {
    title: "My First Init"
  }

  beforeEach(() => {
    cy.get(loginIds.email).clear().type(admin.email);
    cy.get(loginIds.password).clear().type(admin.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(navIds.client).click();
    cy.get(pageIds.radioIds.all).click();
    cy.get(pageIds.addClientButton).click();

    cy.get(pageIds.name).type(company.name);
    cy.get(pageIds.initiativeTitle).type(init.title);
  });

  specify('add new company', () => {
    cy.get(pageIds.saveClientChangesButton).click();

    cy.contains(company.name);
  })

  specify('cannot add a company that already exists', () => {
    cy.get(pageIds.name).clear().type(existingCompany.name);

    cy.get(pageIds.saveClientChangesButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot add a company with invalid input', () => {
    cy.get(pageIds.name).clear();
    cy.get(pageIds.saveClientChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(pageIds.name).type(company.name);

    cy.get(pageIds.initiativeTitle).clear();
    cy.get(pageIds.saveClientChangesButton).click();
    cy.wait(consts.snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button does not leave a blank company', () => {
    cy.get(pageIds.cancelClientChangesButton).click();
    cy.get(pageIds.name).contains(company.name).should('not.exist');
  })

  specify('cannot add two companies at once', () => {
    cy.get(pageIds.addClientButton).should('be.disabled');
  })

})

describe('add company spec (as non-Integrity admin)', () => {

  specify('cannot add company as non-Integrity user', () => {
    cy.get(loginIds.email).clear().type(user.email);
    cy.get(loginIds.password).clear().type(user.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();
    cy.wait(1000);
    cy.get(navIds.dashboard).should('exist');
    cy.get(navIds.client).should('not.exist');
  })

  specify('cannot add company as regular Integrity user', () => {
    cy.get(loginIds.email).clear().type(IntegrityUser.email);
    cy.get(loginIds.password).clear().type(IntegrityUser.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();
    cy.wait(1000);
    cy.get(navIds.dashboard).should('exist');
    cy.get(navIds.client).should('not.exist');
  })

})

export {}
