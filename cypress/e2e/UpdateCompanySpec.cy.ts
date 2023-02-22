describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('input[id="email"]').clear().type('info@integrityinspired.com');
    cy.get('input[id="password"]').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('table').contains('Integrity Inspired Solutions');
    cy.get('button').contains('Edit User').click();
  });

  specify('update a company', () => {
    cy.get('input[id="modalCompany"]').clear().type('Test Company');
    cy.get('input[id="modalEmail"]').clear().type('test@test.com');
    cy.get('input[id="modalPassword"]').clear().type('test');
    cy.get('button').contains('Submit').click();

    cy.get('table').contains('Test Company');
    cy.get('#toast-default').contains('User Update Dispatched');
  })

  specify('cannot update with invalid input', () => {
    cy.get('#modalCompany').clear();

    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains('Validation Failed');
    cy.get('#modalCompany').type('Test Company');

    cy.get('#modalEmail').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains('Validation Failed');
    cy.get('#modalEmail').type('test@test.com');

    cy.get('#modalPassword').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains('Validation Failed');
  })

  specify('cannot rename a company the name of another company', () => {
    cy.get('input[id="modalCompany"]').clear().type('Integrity Inspired Solutions');

    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains('Validation Failed');
  })

  specify('cannot rename a user the name of another user', () => {
    cy.get('input[id="modalEmail"]').clear().type('info@integrityinspired.com');

    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains('Validation Failed');
  })
})

export {}