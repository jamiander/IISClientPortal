import { IntegrityUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.editThroughputIds;
const snackbarId = consts.snackbarId;
const failMessage = consts.validationFailedMessage;
const tableIds = consts.initiativeTableIds;
const radioIds = consts.initiativeDisplayRadioIds;
const loginIds = consts.loginPageIds;
const snackbarWaitTime = consts.snackbarWaitTime;
const initiativeTitle = 'IIS Initiative';
const company = 'Integrity Inspired Solutions';
const waitTime = 500;
const user = IntegrityUser;

describe ('add throughput data by manual entry', () => {
  let remainingItemsBefore: number;

  before(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(user.email);
    cy.get(loginIds.password).clear().type(user.password);
    cy.get(loginIds.submitButton).click();

    cy.get(radioIds.all).click();
    cy.get(tableIds.initiativeTitleFilter).type(initiativeTitle);

    cy.contains('tr', initiativeTitle).find(tableIds.remainingItems).then(($span) => {
      remainingItemsBefore = Number($span.text());
    });

    cy.get('button').contains('Edit Data').click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
  })

  specify('add throughput data by manual entry', () => {
    cy.get(modalIds.addDate).clear().type("2020-01-01");
    cy.get(modalIds.addItemsComplete).clear().type('2');
    cy.get(modalIds.addEntrySubmitButton).click();
    cy.get(modalIds.submitButton).click();

    cy.wait(waitTime);
    cy.get(radioIds.all).click();
    cy.get(tableIds.initiativeTitleFilter).clear().type(initiativeTitle);
    cy.contains('tr', initiativeTitle).find(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      expect(remainingItemsBefore-2).to.be.equal(remainingItemsAfter);
    })
  })
})

describe ('invalid manual entry test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(user.email);
    cy.get(loginIds.password).clear().type(user.password);
    cy.get(loginIds.submitButton).click();

    //cy.get('button').contains('Admin').click();
    //cy.get('button').contains('Initiatives').click();

    cy.get('button').contains('Edit Data').click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
  })

  specify('cannot add throughput entry when date is invalid', () => {
    cy.get(modalIds.addDate).clear();

    cy.get(modalIds.addItemsComplete).clear().type('2');
    cy.get(modalIds.addEntrySubmitButton).click();
    cy.wait(waitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  //Cypress does not allow letters in date pickers
  /*specify('cannot add throughput entry when letters are entered for date', () => {
    cy.get(modalIds.date.month).clear().type('a');
    cy.get(modalIds.date.day).clear().type('01');
    cy.get(modalIds.date.year).clear().type('2020');
    cy.get(modalIds.itemsComplete).clear().type('2');
    cy.get(modalIds.manualSubmit).click();
    cy.wait(waitTime);
    cy.get(snackbarId).contains('Validation Failed');
  })*/

  specify('cannot add throughput entry when item completed is invalid', () => {
    cy.get(modalIds.addDate).clear().type("2020-01-01");
    cy.get(modalIds.addEntrySubmitButton).click();
    cy.wait(waitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })
})

describe('update throughput data', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(user.email);
    cy.get(loginIds.password).clear().type(user.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    //cy.get('button').contains('Admin').click();
    //cy.get('button').contains('Initiatives').click();

    cy.get('button').contains('Edit Data').click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
  })

  specify('update completed amount', () => {
    cy.get(modalIds.tableItemsComplete).clear().type("33");

    cy.get(modalIds.submitButton).click();

    cy.get(snackbarId).should('contain',"Success");
  })

  /*specify('update the date of an entry', () => {
    cy.get(modalIds.tableDate).clear().type("2023-04-30");
    cy.get(snackbarId).then(() => {
      cy.get(toastCloseId).click();
    })
    cy.get(modalIds.submitButton).click();

    cy.get(snackbarId).contains("Success");
  })*/

  specify('close button closes modal', () => {
    cy.get(modalIds.modal);
    cy.get(modalIds.closeButton).click();
    cy.wait(waitTime);

    cy.get(modalIds.modal).should('not.exist');
  })

  specify('cannot update throughput data if unselected company', () => {
    cy.get(modalIds.selectCompany).select(0);
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot update throughput data if unselected initiative', () => {
    cy.get(modalIds.selectInitiative).select(0);
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot update throughput data to an invalid completed amount', () => {
    cy.get(modalIds.tableItemsComplete).clear();
    cy.get(modalIds.submitButton).click();
    cy.get(snackbarId).should('contain',failMessage);

    cy.get(modalIds.tableItemsComplete).clear().type("a");
    cy.get(modalIds.submitButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);

    cy.get(modalIds.tableItemsComplete).clear().type("-2");
    cy.get(modalIds.submitButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

});

