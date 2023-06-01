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
const tableIds = consts.initiativeTableIds;
const snackbarId = consts.snackbarId;
const radioIds = consts.initiativeDisplayRadioIds;
const failMessage = consts.validationFailedMessage;
const pageIds = consts.initiativesPageIds;

const initiativeTitle = 'IIS Initiative';
const companyName = 'Integrity Inspired Solutions';
const waitTime = 500;
const user = IntegrityUser;

describe('valid upload throughput tests', () => {

  let remainingItemsBefore: number;

  beforeEach(() => {
    cy.login(user);

    cy.getByData(radioIds.all).click();
    cy.getByData(tableIds.initiativeTitleFilter).type(initiativeTitle, {force:true});

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

      cy.getByData(modalIds.uploadButton).selectFile({
        contents: Cypress.Buffer.from(file),
        fileName: 'file.csv' 
      }, {action: 'drag-drop'});  
    })

    cy.wait(waitTime);
    cy.getByData(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.getByData(radioIds.all).click();
    cy.getByData(tableIds.initiativeTitleFilter).clear({force:true}).type(initiativeTitle,{force:true});
    cy.contains('tr', initiativeTitle).findByData(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      expect(remainingItemsBefore-itemsCompletedInUpload).to.be.equal(remainingItemsAfter);
    })
  })

  specify('close button closes modal', () => {
    cy.getByData(modalIds.modal).should('exist');
    cy.getByData(modalIds.closeButton).click();
    cy.wait(waitTime);

    cy.getByData(modalIds.modal).should('not.exist');
  })

})

describe('invalid upload throughput tests', () => {

  beforeEach(() => {
    cy.login(user);

    cy.getByData(tableIds.initiativeTitleFilter).type(initiativeTitle, {force:true});
    
    cy.getByData(tableIds.actionMenu.menuButton).click();
    cy.getByData(tableIds.actionMenu.uploadThroughputButton).click();
  })
  

  specify('cannot add throughput data by file when file is the wrong type', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', null).then((file) => {
      cy.getByData(modalIds.uploadButton).selectFile({
        contents: file,
        fileName: 'file.txt'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.getByData(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add throughput data by file when a field is blank', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let blankFieldFile = file.split('\n');
      let fieldToClear = blankFieldFile[2].split(',');
      fieldToClear.splice(0,1);
      blankFieldFile[2] = ',' + fieldToClear;
      blankFieldFile = blankFieldFile.join('\n');

      cy.getByData(modalIds.uploadButton).selectFile({
        contents: Cypress.Buffer.from(blankFieldFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});

    })
    cy.wait(waitTime);
    cy.contains('Warning: This file contains data that is not properly formatted');
  })

  specify('cannot add throughput data by file when file format is invalid', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidFormatFile = file.split('\n');
      invalidFormatFile[2] = invalidFormatFile[2].replace(',', ';');
      invalidFormatFile = invalidFormatFile.join('\n');

      cy.getByData(modalIds.uploadButton).selectFile({
        contents: Cypress.Buffer.from(invalidFormatFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
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

      cy.getByData(modalIds.uploadButton).selectFile({
        contents: Cypress.Buffer.from(invalidDateFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.getByData(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cannot add throughput data by file when items completed entry is invalid', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidItemsCompletedFile = file.split('\n');
      let entryToInvalidate = invalidItemsCompletedFile[4].split(',');
      entryToInvalidate[1] = entryToInvalidate[1].replace(entryToInvalidate[1][1], '-3');
      invalidItemsCompletedFile[4] = entryToInvalidate.join(','); invalidItemsCompletedFile = invalidItemsCompletedFile.join('\n');
      
      cy.getByData(modalIds.uploadButton).selectFile({
        contents: Cypress.Buffer.from(invalidItemsCompletedFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.getByData(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.get(snackbarId).should('contain',failMessage);
  })
})

