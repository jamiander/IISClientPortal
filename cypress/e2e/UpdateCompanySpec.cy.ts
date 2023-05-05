import { AdminUser, TestConstants } from "./TestHelpers";

describe('update company spec', () => {
  const company = {
    name: "Test Company",
    email: "test@test.com",
    password: "test"
  }

  const existingCompany = {
    id: "53beceb7-054b-4740-830f-98a1dc0cc991",
    name: "Integrity Inspired Solutions",
    email: "info@integrityinspired.com",
    password: "password"
  }

  const existingCompany2 = {
    name: "Staples"
  }

  const consts = TestConstants;
  const failMessage = consts.validationFailedMessage
  const badToastId = consts.snackbarId;//consts.toastIds.main;
  const navIds = consts.navPanelIds;
  const pageIds = consts.companyPageIds;
  const admin = AdminUser;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type(admin.email);
    cy.get('#password').clear().type(admin.password);
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    //cy.get('button').contains('Admin').click();
    //cy.get('button').contains('Clients').click();
    cy.get(navIds.company).click();
    cy.get('#companyPageCard'+existingCompany.id).within(() => {
      cy.get(pageIds.editClientNameButton).click();
    })
    
  });

  specify('update a company', () => {
    /*cy.get(modalIds.company).clear().type(company.name);
    cy.get(modalIds.email).clear().type(company.email);
    cy.get(modalIds.password).clear().type(company.password);*/
    cy.get(pageIds.clientNameInput).clear().type(company.name);
    cy.get(pageIds.saveClientButton).click();

    cy.contains(company.name);
    //cy.get(badToastId).contains('User Update Dispatched');
  })

  specify('cannot update with invalid input', () => {
    cy.get(pageIds.clientNameInput).clear();

    cy.get(pageIds.saveClientButton).click();
    cy.get(badToastId).contains(failMessage);
    //cy.get(modalIds.company).type(company.name);

    /*cy.get(modalIds.email).clear();
    cy.get(pageIds.saveClientButton).click();
    cy.get(badToastId).contains(failMessage);
    //cy.get(modalIds.email).type(company.email);

    //cy.get(modalIds.password).clear();
    cy.get(pageIds.saveClientButton).click();
    cy.get(badToastId).contains(failMessage);*/
  })

  specify('cannot rename a company the name of another company', () => {
    cy.get(pageIds.clientNameInput).clear().type(existingCompany2.name);
    cy.get(pageIds.saveClientButton).click();
    cy.get(badToastId).contains(failMessage);
  })

  /*specify('cannot rename a user the name of another user', () => {
    //cy.get(modalIds.email).clear().type(existingCompany.email);

    cy.get('button').contains('Submit').click();

    cy.get(badToastId).contains(failMessage);
  })*/

  /*specify('close button closes the modal', () => {
    cy.get('button').contains('Close').click();
    //cy.get(modalIds.modal).should('not.exist');
  })*/

  specify('cancel button cancels the changes', () => {
    cy.get(pageIds.cancelClientButton).click();
    cy.contains(existingCompany.name);
  })

  specify('cannot edit multiple users at once', () => {
    cy.get('button').contains('Edit').should('not.exist');
  })
})

export {}