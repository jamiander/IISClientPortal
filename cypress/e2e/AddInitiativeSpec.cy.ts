import { IntegrityUser, TestConstants } from "./TestHelpers";

describe('add initiative spec', () => {
  const init = {
    companyId: 0,
    title: "Integration Test Initiative",
    date: {
      month: "04",
      day: "01",
      year: "2023"
    },
    totalItems: "3"
  }

  /*const existingInit = {
    title: "IIS Initiative",
    companyName: "Integrity Inspired Solutions"
  }*/

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

    cy.get('button').contains('Add Initiative').click();

    cy.get(modalIds.company).select(1);
    cy.get(modalIds.title).clear().type(init.title);
    cy.get(modalIds.startDate).clear().type("2020-01-01");
    cy.get(modalIds.targetDate).clear().type("2023-01-03");
    cy.get(modalIds.totalItems).clear().type(init.totalItems);
  });

  specify('add new initiative',() => {
    cy.get('button').contains('Submit').click();
    cy.get(tableIds.initiativeTitleFilter).type(init.title);
    cy.get('table').contains(init.title);
  })

  specify('cannot add an initiative with the name of an existing initiative for a given company', () => {
    cy.get('tr').siblings().first().then(($row) => {

      cy.get(tableIds.initiativeTitle).invoke('text').then(($txt) => { 
        const existingInitTitle = $txt;

        cy.get(tableIds.companyName).invoke('text').then(($txt2) => { 
          const existingInitCompanyName = $txt2;
          
          cy.get(modalIds.company).select(existingInitCompanyName);
          cy.get(modalIds.title).clear().type(existingInitTitle);

          cy.get('button').contains('Submit').click();
          cy.get(snackbarId).contains(failMessage);
        });
      });
    });
  })

  specify('cannot add when a field is left blank', () => {
    cy.get(modalIds.title).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
    cy.get(modalIds.title).type(init.title);

    cy.get(modalIds.startDate).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
    cy.get(modalIds.startDate).type("2020-01-01");

    cy.get(modalIds.targetDate).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
    cy.get(modalIds.targetDate).type("2020-01-01");

    cy.get(modalIds.totalItems).clear();
    cy.get('button').contains('Submit').click();
    cy.get(snackbarId).contains(failMessage);
    cy.get(modalIds.totalItems).type(init.totalItems);
  })

  specify('cannot have a target date before a start date', () => {
    cy.get(modalIds.startDate).clear().type("2023-04-20");
    cy.get(modalIds.targetDate).clear().type("2023-04-19");

    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).contains(failMessage);
  })

  specify('cannot add when total items are negative', () => {
    cy.get(modalIds.totalItems).clear().type("-3");
    cy.get('button').contains('Submit').click();

    cy.get(snackbarId).contains(failMessage);
  })

  //Cypress does not allow invalid dates in date pickers, so we cannot test for NaN or 2/30/yyyy

  specify('close button closes the modal', () => {
    cy.get('button').contains('Close').click();
    cy.get(modalIds.modal).should('not.exist');
  })
})

export {}