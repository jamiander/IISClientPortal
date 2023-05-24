import { IntegrityUser, TestConstants } from "./TestHelpers";

describe('update initiative spec', () => {

  const init = {
    companyName: 'Integrity Inspired Solutions',
    title: "Test Initiative 1234",
    startDate: "2023-01-01",
    targetDate: "2023-04-01",
    totalItems: "3"
  }

  const existingInit = {
    title: "IIS Initiative"
  }

  const consts = TestConstants;
  const failMessage = consts.validationFailedMessage;
  const snackbarId = consts.snackbarId;
  const radioIds = consts.initiativeDisplayRadioIds;
  const tableIds = consts.initiativeTableIds;
  const loginIds = consts.loginPageIds;
  const user = IntegrityUser;
  const snackbarWaitTime = consts.snackbarWaitTime;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get(loginIds.email).clear().type(user.email);
    cy.get(loginIds.password).clear().type(user.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(radioIds.all).click();
    cy.get(tableIds.companyNameFilter).clear().type(init.companyName);
    cy.get(tableIds.table).contains(init.companyName).parent().within(() => {
      cy.get(tableIds.editButton).click();
    });

    cy.get(tableIds.initiativeTitle).clear().type(init.title);
    cy.get(tableIds.startDate).clear().type(init.startDate);
    cy.get(tableIds.targetDate).clear().type(init.targetDate);
    cy.get(tableIds.totalItems).clear().type(init.totalItems);
  });

  specify('update an initiative', () => {
    cy.get(tableIds.saveChangesButton).click();
    cy.wait(500);
    cy.get(radioIds.all).click();
    cy.get(tableIds.companyNameFilter).clear().type(init.companyName);
    cy.get(tableIds.table).should('contain',init.title);
  })

  specify('cannot update with blank fields', () => {
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
  })

  specify('cannot have a target date before a start date', () => {
    cy.get(tableIds.startDate).clear().type("2023-04-20");
    cy.get(tableIds.targetDate).clear().type("2023-04-19");

    cy.get(tableIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot rename an initative the name of another initiative within that company', () => {
    cy.get(tableIds.initiativeTitle).clear().type(existingInit.title); //TODO: figure out how to get an existing init for this company

    cy.get(tableIds.saveChangesButton).click();

    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button does not save changes', () => {
    cy.get(tableIds.cancelChangesButton).click();
    cy.get(tableIds.table).should('not.contain',init.title);
  })
})

export {}