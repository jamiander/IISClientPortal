import { table } from "console";
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

describe('add throughput data spec', () => {

  const consts = TestConstants;
  const selectIds = consts.UploadThroughputIds;
  const tableIds = consts.InitiativeTableIds;
  let remainingItemsBefore: number;

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();
    cy.contains('td', 'IIS Initiative').siblings().get(tableIds.remainingItems).then(($span) => {
      remainingItemsBefore = Number($span.text());
      // console.log('remainingItemsBefore:', remainingItemsBefore);
    });
    cy.get('button').contains('Upload data').click();
  })
  
  specify.only('add throughput data by file', () => {

    cy.get(selectIds.selectCompany).select('Integrity Inspired Solutions');
    cy.get(selectIds.selectInitiative).select('IIS Initiative');

    let itemsCompletedInUpload : number;
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      itemsCompletedInUpload = findItemsCompleted(file);
      // console.log('itemsCompletedInUpload:',itemsCompletedInUpload);

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(file),
        fileName: 'file.csv' 
      }, {action: 'drag-drop'});  
    })

    cy.get('button').contains('Submit').click();
    cy.contains('td', 'IIS Initiative').siblings().get(tableIds.remainingItems).then(($span) => {
      let remainingItemsAfter = Number($span.text());
      // console.log('remainingItemsAfter:', remainingItemsAfter);
      expect(remainingItemsBefore-itemsCompletedInUpload).to.be.equal(remainingItemsAfter);
    })
  })

  specify('cannot add throughput data by file when file is the wrong type', () => {
    cy.get('input[type=file]').selectFile('cypress/data/wrongTypeThroughputDataFile.txt', {action: 'drag-drop'});
  })

  specify('cannot add throughput data by file when a field is blank', () => {
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {
      // expect(Cypress.Buffer.isBuffer(file)).to.be.true
      let blankFieldFile = file.split('\n');
      blankFieldFile[2] = blankFieldFile[2].split(',');
      blankFieldFile[2].splice(0,1);
      blankFieldFile[2] = ',' + blankFieldFile[2];
      blankFieldFile = blankFieldFile.join('\n');
      console.log(blankFieldFile);

      cy.get('input[type=file]').selectFile({
        contents: Cypress.Buffer.from(blankFieldFile),
        fileName: 'file.csv'
      }, {action: 'drag-drop'});

    })
    // cy.get('button').contains('Submit').click()
  })

  specify('cannot add throughput data by file when file format is invalid', () => {
    cy.get('input[type=file]').selectFile('cypress/data/invalidFormatThroughputDataFile.csv', {action: 'drag-drop'});

  })

  specify('cannot add throughput data by file when date entry is invalid', () => {
    // cy.get('input[type=file]').selectFile('cypress/data/invalidDateThroughputDataFile.csv', {action: 'drag-drop'})
    cy.readFile('cypress/data/validThroughputDataFile.csv', 'ascii').then((file) => {

    })

  })

  specify('cannot add throughput data by file when items completed entry is invalid', () => {
    cy.get('input[type=file]').selectFile('cypress/data/invalidItemsCompletedThroughputDataFile.csv', {action: 'drag-drop'});

  })

})