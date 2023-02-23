describe('add initiative spec', () => {
  const init = {
    companyId: 0,
    title: "Test Initiative",
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
    cy.get('button').contains('Add Initiative').click();
  });

  specify('add new initiative',() => {
    cy.get('select').select(1);
    cy.get('#modalTitle').clear().type(init.title);
    cy.get('#modalMonth').clear().type(init.month);
    cy.get('#modalDay').clear().type(init.day);
    cy.get('#modalYear').clear().type(init.year);
    cy.get('#modalTotalItems').clear().type(init.totalItems);

    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains('New Initiative Dispatched');
  })

  specify('cannot add an initiative with the name of an existing initiative for a given company', () => {
    cy.get('select').select(1);
    cy.get('#modalTitle').clear().type('IIS Initiative'); //TODO: figure out how to make this match an existing initiative name for this company
    cy.get('#modalMonth').clear().type(init.month);
    cy.get('#modalDay').clear().type(init.day);
    cy.get('#modalYear').clear().type(init.year);
    cy.get('#modalTotalItems').clear().type(init.totalItems);

    cy.get('button').contains('Submit').click();
  })

  specify('cannot add when a field is left blank', () => {

  })
})

export {}