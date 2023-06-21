import { AdminUser } from "./TestHelpers";
import { IntegrityUser, TestConstants } from "./TestHelpers";

function findItemsCompleted(file: string) : number {
  let itemsCompletedInUpload : number = 0;
  let temp = file.split(/\n|,/);
  temp.filter((entry: string) => {
    let num = entry.match(/\d/g);
    if (entry.includes('\r') && !entry.includes('ItemsCompleted') && num) itemsCompletedInUpload += Number(num[0]);
  })
  return itemsCompletedInUpload;
}

const consts = TestConstants;
const modalIds = consts.uploadThroughputIds;
const uploadIds = modalIds.fileUpload;
const tableIds = consts.initiativeTableIds;
const pageIds = consts.initiativesPageIds;
const snackbarId = consts.snackbarId;
const radioIds = consts.initiativeDisplayRadioIds;
const failMessage = consts.validationFailedMessage;

const initiativeTitle = 'Client Portal';
const companyName = 'Integrity Inspired Solutions';
const waitTime = 500;
const user = AdminUser;

function SelectFile(file: any, fileName: string)
{
  cy.getByData(uploadIds.chooseFileButton).click()
      cy.getByData(uploadIds.fileInput).selectFile({
        contents: Cypress.Buffer.from(file),
        fileName: fileName 
      }, {action: 'select', force:true}); 
}

describe('valid upload throughput tests', () => {

  let remainingItemsBefore: number;

  beforeEach(() => {
    cy.login(user);

    cy.getByData(radioIds.all).click();
    cy.getByData(pageIds.initiativeTitleFilter).type(initiativeTitle);

    cy.contains('tr', initiativeTitle).findByData(tableIds.remainingItems).then(($span) => {
      remainingItemsBefore = Number($span.text());
    });

    cy.getByData(tableIds.actionMenu.menuButton).click();
    cy.getByData(tableIds.actionMenu.uploadThroughputButton).click();
    
  })

  specify('add throughput data by file', () => {
    let itemsCompletedInUpload : number;
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      itemsCompletedInUpload = findItemsCompleted(file);

      SelectFile(file,'file.csv');
    })

    cy.wait(waitTime);
    cy.getByData(uploadIds.submitButton).click();
    cy.wait(waitTime);
    cy.getByData(radioIds.all).click();
    cy.getByData(pageIds.initiativeTitleFilter).clear().type(initiativeTitle);
    cy.contains('tr', initiativeTitle).findByData(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      expect(remainingItemsBefore-itemsCompletedInUpload).to.be.equal(remainingItemsAfter);
    })
  })

  specify('close button closes modal', () => {
    cy.getByData(modalIds.modal).should('exist');
    cy.getByData(modalIds.closeModalButton).click();
    cy.wait(waitTime);

    cy.getByData(modalIds.modal).should('not.exist');
  })

})

describe('invalid upload throughput tests', () => {

  beforeEach(() => {
    cy.login(user);

    cy.getByData(pageIds.initiativeTitleFilter).type(initiativeTitle);
    
    cy.getByData(tableIds.actionMenu.menuButton).click();
    cy.getByData(tableIds.actionMenu.uploadThroughputButton).click();
  })
  

  specify('cannot add throughput data by file when file is the wrong type', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', null).then((file) => {
      SelectFile(file,'file.txt');
    })

    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('show warning when a field is blank', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let blankFieldFile = file.split('\n');
      let fieldToClear = blankFieldFile[2].split(',');
      fieldToClear.splice(0,1);
      blankFieldFile[2] = ',' + fieldToClear;
      blankFieldFile = blankFieldFile.join('\n');

      SelectFile(blankFieldFile,'file.csv');
    })
    cy.wait(waitTime);
    cy.contains('Warning: This file contains data that is not properly formatted');
  })

  specify('show warning when file is not formatted correctly', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidFormatFile = file.split('\n');
      invalidFormatFile[2] = invalidFormatFile[2].replace(',', ';');
      invalidFormatFile = invalidFormatFile.join('\n');

      SelectFile(invalidFormatFile,'file.csv');
    })
    cy.wait(waitTime);
    cy.contains('Warning: This file contains data that is not properly formatted');
  })

  specify('cannot add throughput data by file when date entry is invalid', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidDateFile = file.split('\n');
      let dateToInvalidate = invalidDateFile[3].split('/');
      dateToInvalidate[0] = '23';
      invalidDateFile[3] = dateToInvalidate.join('/'); invalidDateFile = invalidDateFile.join('\n');

      SelectFile(invalidDateFile,'file.csv');
    })

    cy.wait(waitTime);
    cy.getByData(uploadIds.submitButton).click();
    cy.wait(waitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add throughput data by file when items completed entry is invalid', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidItemsCompletedFile = file.split('\n');
      let entryToInvalidate = invalidItemsCompletedFile[4].split(',');
      entryToInvalidate[1] = entryToInvalidate[1].replace(entryToInvalidate[1][1], '-3');
      invalidItemsCompletedFile[4] = entryToInvalidate.join(','); invalidItemsCompletedFile = invalidItemsCompletedFile.join('\n');
      
      SelectFile(invalidItemsCompletedFile,'file.csv');
    })

    cy.wait(waitTime);
    cy.getByData(uploadIds.submitButton).click();
    cy.wait(waitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })
})

