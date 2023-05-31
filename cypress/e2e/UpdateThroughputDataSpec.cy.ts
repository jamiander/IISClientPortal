import { IntegrityUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.editThroughputIds;
const snackbarId = consts.snackbarId;
const failMessage = consts.validationFailedMessage;
const tableIds = consts.initiativeTableIds;
const radioIds = consts.initiativeDisplayRadioIds;
const pageIds = consts.initiativesPageIds;
const snackbarWaitTime = consts.snackbarWaitTime;
const initiativeTitle = 'IIS Initiative';
const company = 'Integrity Inspired Solutions';
const waitTime = 500;
const user = IntegrityUser;

const newDate = "2020-01-01";

describe ('add throughput data by manual entry', () => {
  let remainingItemsBefore: number;

  before(() => {
    cy.login(user);

    cy.get(radioIds.all).click();
    cy.get(tableIds.initiativeTitleFilter).type(initiativeTitle);

    cy.contains('tr', initiativeTitle).find(tableIds.remainingItems).then(($span) => {
      remainingItemsBefore = Number($span.text());
    });

    cy.get(pageIds.editThroughputButton).click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
    cy.get(modalIds.addDate).clear().type(newDate);
    cy.get(modalIds.addNewEntryButton).click();
  })

  specify('add throughput data by manual entry', () => {
    cy.get(modalIds.saveChangesButton).parent().parent().within(() => {
      cy.get(modalIds.tableItemsComplete).clear().type('2');
      cy.get(modalIds.saveChangesButton).click();
    });
    
    cy.get(modalIds.closeButton).click();
    cy.wait(waitTime);
    cy.get(radioIds.all).click();
    cy.get(tableIds.initiativeTitleFilter).clear().type(initiativeTitle);
    cy.contains('tr', initiativeTitle).find(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      expect(remainingItemsBefore-2).to.be.equal(remainingItemsAfter);
    });
  })
})

describe ('invalid manual entry test', () => {
  beforeEach(() => {
    cy.login(user);

    cy.get(pageIds.editThroughputButton).click();
  })


  specify('cannot add throughput entry when date is invalid', () => {
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
    cy.get(modalIds.addNewEntryButton).click();
    cy.get(snackbarId).should('contain',failMessage);

    cy.get(modalIds.addDate).clear().type(newDate);
    cy.get(modalIds.addDate).clear();
    cy.get(modalIds.addNewEntryButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add throughput entry when item completed is invalid', () => {
    cy.get(modalIds.addDate).clear().type(newDate);
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
    cy.get(modalIds.addNewEntryButton).click();

    cy.get(modalIds.saveChangesButton).parent().parent().within(() => {
      cy.get(modalIds.tableItemsComplete).clear();
      cy.get(modalIds.saveChangesButton).click();
    });
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })
})

describe('update throughput data', () => {

  beforeEach(() => {
    cy.login(user);

    cy.get(pageIds.editThroughputButton).click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
    cy.get(modalIds.editButton).click();
  })

  specify('update completed amount', () => {
    cy.get(modalIds.tableItemsComplete).clear().type("33");

    cy.get(modalIds.saveChangesButton).click();

    cy.get(snackbarId).should('not.contain',failMessage);
  })

  specify('close button closes modal', () => {
    cy.get(modalIds.modal).should('exist');
    cy.get(modalIds.closeButton).click();
    cy.wait(waitTime);

    cy.get(modalIds.modal).should('not.exist');
  })

  specify('cannot update throughput data if unselected company', () => {
    cy.get(modalIds.selectCompany).select(0);
    cy.get(modalIds.editButton).should('not.exist');
    //cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot update throughput data if unselected initiative', () => {
    cy.get(modalIds.selectInitiative).select(0);
    cy.get(modalIds.editButton).should('not.exist');
    //cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot update throughput data to an invalid completed amount', () => {
    cy.get(modalIds.tableItemsComplete).clear();
    cy.get(modalIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);

    cy.get(modalIds.tableItemsComplete).clear().type("a");
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);

    cy.get(modalIds.tableItemsComplete).clear().type("-2");
    cy.get(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

});

