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
    title: "IIS Initiative 2"
  }

  const consts = TestConstants;
  const failMessage = consts.validationFailedMessage;
  const snackbarId = consts.snackbarId;
  const modalIds = consts.initiativeModalIds;
  const radioIds = consts.initiativeDisplayRadioIds;
  const tableIds = consts.initiativeTableIds;
  const user = IntegrityUser;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type(user.email);
    cy.get('#password').clear().type(user.password);
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get(radioIds.all).click();
    cy.get(tableIds.companyNameFilter).clear().type(init.companyName);
    cy.get('table').contains(init.companyName);
    cy.get('#editInitiativeButton0').click();

    cy.get(modalIds.title).clear().type(init.title);
    cy.get(modalIds.startDate).clear().type(init.startDate);
    cy.get(modalIds.targetDate).clear().type(init.targetDate);
    cy.get(modalIds.totalItems).clear().type(init.totalItems);
  });

  specify('update an initiative', () => {
    cy.get('button').contains('Submit').click();
    cy.wait(500);
    cy.get(radioIds.all).click();
    cy.get(tableIds.companyNameFilter).clear().type(init.companyName);
    cy.get('table').contains(init.title);
  })

  specify('cannot update with blank fields', () => {
    cy.get(modalIds.title).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
    cy.get(modalIds.title).type(init.title);

    cy.get(modalIds.startDate).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
    cy.get(modalIds.startDate).type(init.startDate);

    cy.get(modalIds.targetDate).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
    cy.get(modalIds.targetDate).type(init.targetDate);

    cy.get(modalIds.totalItems).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot have a target date before a start date', () => {
    cy.get(modalIds.startDate).clear().type("2023-04-20");
    cy.get(modalIds.targetDate).clear().type("2023-04-19");

    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot rename an initative the name of another initiative within that company', () => {
    cy.get(modalIds.title).clear().type(existingInit.title); //TODO: figure out how to get an existing init for this company

    cy.get(modalIds.submitButton).click();

    cy.get(snackbarId).contains(failMessage);
  })

  specify('close button closes the modal', () => {
    cy.get(modalIds.closeButton).click();
    cy.get(modalIds.modal).should('not.exist');
  })
})

export {}