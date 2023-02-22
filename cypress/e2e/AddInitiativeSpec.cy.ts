describe('add initiative spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('input[id="email"]').clear().type('info@integrityinspired.com');
    cy.get('input[id="password"]').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Add Initiative').click();
  });

  specify('add new initiative',() => {

  })

  specify('cannot add an initiative with the name of an existing initiative for a given company', () => {

  })
})

export {}