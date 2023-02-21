describe('add user spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
  })

  specify('this spec is currently unused; come back when users are no longer synonymous with companies', () => {

  })

  /*specify('add a new user', () => {
    cy.get('.m-\\[2\\%\\] > :nth-child(2) > .outline').clear().type('info@integrityinspired.com');
    cy.get(':nth-child(3) > .outline').clear().type('crowmonitorteam');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();

    cy.get('button').contains('Add User').click();
    cy.get('.space-x-3 > :nth-child(4)').select(1);
    cy.get('.space-x-3 > :nth-child(6)').type('Mr. Test');
    cy.get('.space-x-3 > :nth-child(8)').type('test@testing.com');
    cy.get('.space-x-3 > :nth-child(10)').type('ilovetesting');
    
    cy.get('button').contains('Submit').click();

    cy.contains('Mr. Test');
  })

  specify('clients cannot access admin page', () => {
    cy.get('.m-\\[2\\%\\] > :nth-child(2) > .outline').clear().type('dummy@fakecompany.com');
    cy.get(':nth-child(3) > .outline').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').should('not.exist');
  });
*/
})

export {}