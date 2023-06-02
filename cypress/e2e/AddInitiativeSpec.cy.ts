import { AdminUser, IntegrityUser, MBPIAdminUser, MBPICompany, MBPIUser, TestConstants } from "./TestHelpers";

const consts = TestConstants;
const failMessage = consts.validationFailedMessage;
const snackbarId = consts.snackbarId;
const radioIds = consts.initiativeDisplayRadioIds;
const tableIds = consts.initiativeTableIds;
const snackbarWaitTime = consts.snackbarWaitTime;
const pageIds = consts.initiativesPageIds;

const init = {
  companyId: 0,
  title: "Integration Test Initiative",
  startDate: "01012020",//"2020-01-01",
  targetDate: "01032023",//"2023-01-03",
  totalItems: "3"
}

describe('add initiative spec', () => {
  
  const user = MBPIAdminUser;

  beforeEach(() => {
    cy.login(user);

    cy.getByData(radioIds.all).click();

    cy.getByData(pageIds.addInitiativeButton).click({force: true}); //TODO: fix the button so that it's not covered by the radio set
  });

  specify('add new initiative',() => {
    cy.getByData(tableIds.editInitiativeTitle).clear().type(init.title);
    cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);
    cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);
    cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);
    cy.getByData(tableIds.saveChangesButton).click();
    cy.getByData(tableIds.initiativeTitleFilter).type(init.title, {force:true});
    cy.getByData(tableIds.table).should('contain',init.title);
  })

  specify('cannot add an initiative with the name of an existing initiative for a given company', () => {
    cy.getByData(tableIds.cancelChangesButton).click();
    cy.getByData(tableIds.table).children().first().then(($row) => {

      cy.getByData(tableIds.initiativeTitle).first().invoke('text').then(($txt) => { 
        const existingInitTitle = $txt;

        cy.getByData(pageIds.addInitiativeButton).click({force: true}); //TODO
        cy.getByData(tableIds.editInitiativeTitle).clear().type(existingInitTitle);
        cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);
        cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);
        cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);

        cy.getByData(tableIds.saveChangesButton).click();
        cy.get(snackbarId).should('contain',failMessage);
      });
    });
  })

  specify('cannot add when a field is left blank', () => {
    cy.getByData(tableIds.editInitiativeTitle).clear().type(init.title);
    cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);
    cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);
    cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);

    cy.getByData(tableIds.editInitiativeTitle).clear();
    cy.getByData(tableIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(tableIds.editInitiativeTitle).type(init.title);

    cy.getByData(tableIds.editStartDate).setDatePicker("");
    cy.getByData(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);

    cy.getByData(tableIds.editTargetDate).setDatePicker("");
    cy.getByData(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);

    cy.getByData(tableIds.editTotalItems).clear();
    cy.getByData(tableIds.saveChangesButton).click();
    cy.wait(snackbarWaitTime);
    cy.get(snackbarId).should('contain',failMessage);
    cy.getByData(tableIds.editTotalItems).type(init.totalItems);
  })

  specify('cannot have a target date before a start date', () => {
    cy.getByData(tableIds.editInitiativeTitle).clear().type(init.title);
    cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);
    cy.getByData(tableIds.editStartDate).setDatePicker("04202023");//"2023-04-20");
    cy.getByData(tableIds.editTargetDate).setDatePicker("04192023");//"2023-04-19");

    cy.getByData(tableIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add when total items are negative', () => {
    cy.getByData(tableIds.editInitiativeTitle).clear().type(init.title);
    cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);
    cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);
    cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);
    cy.getByData(tableIds.editTotalItems).clear().type("-3");
    cy.getByData(tableIds.saveChangesButton).click();

    cy.get(snackbarId).should('contain',failMessage);
  })

  //Cypress does not allow invalid dates in date pickers, so we cannot test for NaN or 2/30/yyyy

  specify('close button closes the modal', () => {
    cy.getByData(tableIds.editInitiativeTitle).clear().type(init.title);
    cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);
    cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);
    cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);
    cy.getByData(tableIds.cancelChangesButton).click();
    cy.getByData(tableIds.table).should('not.contain',init.title);
  })
})

describe('add initiatives as Integrity user', () => {

  const admin = AdminUser;
  const company = MBPICompany;
  
  beforeEach(() => {
    cy.login(admin);

    cy.getByData(radioIds.all).click();

    cy.getByData(pageIds.addInitiativeButton).click({force: true}); //TODO

    cy.getByData(tableIds.companySelect).parent().muiSelect(company.id);
    cy.getByData(tableIds.editInitiativeTitle).find('input').clear().type(init.title);
    cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);
    cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);
    cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);
  });

  specify('add new initiative for a different company', () => {
    cy.getByData(tableIds.saveChangesButton).click();
    cy.getByData(tableIds.initiativeTitleFilter).type(init.title, {force:true});
    cy.getByData(tableIds.table).should('contain',init.title);
  })
})

export {}