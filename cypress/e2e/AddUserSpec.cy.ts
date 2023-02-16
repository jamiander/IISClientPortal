describe('add user spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
  })

  specify('add a new user', () => {
    cy.get('.m-\\[2\\%\\] > :nth-child(2) > .outline').type('johnny@test.com');
    cy.get(':nth-child(3) > .outline').type('1234');
    cy.get(':nth-child(4) > .outline').click();

    cy.get(':nth-child(2) > .m-\\[2\\%\\] > :nth-child(3)').click();

    cy.get('.m-\\[2\\%\\] > .justify-end > .outline').click();
    cy.get('.space-x-3 > :nth-child(4)').type('0');
    cy.get('.space-x-3 > :nth-child(6)').type('Mr. Test');
    cy.get('.space-x-3 > :nth-child(8)').type('test@testing.com');
    cy.get('.space-x-3 > :nth-child(10)').type('ilovetesting');
    
    cy.get('.bg-lime-600').click();

    cy.contains('Mr. Test');
  })

  specify('clients cannot access admin page', () => {
    cy.get('.m-\\[2\\%\\] > :nth-child(2) > .outline').type('client@test.com');
    cy.get(':nth-child(3) > .outline').type('1234');
    cy.get(':nth-child(4) > .outline').click();

    cy.contains('Admin').should('not.exist');
  });

})

export {}