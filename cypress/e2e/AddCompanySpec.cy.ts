import { AdminUser, MBPICompany, TestConstants } from "./TestHelpers";

describe('add company spec', () => {

  const company = {
    name: "BTest Company",
    email: "test@test.com",
    password: "test"
  }

  const existingCompany = MBPICompany;

  const consts = TestConstants;
  const failMessage = consts.validationFailedMessage;
  const snackbarId = consts.snackbarId;
  //const radioIds = consts.userDisplayRadioIds;
  const navIds = consts.navPanelIds;
  const pageIds = consts.companyPageIds;
  const admin = AdminUser;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type(admin.email);
    cy.get('#password').clear().type(admin.password);
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get(navIds.company).click();
    /*cy.get('button').contains('Clients').click();
    cy.get(radioIds.all).click();
    */cy.get(pageIds.addClientButton).click();
  });

  specify('add new company', () => {
    cy.get(pageIds.clientNameInput).type(company.name);
    cy.get(pageIds.saveClientButton).click();

    cy.contains(company.name);
  })

  specify('cannot add a company that already exists', () => {
    cy.get(pageIds.clientNameInput).clear().type(existingCompany.name);

    cy.get(pageIds.saveClientButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot add a company with invalid input', () => {
    cy.get(pageIds.clientNameInput).clear();

    cy.get(pageIds.saveClientButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cancel button does not leave a blank company', () => {
    cy.get(pageIds.cancelClientButton).click();
    cy.get(pageIds.clientNameInput).should('not.exist');
  })

  specify('cannot add two companies at once', () => {
    cy.get(pageIds.addClientButton).should('be.disabled');
  })

  specify('cannot add company as non-Integrity user', () => {

  })

  specify('cannot add company as regular Integrity user', () => {

  })

})

export {}
