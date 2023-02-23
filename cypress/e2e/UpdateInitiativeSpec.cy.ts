describe('update initiative spec', () => {

  const init = {
    companyId: 0,
    title: "Test Initiative 1234",
    month: "04",
    day: "01",
    year: "2023",
    totalItems: "3"
  }

  const failMessage = 'Validation Failed';

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
    cy.get('#modalMonth').clear().type(init.month);
    cy.get('#modalDay').clear().type(init.day);
    cy.get('#modalYear').clear().type(init.year);
    cy.get('#modalTotalItems').clear().type(init.totalItems);
    cy.get('button').contains('Submit').click();

    cy.get('table').contains(init.title);
  })

  specify('cannot update with blank fields', () => {
    cy.get('#modalTitle').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get('#modalTitle').type(init.title);

    cy.get('#modalMonth').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get('#modalMonth').type(init.month);

    cy.get('#modalDay').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get('#modalDay').type(init.day);

    cy.get('#modalYear').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
    cy.get('#modalYear').type(init.year);

    cy.get('#modalTotalItems').clear();
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot rename an initative the name of another initiative', () => {
    cy.get('#modalTitle').clear().type('IIS Initiative 2'); //TODO: figure out how to get an existing init for this company

    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains(failMessage);
  })
})

export {}