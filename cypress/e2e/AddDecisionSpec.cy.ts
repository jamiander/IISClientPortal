import { TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.decisionModalIds;
const radioIds = consts.initiativeDisplayRadioIds;
const tableIds = consts.initiativeTableIds;
const waitTime = 500;

const init = {
  companyName: 'Integrity Inspired Solutions',
}

const decision = {
  names: [ "Johnny Test" ],
  description: "Test Decision",
  resolution: "Decided",
  date: "2023-04-01"
}

describe("add decision spec", () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();
    cy.get(radioIds.all).click();
    cy.get(tableIds.companyNameFilter).type(init.companyName);
    cy.get('table').contains(init.companyName);
    cy.get("#viewDecisionDataButton0").click();

    cy.get(modalIds.addButton).click();
    cy.get(modalIds.description).type(decision.description,{force: true});
    cy.get(modalIds.resolution).type(decision.resolution,{force: true});
    cy.get(modalIds.participants).type(decision.names[0],{force: true});
    cy.get(modalIds.date).type(decision.date,{force: true});
  })

  specify("add decision to initiative", () => {
    cy.get(modalIds.saveChangesButton).click();
  })

  specify("can't add decision with empty fields", () => {
    cy.get(modalIds.description).clear({force: true});
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(waitTime);
    cy.get(modalIds.saveChangesButton);
    cy.get(modalIds.description).type(decision.description,{force: true});

    cy.get(modalIds.resolution).clear({force: true});
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(waitTime);
    cy.get(modalIds.saveChangesButton);
    cy.get(modalIds.resolution).type(decision.resolution,{force: true});

    cy.get(modalIds.participants).clear({force: true});
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(waitTime);
    cy.get(modalIds.saveChangesButton);
    cy.get(modalIds.participants).type(decision.names[0],{force: true});

    /*cy.get(modalIds.date).clear({force: true});
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(waitTime);
    cy.get(modalIds.saveChangesButton);*/
  })

  specify("must be able to cancel adding", () => {
    cy.get(modalIds.cancelChangesButton).click();
    cy.get(modalIds.saveChangesButton).should('not.exist');
    cy.get(decision.description).should('not.exist');
  })

  specify("close button closes the modal", () => {
    cy.get(modalIds.closeModalButton).click();
    cy.get(modalIds.modal).should('not.exist');
  })

})

