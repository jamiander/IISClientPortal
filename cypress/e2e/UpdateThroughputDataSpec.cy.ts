import { TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.editThroughputIds;
const toastId = consts.toastIds.main;
const toastCloseId = consts.toastIds.closeButton;
const failMessage = consts.validationFailedMessage;

const initiative = 'IIS Initiative';
const company = 'Integrity Inspired Solutions';
const waitTime = 500;

describe('update throughput spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();

    cy.get('button').contains('Edit Data').click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiative);
  })

  specify('update completed amount', () => {
    cy.get(modalIds.itemsComplete).clear().type("33");

    cy.get(modalIds.submitButton).click();

    cy.get(toastId).contains("Success");
  })

  specify('update the date of an entry', () => {
    cy.get(modalIds.date).clear().type("2023-04-20");

    cy.get(modalIds.submitButton).click();

    cy.get(toastId).contains("Success");
  })

  specify('close button closes modal', () => {
    cy.get(modalIds.modal);
    cy.get(modalIds.closeButton).click();
    cy.wait(waitTime);

    cy.get(modalIds.modal).should('not.exist');
  })

  specify('cannot update throughput data if unselected company', () => {
    cy.get(modalIds.selectCompany).select(0);
    cy.get(modalIds.submitButton).click();
    cy.get(toastId).contains(failMessage);
  })

  specify('cannot update throughput data if unselected initiative', () => {
    cy.get(modalIds.selectInitiative).select(0);
    cy.get(modalIds.submitButton).click();
    cy.get(toastId).contains(failMessage);
  })

  specify('cannot update throughput data to an invalid date', () => {
    cy.get(modalIds.date).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(toastId).contains(failMessage);

    /*cy.get(modalIds.date).clear().type("2020-03-aa");   //Cypress doesn't allow this
    cy.get(modalIds.submitButton).click();
    cy.get(toastId).contains(failMessage);*/

    /*cy.get(modalIds.date).clear().type("1800-13-32");   //Same here
    cy.get(modalIds.submitButton).click();
    cy.get(toastId).contains(failMessage);*/
  })

  specify('cannot update throughput data to an invalid completed amount', () => {
    cy.get(modalIds.itemsComplete).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(toastId).contains(failMessage);
    cy.get(toastCloseId).click();

    cy.get(modalIds.itemsComplete).clear().type("a");
    cy.get(modalIds.submitButton).click();
    cy.get(toastId).contains(failMessage);
    cy.get(toastCloseId).click();

    cy.get(modalIds.itemsComplete).clear().type("-2");
    cy.get(modalIds.submitButton).click();
    cy.get(toastId).contains(failMessage);
  })

});

