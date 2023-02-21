describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('input[id="email"]').clear().type('info@integrityinspired.com');
    cy.get('input[id="password"]').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
  });

  specify('update a company', () => {
    cy.get('button').contains('Edit User').click();

    cy.get('input[id="modalCompany"]').clear().type('Test Company');
    //cy.get('input[id="modalUsername"]').clear().type('Mr. Test');
    cy.get('input[id="modalEmail"]').clear().type('test@test.com');
    cy.get('input[id="modalPassword"]').clear().type('test');
    cy.get('button').contains('Submit').click();
  })

  specify('cannot update with invalid input', () => {

  })
})

export {}