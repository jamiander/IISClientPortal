import { TestConstants } from "./TestHelpers";

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
const selectIds = consts.UploadThroughputIds;
const tableIds = consts.InitiativeTableIds;
const badToastId = consts.toastId;

const initiative = 'IIS Initiative';
const company = 'Integrity Inspired Solutions'
const waitTime = 250;

describe('valid add throughput tests', () => {

  let remainingItemsBefore: number;

  before(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();

    cy.contains('tr', initiative).find(tableIds.remainingItems).then(($span) => {
      remainingItemsBefore = Number($span.text());
      // console.log('remainingItemsBefore:', remainingItemsBefore);
    });
    // cy.contains('tr', initiative).find(tableIds.initiativeTitle).then(($span) => {
    //   console.log('initiative verification:', $span.text());
    // });

    cy.get('button').contains('Upload Data').click();
    cy.get(selectIds.selectCompany).select(company);
    cy.get(selectIds.selectInitiative).select(initiative);
  })

  specify('add throughput data by file', () => {
    let itemsCompletedInUpload : number;
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      itemsCompletedInUpload = findItemsCompleted(file);
      // console.log('itemsCompletedInUpload:',itemsCompletedInUpload);

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(file),
        fileName: 'file.csv' 
      }, {action: 'drag-drop'});  
    })

    cy.wait(waitTime);
    cy.get('button').contains('Submit').click();
    cy.wait(waitTime);
    cy.contains('tr', initiative).find(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      // console.log('remainingItemsAfter:', remainingItemsAfter);
      expect(remainingItemsBefore-itemsCompletedInUpload).to.be.equal(remainingItemsAfter);
    })
  })

})

describe('invalid add throughput tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();

    cy.get('button').contains('Upload Data').click();
    cy.get(selectIds.selectCompany).select(company);
    cy.get(selectIds.selectInitiative).select(initiative);
  })
  

  specify('cannot add throughput data by file when file is the wrong type', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', null).then((file) => {
      cy.get('input[type=file]').selectFile({
        contents: file,
        fileName: 'file.txt'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.get('button').contains('Submit').click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })

  specify('cannot add throughput data by file when a field is blank', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let blankFieldFile = file.split('\n');
      blankFieldFile[2] = blankFieldFile[2].split(',');
      blankFieldFile[2].splice(0,1);
      blankFieldFile[2] = ',' + blankFieldFile[2];
      blankFieldFile = blankFieldFile.join('\n');
      // console.log(blankFieldFile);

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(blankFieldFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});

    })

    cy.wait(waitTime);
    cy.get('button').contains('Submit').click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })

  specify('cannot add throughput data by file when file format is invalid', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidFormatFile = file.split('\n');
      invalidFormatFile[2] = invalidFormatFile[2].replace(',', ';');
      invalidFormatFile = invalidFormatFile.join('\n');
      // console.log(invalidFormatFile)

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(invalidFormatFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
    })
    cy.wait(waitTime);
    cy.get('button').contains('Submit').click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })

  specify('cannot add throughput data by file when date entry is invalid', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidDateFile = file.split('\n');
      invalidDateFile[3] = invalidDateFile[3].split('/');
      invalidDateFile[3][0] = '23';
      invalidDateFile[3] = invalidDateFile[3].join('/'); invalidDateFile = invalidDateFile.join('\n');
      // console.log(invalidDateFile);

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(invalidDateFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.get('button').contains('Submit').click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })

  specify('cannot add throughput data by file when items completed entry is invalid', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let invalidItemsCompletedFile = file.split('\n');
      let entryToInvalidate = invalidItemsCompletedFile[4].split(',');
      entryToInvalidate[1] = entryToInvalidate[1].replace(entryToInvalidate[1][1], '-3');
      invalidItemsCompletedFile[4] = entryToInvalidate.join(','); invalidItemsCompletedFile = invalidItemsCompletedFile.join('\n');
      // console.log(invalidItemsCompletedFile);
      
      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(invalidItemsCompletedFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.get('button').contains('Submit').click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })
})