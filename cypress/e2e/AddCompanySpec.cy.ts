describe('add company spec', () => {

  const failMessage = 'Validation Failed';

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('input[id="email"]').clear().type('info@integrityinspired.com');
    cy.get('input[id="password"]').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Add Client').click();
  });

  specify('add new company', () => {
    cy.get('input[id="modalCompany"]').clear().type('Test Company');
    //cy.get('input[id="modalUsername"]').clear().type('Mr. Test');
    cy.get('input[id="modalEmail"]').clear().type('test@test.com');
    cy.get('input[id="modalPassword"]').clear().type('test');
    cy.get('button').contains('Submit').click();

    cy.contains('Test Company');
  })

  specify('cannot add a company that already exists', () => {
    cy.get('input[id="modalCompany"]').clear().type('Integrity Inspired Solutions');
    //cy.get('input[id="modalUsername"]').clear().type('Mr. Test');
    cy.get('input[id="modalEmail"]').clear().type('test@test.com');
    cy.get('input[id="modalPassword"]').clear().type('test');

    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot add a company with the same email as another company', () => {
    cy.get('#modalCompany').clear().type('Test Company');
    cy.get('#modalEmail').clear().type('info@integrityinspired.com');
    cy.get('#modalPassword').clear().type('test');

    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot add a company with invalid input', () => {
    cy.get('input[id="modalCompany"]').clear();
    //cy.get('input[id="modalUsername"]').clear();
    cy.get('input[id="modalEmail"]').clear();
    cy.get('input[id="modalPassword"]').clear();

    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

})

export {}
