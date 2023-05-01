import { TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.decisionModalIds;
const alertIds = consts.deleteDecisionAlertIds;
const radioIds = consts.initiativeDisplayRadioIds;
const tableIds = consts.initiativeTableIds;
const waitTime = 500;

const init = {
  companyName: 'Integrity Inspired Solutions',
  id: "1"
}

const decision = {
  names: "Johnny Test" ,
  description: "Test Decision",
  resolution: "Decided",
  date: "2023-04-01"
}

const editedDecision = {
  names: "Jimmy Toast",
  description: "Real Decision",
  resolution: "Undecided",
  date: "2023-04-29"
}

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
  cy.get("#viewDecisionDataButton"+init.id).click();

  cy.get(modalIds.addButton).click({force: true});
  cy.get(modalIds.description).type(decision.description,{force: true});
  cy.get(modalIds.resolution).type(decision.resolution,{force: true});
  cy.get(modalIds.participants).type(decision.names,{force: true});
  cy.get(modalIds.date).type(decision.date,{force: true});
})

describe("add decision spec", () => {

  specify("add decision to initiative", () => {
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(waitTime);
    cy.get(modalIds.description).contains(decision.description);
    cy.get(modalIds.closeModalButton).click();
    
    cy.get("#viewDecisionDataButton"+init.id).click();
    cy.get(modalIds.description).contains(decision.description);
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
    cy.get(modalIds.participants).type(decision.names,{force: true});

    /*cy.get(modalIds.date).clear({force: true});
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(waitTime);
    cy.get(modalIds.saveChangesButton);*/
  })

  specify("must be able to cancel adding", () => {
    cy.get(modalIds.cancelChangesButton).click();
    cy.get(modalIds.saveChangesButton).should('not.exist');
    cy.get(modalIds.description).should('not.exist');
  })

  specify("close button closes the modal", () => {
    cy.get(modalIds.closeModalButton).click();
    cy.get(modalIds.modal).should('not.exist');
  })

})

describe("edit decision spec", () => {
  beforeEach(() => {
    cy.get(modalIds.saveChangesButton).click();
    cy.get(modalIds.editButton).click();

    cy.get(modalIds.description).clear({force: true}).type(editedDecision.description,{force: true});
    cy.get(modalIds.resolution).clear({force: true}).type(editedDecision.resolution,{force: true});
    cy.get(modalIds.participants).clear({force: true}).type(editedDecision.names,{force: true});
    cy.get(modalIds.date).clear({force: true}).type(editedDecision.date,{force: true});
  })

  specify("save button saves changes", () => {
    cy.get(modalIds.saveChangesButton).click();
    cy.get(modalIds.description).contains(editedDecision.description);
  })

  specify("edit button goes away while editing", () => {
    cy.get(modalIds.editButton).should('not.exist');
  })

  specify("cancel button does not save any changes", () => {
    cy.get(modalIds.cancelChangesButton).click();
    cy.get(modalIds.description).contains(decision.description);
  })
})

describe("delete decision spec", () => {
  
  beforeEach(() => {
    cy.get(modalIds.saveChangesButton).click();
  })

  specify("delete decision from initiative", () => {
    cy.get(modalIds.deleteButton).click();

    cy.get(alertIds.confirmButton).click();

    cy.get(modalIds.description).should("not.exist");
  })

  specify("hitting no in alert does not delete", () => {
    cy.get(modalIds.deleteButton).click();

    cy.get(alertIds.cancelButton).click();

    cy.get(modalIds.description).contains(decision.description);
  })

  specify("can't delete while in edit mode", () => {
    cy.get(modalIds.editButton).click();

    cy.get(modalIds.deleteButton).should("not.exist");
  })
})

