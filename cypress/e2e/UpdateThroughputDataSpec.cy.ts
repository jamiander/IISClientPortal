import { TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.editThroughputIds;

const initiative = 'IIS Initiative';
const company = 'Integrity Inspired Solutions';
const waitTime = 500;

describe('update throughput spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();

    cy.get('button').contains('Edit Data').click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiative);
  })

  specify('update completed amount', () => {
    //get before amount

    //do update

    //check for updated amount
  })

  specify('change the date of an entry', () => {
    //this is only if date-changing is something we support
  })

  specify('close button closes modal', () => {
    cy.get(modalIds.modal);
    cy.get(modalIds.closeButton).click();
    cy.wait(waitTime);

    cy.get(modalIds.modal).should('not.exist');
  })

  specify('cannot update throughput data to an invalid date', () => {
    //valid completed amount

    //empty date fields
    //NaN date fields
    //out of range date fields
  })

  specify('cannot update throughput data to an invalid completed amount', () => {
    //valid date

    //empty completed amount
    //NaN completed amount
    //negative completed amount
  })

});

