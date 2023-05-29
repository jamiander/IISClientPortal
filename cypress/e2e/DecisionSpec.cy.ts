import { IntegrityUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const failMessage = consts.validationFailedMessage;
const modalIds = consts.decisionModalIds;
const alertIds = consts.deleteDecisionAlertIds;
const radioIds = consts.initiativeDisplayRadioIds;
const tableIds = consts.initiativeTableIds;
const loginIds = consts.loginPageIds;
const snackbarId = consts.snackbarId;
const snackbarWaitTime = consts.snackbarWaitTime;
const waitTime = 500;
const user = IntegrityUser;

const init = {
  companyName: 'Integrity Inspired Solutions',
  title: "IIS Initiative"
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
  cy.get(loginIds.email).clear().type(user.email);
  cy.get(loginIds.password).clear().type(user.password);
  cy.wait(500);
  cy.get(loginIds.submitButton).click();

  cy.get(radioIds.all).click();
  cy.get(tableIds.initiativeTitleFilter).type(init.title);
  cy.get('table').contains(init.title).then(() => {
    cy.get(tableIds.actionMenu.menuButton).click();
    cy.get(tableIds.actionMenu.decisionButton).click();
  });
  

  cy.get(modalIds.addButton).click({force: true});
  cy.get(modalIds.grid).children().first().within(() => {
    cy.get(modalIds.description).type(decision.description,{force: true});
    cy.get(modalIds.resolution).type(decision.resolution,{force: true});
    cy.get(modalIds.participants).type(decision.names,{force: true});
    cy.get(modalIds.date).type(decision.date,{force: true});
  })
  
})

describe("add decision spec", () => {

  specify("add decision to initiative", () => {
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(waitTime);
    cy.get(modalIds.description).contains(decision.description);
    cy.get(modalIds.closeModalButton).click();
    
    cy.get(tableIds.actionMenu.decisionButton).click();
    cy.get(modalIds.grid).children().last().within(() => {
      cy.get(modalIds.description).should('contain',decision.description);
    })
  })

  specify("can't add decision with empty fields", () => {
    cy.get(modalIds.description).clear({force: true});
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(modalIds.description).type(decision.description,{force: true});

    cy.get(modalIds.resolution).clear({force: true});
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(modalIds.resolution).type(decision.resolution,{force: true});

    cy.get(modalIds.participants).clear({force: true});
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.get(modalIds.participants).type(decision.names,{force: true});
  })

  specify("must be able to cancel adding", () => {
    cy.get(modalIds.cancelChangesButton).click();
    cy.get(modalIds.saveChangesButton).should('not.exist');
    cy.get(modalIds.description)
      .invoke('val')
      .should('not.eq', decision.description);
  })

  specify("close button closes the modal", () => {
    cy.get(modalIds.closeModalButton).click();
    cy.get(modalIds.modal).should('not.exist');
  })

  specify("cannot add multiple decisions at once", () => {
    cy.get(modalIds.addButton).click();
    cy.get(snackbarId);
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

    cy.get(modalIds.description)
      .invoke('val')
      .should('not.eq', decision.description);
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

