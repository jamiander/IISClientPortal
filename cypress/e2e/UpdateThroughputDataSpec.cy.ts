import { AdminUser, IntegrityUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const modalIds = consts.editThroughputIds;
const snackbarId = consts.snackbarId;
const failMessage = consts.validationFailedMessage;
const tableIds = consts.initiativeTableIds;
const radioIds = consts.initiativeDisplayRadioIds;
const pageIds = consts.initiativesPageIds;
const snackbarWaitTime = consts.snackbarWaitTime;
const initiativeTitle = 'Client Portal';
const company = 'Integrity Inspired Solutions';
const waitTime = 500;
const user = AdminUser;

const newDate = "01012020";//"2020-01-01";

function CloseModal()
{
  cy.getByData(modalIds.modal).should('exist');
  cy.getByData(modalIds.closeModalButton).click();
  cy.getByData(modalIds.modal).should('not.exist');
  cy.get('body').click(0,0);
}

describe('add throughput data by manual entry', () => {
  let remainingItemsBefore: number;

  before(() => {
    cy.login(user);

    cy.getByData(radioIds.all).click();
    cy.getByData(pageIds.initiativeTitleFilter).type(initiativeTitle);

    cy.contains('tr', initiativeTitle).findByData(tableIds.remainingItems).then(($span) => {
      remainingItemsBefore = Number($span.text());
    });

    cy.getByData(tableIds.actionMenu.menuButton).click();
    cy.getByData(tableIds.actionMenu.editThroughputButton).click();
    cy.getByData(modalIds.addDate).setDatePicker(newDate);
    cy.getByData(modalIds.addNewEntryButton).click();
  })

  specify('add throughput data by manual entry', () => {
    cy.getByData(modalIds.saveChangesButton).parent().parent().within(() => {
      cy.getByData(modalIds.tableItemsComplete).clear().type('2');
      cy.getByData(modalIds.saveChangesButton).click();
    });
    
    CloseModal();
    
    cy.wait(waitTime);
    cy.getByData(radioIds.all).click();
    cy.getByData(pageIds.initiativeTitleFilter).clear().type(initiativeTitle);
    cy.contains('tr', initiativeTitle).findByData(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      expect(remainingItemsBefore-2).to.be.equal(remainingItemsAfter);
    });
  })
})

describe('invalid manual entry test', () => {
  beforeEach(() => {
    cy.login(user);

    cy.getByData(tableIds.actionMenu.menuButton).first().click();
    cy.getByData(tableIds.actionMenu.editThroughputButton).click();
  })

  specify('cannot add throughput entry when date is invalid', () => {
    cy.getByData(modalIds.addNewEntryButton).should('be.disabled');

    cy.getByData(modalIds.addDate).setDatePicker(newDate);
    cy.getByData(modalIds.addDate).setDatePicker("");
    cy.getByData(modalIds.addNewEntryButton).should('be.disabled');

    cy.getByData(modalIds.addDate).setDatePicker("01");
    cy.getByData(modalIds.addNewEntryButton).click()
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add throughput entry when item completed is invalid', () => {
    cy.getByData(modalIds.addDate).setDatePicker(newDate);
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

    cy.getByData(tableIds.actionMenu.menuButton).first().click();
    cy.getByData(tableIds.actionMenu.editThroughputButton).click();
    cy.getByData(modalIds.editButton).first().click();
  })

  specify('update completed amount', () => {
    cy.getByData(modalIds.tableItemsComplete).first().clear().type("33");

    cy.getByData(modalIds.saveChangesButton).click();

    cy.get(snackbarId).should('not.contain',failMessage);
  })

  specify('close button closes modal', () => {
    CloseModal();
  })

  specify('cannot update throughput data to an invalid completed amount', () => {
    cy.getByData(modalIds.tableItemsComplete).first().clear();
    cy.getByData(modalIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(modalIds.tableItemsComplete).first().clear().type("a");
    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);

    cy.getByData(modalIds.tableItemsComplete).first().clear().type("-2");
    cy.getByData(modalIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

});

