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

const initiativeTitle = 'IIS Initiative';
const companyName = 'Integrity Inspired Solutions';
const waitTime = 500;
const user = IntegrityUser;

describe('valid upload throughput tests', () => {

  let remainingItemsBefore: number;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type(user.email);
    cy.get('#password').clear().type(user.password);
    cy.wait(500);
    cy.get('button').contains('Submit').click();

    cy.get(radioIds.all).click();
    cy.get(tableIds.initiativeTitleFilter).type(initiativeTitle);

    cy.contains('tr', initiativeTitle).find(tableIds.remainingItems).then(($span) => {
      remainingItemsBefore = Number($span.text());
    });

    cy.get('button').contains('Upload Data').click();
    cy.get(modalIds.selectCompany).select(companyName);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
  })

  specify('add throughput data by file', () => {
    let itemsCompletedInUpload : number;
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      itemsCompletedInUpload = findItemsCompleted(file);

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(file),
        fileName: 'file.csv' 
      }, {action: 'drag-drop'});  
    })

    cy.wait(waitTime);
    cy.get(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.get(radioIds.all).click();
    cy.get(tableIds.initiativeTitleFilter).clear().type(initiativeTitle);
    cy.contains('tr', initiativeTitle).find(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      expect(remainingItemsBefore-itemsCompletedInUpload).to.be.equal(remainingItemsAfter);
    })
  })

  specify('close button closes modal', () => {
    cy.get(modalIds.modal);
    cy.get(modalIds.closeButton).click();
    cy.wait(waitTime);

    cy.get(modalIds.modal).should('not.exist');
  })

})

describe('invalid upload throughput tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    //cy.get('button').contains('Admin').click();
    //cy.get('button').contains('Initiatives').click();

    cy.get('button').contains('Upload Data').click();
    cy.get(modalIds.selectCompany).select(companyName);
    cy.get(modalIds.selectInitiative).select(initiativeTitle);
  })
  

  specify('cannot add throughput data by file when file is the wrong type', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', null).then((file) => {
      cy.get('input[type=file]').selectFile({
        contents: file,
        fileName: 'file.txt'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.get(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.get(snackbarId).contains('Validation Failed');
  })

  specify('cannot add throughput data by file when a field is blank', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let blankFieldFile = file.split('\n');
      let fieldToClear = blankFieldFile[2].split(',');
      fieldToClear.splice(0,1);
      blankFieldFile[2] = ',' + fieldToClear;
      blankFieldFile = blankFieldFile.join('\n');

      cy.get('input[type=file]').selectFile({
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

      cy.get('input[type=file]').selectFile({
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

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(invalidDateFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.get(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.get(snackbarId).contains('Validation Failed');
  })

  specify('cannot add throughput data by file when items completed entry is invalid', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidItemsCompletedFile = file.split('\n');
      let entryToInvalidate = invalidItemsCompletedFile[4].split(',');
      entryToInvalidate[1] = entryToInvalidate[1].replace(entryToInvalidate[1][1], '-3');
      invalidItemsCompletedFile[4] = entryToInvalidate.join(','); invalidItemsCompletedFile = invalidItemsCompletedFile.join('\n');
      
      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(invalidItemsCompletedFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.get(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.get(snackbarId).contains('Validation Failed');
  })
})

