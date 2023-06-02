import { AdminUser, IntegrityUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const failMessage = consts.validationFailedMessage;
const modalIds = consts.decisionModalIds;
const alertIds = consts.deleteDecisionAlertIds;
const radioIds = consts.initiativeDisplayRadioIds;
const tableIds = consts.initiativeTableIds;
const snackbarId = consts.snackbarId;
const snackbarWaitTime = consts.snackbarWaitTime;
const waitTime = 500;
const user = AdminUser;

const init = {
  companyName: 'Integrity Inspired Solutions',
  title: "IIS Initiative"
}

const decision = {
  names: "Johnny Test" ,
  description: "Test Decision",
  resolution: "Decided",
  date: "04012023"//"2023-04-01"
}

const editedDecision = {
  names: "Jimmy Toast",
  description: "Real Decision",
  resolution: "Undecided",
  date: "04292023"//"2023-04-29"
}

beforeEach(() => {
  cy.login(user);

  cy.getByData(radioIds.all).click();
  cy.getByData(tableIds.initiativeTitleFilter).type(init.title,{force:true});
  cy.get('table').contains(init.title).then(() => {
    cy.getByData(tableIds.actionMenu.menuButton).click();
    cy.getByData(tableIds.actionMenu.decisionButton).click();
  });
  

  cy.getByData(modalIds.addButton).click({force: true});
  cy.getByData(modalIds.grid).children().first().within(() => {
    cy.getByData(modalIds.editDescription).type(decision.description,{force: true});
    cy.getByData(modalIds.editResolution).type(decision.resolution,{force: true});
    cy.getByData(modalIds.editParticipants).find('input').type(decision.names,{force: true});
    cy.getByData(modalIds.editDate).setDatePicker(decision.date);
  })
  
})

describe("add decision spec", () => {

  specify("add decision to initiative", () => {
    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(waitTime);
    cy.getByData(modalIds.description).contains(decision.description);
    cy.getByData(modalIds.closeModalButton).click();
    
    cy.getByData(tableIds.actionMenu.menuButton).click();
    cy.getByData(tableIds.actionMenu.decisionButton).click();
    cy.getByData(modalIds.grid).children().last().within(() => {
      cy.getByData(modalIds.description).should('contain',decision.description);
    })
  })

  specify("can't add decision with empty fields", () => {
    cy.getByData(modalIds.editDescription).clear({force: true});
    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(modalIds.editDescription).type(decision.description,{force: true});

    cy.getByData(modalIds.editResolution).clear({force: true});
    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(modalIds.editResolution).type(decision.resolution,{force: true});

    cy.getByData(modalIds.editParticipants).find('input').clear({force: true});
    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(modalIds.editParticipants).find('input').type(decision.names,{force: true});
  })

  specify("must be able to cancel adding", () => {
    cy.getByData(modalIds.cancelChangesButton).click();
    cy.getByData(modalIds.saveChangesButton).should('not.exist');
    cy.getByData(modalIds.description)
      .invoke('val')
      .should('not.eq', decision.description);
  })

  specify("close button closes the modal", () => {
    cy.getByData(modalIds.modal).should('exist');
    cy.getByData(modalIds.closeModalButton).click();
    cy.getByData(modalIds.modal).should('not.exist');
  })

  specify("cannot add multiple decisions at once", () => {
    cy.getByData(modalIds.addButton).click();
    cy.get(snackbarId);
  })

})

describe("edit decision spec", () => {
  beforeEach(() => {
    cy.getByData(modalIds.saveChangesButton).click();
    cy.getByData(modalIds.editButton).first().click();

    cy.getByData(modalIds.editDescription).clear({force: true}).type(editedDecision.description,{force: true});
    cy.getByData(modalIds.editResolution).clear({force: true}).type(editedDecision.resolution,{force: true});
    cy.getByData(modalIds.editParticipants).find('input').clear({force: true}).type(editedDecision.names,{force: true});
    cy.getByData(modalIds.editDate).setDatePicker(editedDecision.date);
  })

  specify("save button saves changes", () => {
    cy.getByData(modalIds.saveChangesButton).click();
    cy.getByData(modalIds.description).contains(editedDecision.description);
  })

  specify("edit button goes away while editing", () => {
    cy.getByData(modalIds.editButton).should('not.exist');
  })

  specify("cancel button does not save any changes", () => {
    cy.getByData(modalIds.cancelChangesButton).click();
    cy.getByData(modalIds.description).contains(decision.description);
  })
})

describe("delete decision spec", () => {
  beforeEach(() => {
    cy.getByData(modalIds.saveChangesButton).click();
    cy.getByData(modalIds.description).contains(decision.description).parent().parent().then(($decisionCard) => {
      cy.wrap($decisionCard).as("newDecision");
    })
  })

  specify("delete decision from initiative", () => {
    cy.get("@newDecision").within(() => {
      cy.getByData(modalIds.deleteButton).click();
    });
    cy.getByData(alertIds.confirmButton).click();

    cy.getByData(modalIds.description)
      .invoke('val')
      .should('not.eq', decision.description);
  })

  specify("hitting no in alert does not delete", () => {
    cy.get("@newDecision").within(() => {
      cy.getByData(modalIds.deleteButton).click();
    })
    cy.getByData(alertIds.cancelButton).click();
    cy.get("@newDecision").within(() => {
      cy.getByData(modalIds.description).contains(decision.description);
    })
  })

  specify("can't delete while in edit mode", () => {
    cy.get("@newDecision").within(() => {
      cy.getByData(modalIds.editButton).click();
      cy.getByData(modalIds.deleteButton).should("not.exist");
    })
  })
})

