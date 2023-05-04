import { AdminUser, TestConstants } from "./TestHelpers";

describe('update company spec', () => {
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
  const navIds = consts.navPanelIds;
  const admin = AdminUser;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type(admin.email);
    cy.get('#password').clear().type(admin.password);
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    //cy.get('button').contains('Admin').click();
    //cy.get('button').contains('Clients').click();
    cy.get(navIds.company).click();
    cy.get('table').contains(existingCompany.name);
    cy.get('button').contains('Edit').click();
  });

  specify('update a company', () => {
    /*cy.get(modalIds.company).clear().type(company.name);
    cy.get(modalIds.email).clear().type(company.email);
    cy.get(modalIds.password).clear().type(company.password);*/
    cy.get('button').contains('Submit').click();

    cy.get('table').contains(company.name);
    //cy.get(badToastId).contains('User Update Dispatched');
  })

  specify('cannot update with invalid input', () => {
    //cy.get(modalIds.company).clear();

    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
    //cy.get(modalIds.company).type(company.name);

    //cy.get(modalIds.email).clear();
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
    //cy.get(modalIds.email).type(company.email);

    //cy.get(modalIds.password).clear();
    cy.get('button').contains('Submit').click();
    cy.get(badToastId).contains(failMessage);
  })

  specify('cannot rename a company the name of another company', () => {
    //cy.get(modalIds.company).clear().type(existingCompany.name);

    cy.get('button').contains('Submit').click();

    cy.get(badToastId).contains(failMessage);
  })

  specify('cannot rename a user the name of another user', () => {
    //cy.get(modalIds.email).clear().type(existingCompany.email);

    cy.get('button').contains('Submit').click();

    cy.get(badToastId).contains(failMessage);
  })

  specify('close button closes the modal', () => {
    cy.get('button').contains('Close').click();
    //cy.get(modalIds.modal).should('not.exist');
  })
})

export {}