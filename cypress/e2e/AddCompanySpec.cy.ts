import { AdminUser, TestConstants } from "./TestHelpers";

describe('add company spec', () => {

  const company = {
    name: "Test Company",
    email: "test@test.com",
    password: "test"
  }

  const existingCompany = {
    name: "Integrity Inspired Solutions",
    email: "info@integrityinspired.com",
    password: "password"
  }

  const consts = TestConstants;
  const failMessage = consts.validationFailedMessage;
  const badToastId = consts.toastIds.main;
  const modalIds = consts.userModalIds;
  const radioIds = consts.userDisplayRadioIds;
  const navIds = consts.navPanelIds;
  const admin = AdminUser;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type(admin.email);
    cy.get('#password').clear().type(admin.password);
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get(navIds.company).click();
    /*cy.get('button').contains('Clients').click();
    cy.get(radioIds.all).click();
    */cy.get('button').contains('Add Client').click();
  });

  specify('add new company', () => {
    cy.get(modalIds.company).clear().type(company.name);
    cy.get(modalIds.email).clear().type(company.email);
    cy.get(modalIds.password).clear().type(company.password);
    cy.get('button').contains('Submit').click();

    cy.contains('Test Company');
  })

  specify('cannot add a company that already exists', () => {
    cy.get(modalIds.company).clear().type(existingCompany.name);
    cy.get(modalIds.email).clear().type(company.email);
    cy.get(modalIds.password).clear().type(company.password);

    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
  })

  specify('cannot add a company with the same email as another company', () => {
    cy.get(modalIds.company).clear().type(company.name);
    cy.get(modalIds.email).clear().type(existingCompany.email);
    cy.get(modalIds.password).clear().type(company.password);

    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
  })

  specify('cannot add a company with invalid input', () => {
    cy.get(modalIds.company).clear();
    cy.get(modalIds.email).clear();
    cy.get(modalIds.password).clear();

    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
  })

  specify('close button closes the modal', () => {
    cy.get('button').contains('Close').click();
    cy.get(modalIds.modal).should('not.exist');
  })

})

export {}
