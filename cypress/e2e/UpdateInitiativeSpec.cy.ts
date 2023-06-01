import { AdminUser, IntegrityUser, TestConstants } from "./TestHelpers";

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
  const user = AdminUser;
  const snackbarWaitTime = consts.snackbarWaitTime;

  beforeEach(() => {
    cy.login(user);

    cy.getByData(radioIds.all).click();
    cy.getByData(tableIds.companyNameFilter).clear().type(init.companyName);
    cy.getByData(tableIds.table).contains(init.companyName).parent().within(() => {
      cy.getByData(tableIds.editButton).click();
    });

    cy.getByData(tableIds.editInitiativeTitle).clear().type(init.title);
    cy.getByData(tableIds.editStartDate).clear().type(init.startDate);
    cy.getByData(tableIds.editTargetDate).clear().type(init.targetDate);
    cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);
  });

  specify('update an initiative', () => {
    cy.getByData(tableIds.saveChangesButton).click();
    cy.wait(500);
    cy.getByData(radioIds.all).click();
    cy.getByData(tableIds.companyNameFilter).clear().type(init.companyName);
    cy.getByData(tableIds.table).should('contain',init.title);
  })

  specify('cannot update with blank fields', () => {
    cy.getByData(tableIds.editInitiativeTitle).clear();
    cy.getByData(tableIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(tableIds.editInitiativeTitle).type(init.title);

    cy.getByData(tableIds.editStartDate).clear();
    cy.getByData(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(tableIds.editStartDate).type(init.startDate);

    cy.getByData(tableIds.editTargetDate).clear();
    cy.getByData(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(tableIds.editTargetDate).type(init.targetDate);

    cy.getByData(tableIds.editTotalItems).clear();
    cy.getByData(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot have a target date before a start date', () => {
    cy.getByData(tableIds.editStartDate).clear().type("2023-04-20");
    cy.getByData(tableIds.editTargetDate).clear().type("2023-04-19");

    cy.getByData(tableIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot rename an initative the name of another initiative within that company', () => {
    cy.getByData(tableIds.editInitiativeTitle).clear().type(existingInit.title); //TODO: figure out how to get an existing init for this company

    cy.getByData(tableIds.saveChangesButton).click();

    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button does not save changes', () => {
    cy.getByData(tableIds.cancelChangesButton).click();
    cy.getByData(tableIds.table).should('not.contain',init.title);
  })
})

export {}