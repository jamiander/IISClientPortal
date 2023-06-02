import { AdminUser, IntegrityUser, TestConstants } from "./TestHelpers";

describe('update initiative spec', () => {

  const init = {
    companyName: 'Integrity Inspired Solutions',
    title: "Test Initiative 1234",
    startDate: "01012023",//"2023-01-01",
    targetDate: "04012023",//"2023-04-01",
    totalItems: "3"
  }

  const existingInit = {
    title: "IIS Initiative"
  }

  const consts = TestConstants;
  const failMessage = consts.validationFailedMessage;
  const snackbarId = consts.snackbarId;
  const radioIds = consts.initiativeDisplayRadioIds;
  const tableIds = consts.initiativeTableIds;
  const user = AdminUser;
  const snackbarWaitTime = consts.snackbarWaitTime;

  beforeEach(() => {
    cy.login(user);

    cy.getByData(radioIds.all).click();
    cy.getByData(tableIds.companyNameFilter).clear({force:true}).type(init.companyName,{force:true});
    cy.getByData(tableIds.table).contains(init.companyName).parent().within(() => {
      cy.getByData(tableIds.editButton).click();
    });

    cy.getByData(tableIds.editInitiativeTitle).clear().type(init.title);
    cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);
    cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);
    cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);
  });

  specify('update an initiative', () => {
    cy.getByData(tableIds.saveChangesButton).click();
    cy.wait(500);
    cy.getByData(radioIds.all).click();
    cy.getByData(tableIds.companyNameFilter).clear({force:true}).type(init.companyName,{force:true});
    cy.getByData(tableIds.table).should('contain',init.title);
  })

  specify('cannot update with blank fields', () => {
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
  })

  specify('cannot have a target date before a start date', () => {
    cy.getByData(tableIds.editStartDate).setDatePicker("04-20-2023");//"2023-04-20");
    cy.getByData(tableIds.editTargetDate).setDatePicker("04-19-2023");//"2023-04-19");

    cy.getByData(tableIds.saveChangesButton).click();
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot rename an initative the name of another initiative within that company', () => {
    cy.getByData(tableIds.cancelChangesButton).click();

      cy.getByData(tableIds.initiativeTitle).first().invoke('text').then(($txt) => { 
        const existingInitTitle = $txt;

        cy.getByData(tableIds.editButton).last().click();
        cy.getByData(tableIds.editInitiativeTitle).clear().type(existingInitTitle);
        cy.getByData(tableIds.editStartDate).setDatePicker(init.startDate);
        cy.getByData(tableIds.editTargetDate).setDatePicker(init.targetDate);
        cy.getByData(tableIds.editTotalItems).clear().type(init.totalItems);
    })

    cy.getByData(tableIds.saveChangesButton).click();

    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button does not save changes', () => {
    cy.getByData(tableIds.cancelChangesButton).click();
    cy.getByData(tableIds.table).should('not.contain',init.title);
  })
})

export {}