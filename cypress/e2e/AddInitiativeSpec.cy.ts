import { AdminUser, IntegrityUser, MBPICompany, MBPIUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const failMessage = consts.validationFailedMessage;
const snackbarId = consts.snackbarId;
const radioIds = consts.initiativeDisplayRadioIds;
const tableIds = consts.initiativeTableIds;
const snackbarWaitTime = consts.snackbarWaitTime;
const loginIds = consts.loginPageIds;

const init = {
  companyId: 0,
  title: "Integration Test Initiative",
  startDate: "2020-01-01",
  targetDate: "2023-01-03",
  totalItems: "3"
}

/*const existingInit = {
  title: "IIS Initiative",
  companyName: "Integrity Inspired Solutions"
}*/

describe('add initiative spec', () => {
  
  const user = MBPIUser;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(user.email);
    cy.get(loginIds.password).clear().type(user.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(radioIds.all).click();

    cy.get(tableIds.addButton).click();
  });

  specify('add new initiative',() => {
    cy.get(tableIds.initiativeTitle).clear().type(init.title);
    cy.get(tableIds.startDate).clear().type(init.startDate);
    cy.get(tableIds.targetDate).clear().type(init.targetDate);
    cy.get(tableIds.totalItems).clear().type(init.totalItems);
    cy.get(tableIds.saveChangesButton).click();
    cy.get(tableIds.initiativeTitleFilter).type(init.title);
    cy.get(tableIds.table).should('contain',init.title);
  })

  specify('cannot add an initiative with the name of an existing initiative for a given company', () => {
    cy.get(tableIds.cancelChangesButton).click();
    cy.get(tableIds.table).children().first().then(($row) => {

      cy.get(tableIds.initiativeTitle).invoke('text').then(($txt) => { 
        const existingInitTitle = $txt;

        cy.get(tableIds.addButton).click();
        cy.get(tableIds.initiativeTitle).clear().type(existingInitTitle);
        cy.get(tableIds.startDate).clear().type(init.startDate);
        cy.get(tableIds.targetDate).clear().type(init.targetDate);
        cy.get(tableIds.totalItems).clear().type(init.totalItems);

        cy.get(tableIds.saveChangesButton).click();
        cy.get(snackbarId).should('contain',failMessage);
      });
    });
  })

  specify('cannot add when a field is left blank', () => {
    cy.get(tableIds.initiativeTitle).clear().type(init.title);
    cy.get(tableIds.startDate).clear().type(init.startDate);
    cy.get(tableIds.targetDate).clear().type(init.targetDate);
    cy.get(tableIds.totalItems).clear().type(init.totalItems);

    cy.get(tableIds.initiativeTitle).clear();
    cy.get(tableIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(tableIds.initiativeTitle).type(init.title);

    cy.get(tableIds.startDate).clear();
    cy.get(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(tableIds.startDate).type(init.startDate);

    cy.get(tableIds.targetDate).clear();
    cy.get(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(tableIds.targetDate).type(init.targetDate);

    cy.get(tableIds.totalItems).clear();
    cy.get(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(tableIds.totalItems).type(init.totalItems);
  })

  specify('cannot have a target date before a start date', () => {
    cy.get(tableIds.initiativeTitle).clear().type(init.title);
    cy.get(tableIds.totalItems).clear().type(init.totalItems);
    cy.get(tableIds.startDate).clear().type("2023-04-20");
    cy.get(tableIds.targetDate).clear().type("2023-04-19");

    cy.get(tableIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add when total items are negative', () => {
    cy.get(tableIds.initiativeTitle).clear().type(init.title);
    cy.get(tableIds.startDate).clear().type(init.startDate);
    cy.get(tableIds.targetDate).clear().type(init.targetDate);
    cy.get(tableIds.totalItems).clear().type(init.totalItems);
    cy.get(tableIds.totalItems).clear().type("-3");
    cy.get(tableIds.saveChangesButton).click();

    cy.get(snackbarId).should('contain',failMessage);
  })

  //Cypress does not allow invalid dates in date pickers, so we cannot test for NaN or 2/30/yyyy

  specify('close button closes the modal', () => {
    cy.get(tableIds.initiativeTitle).clear().type(init.title);
    cy.get(tableIds.startDate).clear().type(init.startDate);
    cy.get(tableIds.targetDate).clear().type(init.targetDate);
    cy.get(tableIds.totalItems).clear().type(init.totalItems);
    cy.get(tableIds.cancelChangesButton).click();
    cy.get(tableIds.table).should('not.contain',init.title);
  })
})

describe('add initiatives as Integrity user', () => {

  const admin = AdminUser;
  const company = MBPICompany;
  
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(admin.email);
    cy.get(loginIds.password).clear().type(admin.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(radioIds.all).click();

    cy.get(tableIds.addButton).click();

    cy.get(tableIds.companySelect).parent()
      .click()
      .get(`ul > li[data-value="${company.id}"]`)
      .click();
    cy.get(tableIds.initiativeTitle).clear().type(init.title);
    cy.get(tableIds.startDate).clear().type(init.startDate);
    cy.get(tableIds.targetDate).clear().type(init.targetDate);
    cy.get(tableIds.totalItems).clear().type(init.totalItems);
  });

  specify('add new initiative for a different company', () => {
    cy.get(tableIds.saveChangesButton).click();
    cy.get(tableIds.initiativeTitleFilter).type(init.title);
    cy.get(tableIds.table).should('contain',init.title);
  })
})

export {}