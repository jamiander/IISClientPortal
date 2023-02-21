describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('input[id="email"]').clear().type('info@integrityinspired.com');
    cy.get('input[id="password"]').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Edit User').click();
    cy.get('table').contains('Integrity Inspired Solutions');
  });

  specify('update a company', () => {
    cy.get('input[id="modalCompany"]').clear().type('Test Company');
    cy.get('input[id="modalEmail"]').clear().type('test@test.com');
    cy.get('input[id="modalPassword"]').clear().type('test');
    cy.get('button').contains('Submit').click();

    cy.get('table').contains('Test Company');
  })

  specify('cannot update with invalid input', () => {
    cy.get('input[id="modalCompany"]').clear();
    cy.get('input[id="modalEmail"]').clear();
    cy.get('input[id="modalPassword"]').clear();

    cy.get('button').should('be.disabled');
  })

  specify('cannot rename a company the name of another company', () => {
    cy.get('input[id="modalCompany"]').clear().type('Fake Company');

    cy.get('button').should('be.disabled');
  })

  specify('cannot rename a user the name of another user', () => {
    cy.get('input[id="modalEmail"]').clear().type('info@company');

    cy.get('button').should('be.disabled');
  })
})

export {}