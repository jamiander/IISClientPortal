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
const modalIds = consts.uploadThroughputIds;
const tableIds = consts.initiativeTableIds;
const badToastId = consts.toastId;

const initiative = 'IIS Initiative';
const company = 'Integrity Inspired Solutions'
const waitTime = 500;

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
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiative);
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
    cy.get(modalIds.fileSubmit).click();
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
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiative);
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
    cy.get(badToastId).contains('Validation Failed');
  })

  specify('cannot add throughput data by file when a field is blank', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      let blankFieldFile = file.split('\n');
      let fieldToClear = blankFieldFile[2].split(',');
      fieldToClear.splice(0,1);
      blankFieldFile[2] = ',' + fieldToClear;
      blankFieldFile = blankFieldFile.join('\n');
      // console.log(blankFieldFile);

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
      // console.log(invalidFormatFile)

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
      // console.log(invalidDateFile);

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(invalidDateFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});
    })

    cy.wait(waitTime);
    cy.get(modalIds.fileSubmit).click();
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
    cy.get(modalIds.fileSubmit).click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })
})

describe ('add throughput data by manual entry', () => {
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
    });

    cy.get('button').contains('Upload Data').click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiative);
  })

  specify('add throughput data by manual entry', () => {
    cy.get(modalIds.date.month).clear().type('01');
    cy.get(modalIds.date.day).clear().type('01');
    cy.get(modalIds.date.year).clear().type('2020');
    cy.get(modalIds.itemsComplete).clear().type('2');
    cy.get(modalIds.manualSubmit).click();

    cy.wait(waitTime)
    cy.contains('tr', initiative).find(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      expect(remainingItemsBefore-2).to.be.equal(remainingItemsAfter);
    })
  })
})

describe ('invalid manual entry test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();

    cy.get('button').contains('Upload Data').click();
    cy.get(modalIds.selectCompany).select(company);
    cy.get(modalIds.selectInitiative).select(initiative);
  })

  specify('cannot add throughput entry when date is invalid', () => {
    cy.get(modalIds.date.month).clear().type('01');
    cy.get(modalIds.date.day).clear().type('01');
    cy.get(modalIds.itemsComplete).clear().type('2');
    cy.get(modalIds.manualSubmit).click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })

  specify('cannot add throughput entry when letters are entered for date', () => {
    cy.get(modalIds.date.month).clear().type('a');
    cy.get(modalIds.date.day).clear().type('01');
    cy.get(modalIds.date.year).clear().type('2020');
    cy.get(modalIds.itemsComplete).clear().type('2');
    cy.get(modalIds.manualSubmit).click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })

  specify('cannot add throughput entry when item completed is invalid', () => {
    cy.get(modalIds.date.month).clear().type('01');
    cy.get(modalIds.date.day).clear().type('01');
    cy.get(modalIds.date.year).clear().type('2020');
    cy.get(modalIds.manualSubmit).click();
    cy.wait(waitTime);
    cy.get(badToastId).contains('Validation Failed');
  })
})