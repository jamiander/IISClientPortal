import { initiativeModalIds } from "../../src/Components/InitiativeModal";
import { AddHash } from "./TestHelpers";

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

  const failMessage = 'Validation Failed';
  const modalIds = AddHash(initiativeModalIds);

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('input[id="email"]').clear().type('info@integrityinspired.com');
    cy.get('input[id="password"]').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Add Initiative').click();

    cy.get('select').select(1);
    cy.get(modalIds.title).clear().type(init.title);
    cy.get(modalIds.date.month).clear().type(init.date.month);
    cy.get(modalIds.date.day).clear().type(init.date.day);
    cy.get(modalIds.date.year).clear().type(init.date.year);
    cy.get(modalIds.totalItems).clear().type(init.totalItems);
  });

  specify('add new initiative',() => {
    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains('New Initiative Dispatched');
  })

  specify('cannot add an initiative with the name of an existing initiative for a given company', () => {
    cy.get(modalIds.title).clear().type('IIS Initiative'); //TODO: figure out how to make this match an existing initiative name for this company

    cy.get('button').contains('Submit').click();
  })

  specify('cannot add when a field is left blank', () => {
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
    cy.get(modalIds.totalItems).type(init.totalItems);
  })

  specify('cannot add when total items are negative', () => {
    cy.get(modalIds.totalItems).clear().type("-3");
    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot add when a date is not in a valid format', () => {
    cy.get(modalIds.date.month).clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get(modalIds.date.month).clear().type("ab");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get(modalIds.date.month).clear().type("13");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get(modalIds.date.month).clear().type(init.date.month);


    cy.get(modalIds.date.day).clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get(modalIds.date.day).clear().type("ab");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get(modalIds.date.day).clear().type("32");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get(modalIds.date.day).clear().type(init.date.day);


    cy.get(modalIds.date.year).clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get(modalIds.date.year).clear().type("abcd");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

  })
})

export {}