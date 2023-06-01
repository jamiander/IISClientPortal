import { AdminUser, IntegrityUser, MBPICompany, MBPIUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const failMessage = consts.validationFailedMessage;
const snackbarId = consts.snackbarId;
const navIds = consts.navPanelIds;
const pageIds = consts.clientPageIds;
const admin = AdminUser;
const user = MBPIUser;

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
    cy.login(admin);

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.client).click();
    cy.getByData(pageIds.radioIds.all).click();
    cy.getByData(pageIds.addClientButton).click();

    cy.getByData(pageIds.editName).type(company.name);
    cy.getByData(pageIds.editInitiativeTitle).type(init.title);
  });

  specify('add new company', () => {
    cy.getByData(pageIds.saveClientChangesButton).click();
    cy.getByData(pageIds.table).should('contain',company.name);
    cy.getByData(pageIds.saveClientChangesButton).should('not.exist');
  })

  specify('cannot add a company that already exists', () => {
    cy.getByData(pageIds.editName).clear().type(existingCompany.name);

    cy.getByData(pageIds.saveClientChangesButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot add a company with invalid input', () => {
    cy.getByData(pageIds.editName).clear();
    cy.getByData(pageIds.saveClientChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(pageIds.editName).type(company.name);

    cy.getByData(pageIds.editInitiativeTitle).clear();
    cy.getByData(pageIds.saveClientChangesButton).click();
    cy.wait(consts.snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button does not leave a blank company', () => {
    cy.getByData(pageIds.cancelClientChangesButton).click();
    cy.getByData(pageIds.name).contains(company.name).should('not.exist');
  })

  specify('cannot add two companies at once', () => {
    cy.getByData(pageIds.addClientButton).should('be.disabled');
  })

})

describe('add company spec (as non-Integrity admin)', () => {

  specify('cannot add company as non-Integrity user', () => {
    cy.login(user);

    cy.getByData(navIds.menuButton).should('not.exist');//.click();
    //cy.getByData(navIds.initiatives).should('exist');
    //cy.getByData(navIds.client).should('not.exist');
  })

  specify('cannot add company as regular Integrity user', () => {
    cy.login(IntegrityUser);

    cy.getByData(navIds.menuButton).should('not.exist');//.click();
    //cy.getByData(navIds.initiatives).should('exist');
    //cy.getByData(navIds.client).should('not.exist');
  })

})

export {}
