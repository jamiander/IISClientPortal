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

    cy.get('select').select(1);
    cy.get('#modalTitle').clear().type(init.title);
    cy.get('#modalMonth').clear().type(init.month);
    cy.get('#modalDay').clear().type(init.day);
    cy.get('#modalYear').clear().type(init.year);
    cy.get('#modalTotalItems').clear().type(init.totalItems);
  });

  specify('add new initiative',() => {
    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains('New Initiative Dispatched');
  })

  specify('cannot add an initiative with the name of an existing initiative for a given company', () => {
    cy.get('#modalTitle').clear().type('IIS Initiative'); //TODO: figure out how to make this match an existing initiative name for this company

    cy.get('button').contains('Submit').click();
  })

  specify('cannot add when a field is left blank', () => {
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
    cy.get('#modalTotalItems').type(init.totalItems);
  })

  specify('cannot add when total items are negative', () => {
    cy.get('#modalTotalItems').clear().type("-3");
    cy.get('button').contains('Submit').click();

    cy.get('#toast-default').contains(failMessage);
  })

  specify('cannot add when a date is not in a valid format', () => {
    cy.get('#modalMonth').clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get('#modalMonth').clear().type("ab");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get('#modalMonth').clear().type("13");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get('#modalMonth').clear().type(init.month);


    cy.get('#modalDay').clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get('#modalDay').clear().type("ab");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get('#modalDay').clear().type("32");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get('#modalDay').clear().type(init.day);


    cy.get('#modalYear').clear().type("-3");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

    cy.get('#modalYear').clear().type("abcd");
    cy.get('button').contains('Submit').click();
    cy.get('#toast-default').contains(failMessage);

  })
})

export {}