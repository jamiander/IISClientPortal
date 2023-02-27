
import { UserRadioIds } from "../../src/Components/User/ManageUsersDisplay";
import { EditUserModalIds } from "../../src/Components/User/UpdateUserListModal";
import { AddHash } from "./TestHelpers";

describe('add company spec', () => {

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
    cy.get('button').contains('Add Client').click();
  });

  specify('add new company', () => {
    cy.get(modalIds.company).clear().type('Test Company');
    cy.get(modalIds.email).clear().type('test@test.com');
    cy.get(modalIds.password).clear().type('test');
    cy.get('button').contains('Submit').click();

    cy.contains('Test Company');
  })

  specify('cannot add a company that already exists', () => {
    cy.get(modalIds.company).clear().type('Integrity Inspired Solutions');
    cy.get(modalIds.email).clear().type('test@test.com');
    cy.get(modalIds.password).clear().type('test');

    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot add a company with the same email as another company', () => {
    cy.get(modalIds.company).clear().type('Test Company');
    cy.get(modalIds.email).clear().type('info@integrityinspired.com');
    cy.get(modalIds.password).clear().type('test');

    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot add a company with invalid input', () => {
    cy.get(modalIds.company).clear();
    cy.get(modalIds.email).clear();
    cy.get(modalIds.password).clear();

    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

  specify('close button closes the modal', () => {
    cy.get('button').contains('Close').click();
    cy.get(modalIds.modal).should('not.exist');
  })

})

export {}
