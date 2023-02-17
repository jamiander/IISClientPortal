describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
  });

  specify('add new company', () => {
    cy.get('.m-\\[2\\%\\] > :nth-child(2) > .outline').clear().type('info@integrityinspired.com');
    cy.get(':nth-child(3) > .outline').clear().type('crowmonitorteam');
    cy.get('button').contains('Submit').click();
  })
})

export {}
