import { AdminUser, MBPICompany, TestConstants } from "./TestHelpers";

describe('update company spec', () => {
  const company = {
    name: "Test Company",
    email: "test@test.com",
    password: "test"
  }

  const existingCompany = MBPICompany;

  const existingCompany2 = {
    name: "Staples"
  }

  const consts = TestConstants;
  const failMessage = consts.validationFailedMessage
  const snackbarId = consts.snackbarId;
  const navIds = consts.navPanelIds;
  const pageIds = consts.clientPageIds;
  const loginIds = consts.loginPageIds;
  const admin = AdminUser;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(admin.email);
    cy.get(loginIds.password).clear().type(admin.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(navIds.menuButton).click();
    cy.get(navIds.client).click();
    cy.get(pageIds.radioIds.all).click();
    cy.contains(existingCompany.name).parent().within(() => {
      cy.get(pageIds.editClientButton).click();
    })
    
  });

  specify('update a company', () => {
    cy.get(pageIds.saveClientChangesButton).parent().parent().within(() => {
      cy.get(pageIds.name).clear().type(company.name);
      cy.get(pageIds.saveClientChangesButton).click();
    });

    cy.get(pageIds.table).should('contain',company.name);
  })

  specify('cannot update with invalid input', () => {
    cy.get(pageIds.saveClientChangesButton).parent().parent().within(() => {
      cy.get(pageIds.name).clear();
      cy.get(pageIds.saveClientChangesButton).click();
    });

    cy.get(snackbarId).should('contain',failMessage);
    //cy.get(pageIds.name).type(company.name);
  })

  specify('cannot rename a company the name of another company', () => {
    cy.get(pageIds.saveClientChangesButton).parent().parent().within(() => {
      cy.get(pageIds.name).clear().type(existingCompany2.name);
      cy.get(pageIds.saveClientChangesButton).click();
    });

    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button cancels the changes', () => {
    cy.get(pageIds.cancelClientChangesButton).click();
    cy.get(pageIds.table).should('contain',existingCompany.name);
  })

  specify('cannot edit multiple users at once', () => {
    cy.get(pageIds.editClientButton).should('be.disabled');
  })
})

export {}