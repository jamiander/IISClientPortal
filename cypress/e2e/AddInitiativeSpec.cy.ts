import { TestConstants } from "./TestHelpers";

describe('add initiative spec', () => {
  const init = {
    companyId: 0,
    title: "Test Initiative",
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
  const badToastId = consts.toastIds.main;
  const modalIds = consts.initiativeModalIds;
  const radioIds = consts.initiativeDisplayRadioIds;
  const tableIds = consts.initiativeTableIds;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();
    cy.get(radioIds.all).click();
    cy.get('button').contains('Add Initiative').click();

    cy.get('select').select(1);
    cy.get(modalIds.title).clear().type(init.title);
    /*cy.get(modalIds.date.month).clear().type(init.date.month);
    cy.get(modalIds.date.day).clear().type(init.date.day);
    cy.get(modalIds.date.year).clear().type(init.date.year);*/
    cy.get(modalIds.date).clear().type("2020-01-01");
    cy.get(modalIds.totalItems).clear().type(init.totalItems);
  });

  specify('add new initiative',() => {
    cy.get('button').contains('Submit').click();

    cy.get('table').contains(init.title);
  })

  specify('cannot add an initiative with the name of an existing initiative for a given company', () => {
    cy.get('tr').siblings().first().then(($row) => {

      cy.get(tableIds.initiativeTitle).invoke('text').then(($txt) => { 
        const existingInitTitle = $txt;

        cy.get(tableIds.companyName).invoke('text').then(($txt2) => { 
          const existingInitCompanyName = $txt2;
          
          cy.get('select').select(existingInitCompanyName);
          cy.get(modalIds.title).clear().type(existingInitTitle);

          cy.get('button').contains('Submit').click();
          cy.get(badToastId).contains(failMessage);
        });
      });
    });
  })

  specify('cannot add when a field is left blank', () => {
    cy.get(modalIds.title).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(badToastId).contains(failMessage);
    cy.get(modalIds.title).type(init.title);

    /*cy.get(modalIds.date.month).clear();
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
    cy.get(modalIds.date.month).type(init.date.month);

    cy.get(modalIds.date.day).clear();
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
    cy.get(modalIds.date.day).type(init.date.day);

    cy.get(modalIds.date.year).clear();
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
    cy.get(modalIds.date.year).type(init.date.year);*/

    cy.get(modalIds.date).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(badToastId).contains(failMessage);
    cy.get(modalIds.date).type("2020-01-01");

    cy.get(modalIds.totalItems).clear();
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
    cy.get(modalIds.totalItems).type(init.totalItems);
  })

  specify('cannot add when total items are negative', () => {
    cy.get(modalIds.totalItems).clear().type("-3");
    cy.get('button').contains('Submit').click();

    cy.get(badToastId).contains(failMessage);
  })

  //Cypress does not allow invalid dates in date pickers
  /*specify('cannot add when a date is not in a valid format', () => {
    cy.get(modalIds.date.month).clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);

    cy.get(modalIds.date.month).clear().type("ab");
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);

    cy.get(modalIds.date.month).clear().type("13");
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);

    cy.get(modalIds.date.month).clear().type(init.date.month);


    cy.get(modalIds.date.day).clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);

    cy.get(modalIds.date.day).clear().type("ab");
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);

    cy.get(modalIds.date.day).clear().type("32");
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);

    cy.get(modalIds.date.day).clear().type(init.date.day);


    cy.get(modalIds.date.year).clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);

    cy.get(modalIds.date.year).clear().type("abcd");
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
    
  })*/

  specify('close button closes the modal', () => {
    cy.get('button').contains('Close').click();
    cy.get(modalIds.modal).should('not.exist');
  })
})

export {}