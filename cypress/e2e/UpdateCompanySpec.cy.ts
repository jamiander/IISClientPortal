
import { UserRadioIds } from "../../src/Components/User/ManageUsersDisplay";
import { EditUserModalIds } from "../../src/Components/User/UpdateUserListModal";
import { AddHash } from "./TestHelpers";

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

  const failMessage = 'Validation Failed';
  const modalIds = AddHash(EditUserModalIds);
  const radioIds = AddHash(UserRadioIds);

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get(radioIds.all).click();
    cy.get('table').contains(existingCompany.name);
    cy.get('button').contains('Edit Client').click();
  });

  specify('update a company', () => {
    cy.get(modalIds.company).clear().type(company.name);
    cy.get(modalIds.email).clear().type(company.email);
    cy.get(modalIds.password).clear().type(company.password);
    cy.get('button').contains('Submit').click();

    cy.get('table').contains(company.name);
    //cy.get('#toast-default').contains('User Update Dispatched');
  })

  specify('cannot update with invalid input', () => {
    cy.get(modalIds.company).clear();

    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get(modalIds.company).type(company.name);

    cy.get(modalIds.email).clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get(modalIds.email).type(company.email);

    cy.get(modalIds.password).clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot rename a company the name of another company', () => {
    cy.get(modalIds.company).clear().type(existingCompany.name);

    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot rename a user the name of another user', () => {
    cy.get(modalIds.email).clear().type(existingCompany.email);

    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains(failMessage);
  })

  specify('close button closes the modal', () => {
    cy.get('button').contains('Close').click();
    cy.get(modalIds.modal).should('not.exist');
  })
})

export {}