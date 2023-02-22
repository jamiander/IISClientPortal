describe('update initiative spec', () => {

  const init = {
    title: "My Initiative",
    targetDate: "01/01/23",
    totalItems: "3"
  }

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('input[id="email"]').clear().type('info@integrityinspired.com');
    cy.get('input[id="password"]').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('table').contains('Integrity Inspired Solutions');
    cy.get('button').contains('Edit Initiative').click();
  });

  specify('update an initiative', () => {
    cy.get('#modalTitle').clear().type(init.title);
    cy.get('#modalTargetDate').clear().type(init.targetDate);
    cy.get('#modalTotalItems').clear().type(init.totalItems);
    cy.get('button').contains('Submit').click();

    cy.get('table').contains(init.title);
    cy.get('#toast-default').contains('User Update Dispatched');
  })

  specify('cannot update with invalid input', () => {
    cy.get('#modalTitle').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains('Validation Failed');
    cy.get('#modalTitle').type(init.title);

    cy.get('#modalTargetDate').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains('Validation Failed');
    cy.get('#modalTargetDate').type(init.targetDate);

    cy.get('#modalTotalItems').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(init.totalItems);
  })

  specify('cannot rename an initative the name of another initiative', () => {
    cy.get('#modalTitle').clear().type('Initiative'); //TODO: figure out how to get an existing init for this company

    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains('Validation Failed');
  })
})

export {}