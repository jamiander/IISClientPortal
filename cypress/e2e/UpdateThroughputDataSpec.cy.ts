import { AdminUser, IntegrityUser, TestConstants } from "./TestHelpers";

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
const user = AdminUser;

const newDate = "2020-01-01";

describe ('add throughput data by manual entry', () => {
  let remainingItemsBefore: number;

  before(() => {
    cy.login(user);

    cy.getByData(radioIds.all).click();
    cy.getByData(tableIds.initiativeTitleFilter).type(initiativeTitle);

    cy.contains('tr', initiativeTitle).findByData(tableIds.remainingItems).then(($span) => {
      remainingItemsBefore = Number($span.text());
    });

    cy.getByData(pageIds.editThroughputButton).click();
    cy.getByData(modalIds.selectCompany).select(company);
    cy.getByData(modalIds.selectInitiative).select(initiativeTitle);
    cy.getByData(modalIds.addDate).clear().type(newDate);
    cy.getByData(modalIds.addNewEntryButton).click();
  })

  specify('add throughput data by manual entry', () => {
    cy.getByData(modalIds.saveChangesButton).parent().parent().within(() => {
      cy.getByData(modalIds.tableItemsComplete).clear().type('2');
      cy.getByData(modalIds.saveChangesButton).click();
    });
    
    cy.getByData(modalIds.closeButton).click();
    cy.wait(waitTime);
    cy.getByData(radioIds.all).click();
    cy.getByData(tableIds.initiativeTitleFilter).clear().type(initiativeTitle);
    cy.contains('tr', initiativeTitle).find(`[data-cy="${tableIds.remainingItems}"]`).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      expect(remainingItemsBefore-2).to.be.equal(remainingItemsAfter);
    });
  })
})

describe ('invalid manual entry test', () => {
  beforeEach(() => {
    cy.login(user);

    cy.getByData(pageIds.editThroughputButton).click({force: true});
  })


  specify('cannot add throughput entry when date is invalid', () => {
    cy.getByData(modalIds.selectCompany).select(company);
    cy.getByData(modalIds.selectInitiative).select(initiativeTitle);
    cy.getByData(modalIds.addNewEntryButton).click();
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(modalIds.addDate).clear().type(newDate);
    cy.getByData(modalIds.addDate).clear();
    cy.getByData(modalIds.addNewEntryButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add throughput entry when item completed is invalid', () => {
    cy.getByData(modalIds.addDate).clear().type(newDate);
    cy.getByData(modalIds.selectCompany).select(company);
    cy.getByData(modalIds.selectInitiative).select(initiativeTitle);
    cy.getByData(modalIds.addNewEntryButton).click();

    cy.getByData(modalIds.saveChangesButton).parent().parent().within(() => {
      cy.getByData(modalIds.tableItemsComplete).clear();
      cy.getByData(modalIds.saveChangesButton).click();
    });
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })
})

describe('update throughput data', () => {

  beforeEach(() => {
    cy.login(user);

    cy.getByData(pageIds.editThroughputButton).click({force: true});
    cy.getByData(modalIds.selectCompany).select(company);
    cy.getByData(modalIds.selectInitiative).select(initiativeTitle);
    cy.getByData(modalIds.editButton).click();
  })

  specify('update completed amount', () => {
    cy.getByData(modalIds.tableItemsComplete).clear().type("33");

    cy.getByData(modalIds.saveChangesButton).click();

    cy.get(snackbarId).should('not.contain',failMessage);
  })

  specify('close button closes modal', () => {
    cy.getByData(modalIds.modal).should('exist');
    cy.getByData(modalIds.closeButton).click();
    cy.wait(waitTime);

    cy.getByData(modalIds.modal).should('not.exist');
  })

  specify('cannot update throughput data if unselected company', () => {
    cy.getByData(modalIds.selectCompany).select(0);
    cy.getByData(modalIds.editButton).should('not.exist');
  })

  specify('cannot update throughput data if unselected initiative', () => {
    cy.getByData(modalIds.selectInitiative).select(0);
    cy.getByData(modalIds.editButton).should('not.exist');
  })

  specify('cannot update throughput data to an invalid completed amount', () => {
    cy.getByData(modalIds.tableItemsComplete).clear();
    cy.getByData(modalIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(modalIds.tableItemsComplete).clear().type("a");
    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(modalIds.tableItemsComplete).clear().type("-2");
    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

});

