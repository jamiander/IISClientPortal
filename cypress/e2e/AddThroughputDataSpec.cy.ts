import { AddHash } from "./TestHelpers";

describe('add throughput data spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();
    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();
  })
  
  specify('add throughput data by file', () => {

  })

  specify('cannot add throughput data by file when a field is blank', () => {

  })

  specify('cannot add throughput data by file when file is the wrong type', () => {

  })

  specify('cannot add throughput data by file when file format is invalid', () => {

  })

})