describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
  });

  specify('add new company', () => {
    cy.get('.m-\\[2\\%\\] > :nth-child(2) > .outline').clear().type('info@integrityinspired.com');
    cy.get(':nth-child(3) > .outline').clear().type('crowmonitorteam');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Add Company').click();

    cy.get('.space-x-3 > .outline').clear().type('Test Company');

    cy.get('button').contains('Submit').click();

    cy.contains('Test Company');
  })
})

export {}
