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
  const admin = AdminUser;

  beforeEach(() => {
    cy.login(admin);

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.client).click();
    cy.getByData(pageIds.radioIds.all).click();
    cy.getByData(pageIds.keywordFilter).type(existingCompany.name.slice(0,existingCompany.name.length-1));

    cy.contains(existingCompany.name).parent().within(() => {
      cy.getByData(pageIds.editClientButton).click();
    })
    
  });

  specify('update a company', () => {
    cy.getByData(pageIds.saveClientChangesButton).parent().parent().within(() => {
      cy.getByData(pageIds.editName).find('input').clear().type(company.name);
      cy.getByData(pageIds.saveClientChangesButton).click();
    });

    cy.getByData(pageIds.keywordFilter).clear().type(company.name);
    cy.getByData(pageIds.table).should('contain',company.name);
  })

  specify('cannot update with invalid input', () => {
    cy.getByData(pageIds.saveClientChangesButton).parent().parent().within(() => {
      cy.getByData(pageIds.editName).find('input').clear();
      cy.getByData(pageIds.saveClientChangesButton).click();
    });

    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot rename a company the name of another company', () => {
    cy.getByData(pageIds.saveClientChangesButton).parent().parent().within(() => {
      cy.getByData(pageIds.editName).find('input').clear().type(existingCompany2.name);
      cy.getByData(pageIds.saveClientChangesButton).click();
    });

    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button cancels the changes', () => {
    cy.getByData(pageIds.cancelClientChangesButton).click();
    cy.getByData(pageIds.table).should('contain',existingCompany.name);
  })

  specify.only('cannot edit multiple users at once', () => {
    cy.getByData(pageIds.cancelClientChangesButton).click();
    cy.getByData(pageIds.keywordFilter).find('input').clear();
    cy.getByData(pageIds.editClientButton).first().click();

    cy.getByData(pageIds.editClientButton).should('be.disabled');
  })
})

export {}