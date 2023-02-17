describe('add user spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
  })

  specify('add a new user', () => {
    cy.get('.m-\\[2\\%\\] > :nth-child(2) > .outline').type('info@integrityinspired.com');
    cy.get(':nth-child(3) > .outline').type('crowmonitorteam');
    cy.get('button').contains('Submit').click();

    cy.get(':nth-child(2) > .m-\\[2\\%\\] > :nth-child(3)').click();

    cy.get('.m-\\[2\\%\\] > .justify-end > .outline').click();
    cy.get('.space-x-3 > :nth-child(4)').type('1');
    cy.get('.space-x-3 > :nth-child(6)').type('Mr. Test');
    cy.get('.space-x-3 > :nth-child(8)').type('test@testing.com');
    cy.get('.space-x-3 > :nth-child(10)').type('ilovetesting');
    
    cy.get('button').contains('Submit').click();

    cy.contains('Mr. Test');
  })

  specify('clients cannot access admin page', () => {
    cy.get('.m-\\[2\\%\\] > :nth-child(2) > .outline').type('dummy@fakecompany.com');
    cy.get(':nth-child(3) > .outline').type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').should('not.exist');
  });

})

export {}