
import { InitiativeModalIds } from "../../src/Components/Initiative/InitiativeModal";
import { AddHash } from "./TestHelpers";

describe('update initiative spec', () => {

  const init = {
    companyId: 0,
    title: "Test Initiative 1234",
    date:{
      month: "04",
      day: "01",
      year: "2023"
    },
    totalItems: "3"
  }

  const failMessage = 'Validation Failed';
  const modalIds = AddHash(InitiativeModalIds);

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('input[id="email"]').clear().type('info@integrityinspired.com');
    cy.get('input[id="password"]').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('table').contains('Integrity Inspired Solutions');
    cy.get('button').contains('Edit Initiative').click();

    cy.get(modalIds.title).clear().type(init.title);
    cy.get(modalIds.date.month).clear().type(init.date.month);
    cy.get(modalIds.date.day).clear().type(init.date.day);
    cy.get(modalIds.date.year).clear().type(init.date.year);
    cy.get(modalIds.totalItems).clear().type(init.totalItems);
  });

  specify('update an initiative', () => {
    cy.get('button').contains('Submit').click();

    cy.get('table').contains(init.title);
  })

  specify('cannot update with blank fields', () => {
    cy.get(modalIds.title).clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get(modalIds.title).type(init.title);

    cy.get(modalIds.date.month).clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get(modalIds.date.month).type(init.date.month);

    cy.get(modalIds.date.day).clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get(modalIds.date.day).type(init.date.day);

    cy.get(modalIds.date.year).clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get(modalIds.date.year).type(init.date.year);

    cy.get(modalIds.totalItems).clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot rename an initative the name of another initiative', () => {
    cy.get(modalIds.title).clear().type('IIS Initiative 2'); //TODO: figure out how to get an existing init for this company

    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains(failMessage);
  })

  specify('close button closes the modal', () => {
    cy.get('button').contains('Close').click();
    cy.get(modalIds.modal).should('not.exist');
  })
})

export {}