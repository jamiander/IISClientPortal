import { TestConstants } from "./TestHelpers";

describe('update initiative spec', () => {

  const init = {
    companyId: 0,
    title: "Test Initiative 1234",
    /*date:{
      month: "04",
      day: "01",
      year: "2023"
    },*/
    date: "2023-04-01",
    totalItems: "3"
  }

  const existingInit = {
    title: "IIS Initiative 2"
  }

  const consts = TestConstants;
  const failMessage = consts.validationFailedMessage;
  const badToastId = consts.toastId;
  const modalIds = consts.initiativeModalIds;
  const radioIds = consts.initiativeRadioIds;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();
    cy.get(radioIds.all).click();
    cy.get('table').contains('Integrity Inspired Solutions');
    cy.get('button').contains('Edit Initiative').click();

    cy.get(modalIds.title).clear().type(init.title);
    /*cy.get(modalIds.date.month).clear().type(init.date.month);
    cy.get(modalIds.date.day).clear().type(init.date.day);
    cy.get(modalIds.date.year).clear().type(init.date.year);*/
    cy.get(modalIds.date).clear().type(init.date);
    cy.get(modalIds.totalItems).clear().type(init.totalItems);
  });

  specify('update an initiative', () => {
    cy.get('button').contains('Submit').click();

    cy.get('table').contains(init.title);
  })

  specify('cannot update with blank fields', () => {
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
    cy.get(modalIds.date).type(init.date);

    cy.get(modalIds.totalItems).clear();
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
  })

  specify('cannot rename an initative the name of another initiative within that company', () => {
    cy.get(modalIds.title).clear().type(existingInit.title); //TODO: figure out how to get an existing init for this company

    cy.get(modalIds.submitButton).click();

    cy.get(badToastId).contains(failMessage);
  })

  specify('close button closes the modal', () => {
    cy.get(modalIds.closeButton).click();
    cy.get(modalIds.modal).should('not.exist');
  })
})

export {}