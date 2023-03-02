import { AddHash } from "./TestHelpers";

describe('add throughput data spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/Login')
    cy.get('#email').clear().type('info@integrityinspired.com');
    cy.get('#password').clear().type('password');
    cy.get('button').contains('Submit').click();

    cy.get('button').contains('Admin').click();
    cy.get('button').contains('Initiatives').click();
    cy.get('button').contains('Upload data').click();
  })
  
  specify('add throughput data by file', () => {
    cy.get('input[type=file]').selectFile('cypress/files/validThroughputDataFile.csv', { action: 'drag-drop' })
  })

  specify('cannot add throughput data by file when file is the wrong type', () => {
    cy.get('input[type=file]').selectFile('cypress/files/wrongTypeThroughputDataFile.txt', {action: 'drag-drop'})
  })

  specify('cannot add throughput data by file when a field is blank', () => {
    cy.get('input[type=file]').selectFile('cypress/files/blankFieldThroughputDataFile.csv', {action: 'drag-drop'})

  })

  specify('cannot add throughput data by file when file format is invalid', () => {
    cy.get('input[type=file]').selectFile('cypress/files/invalidFormatThroughputDataFile.csv', {action: 'drag-drop'})

  })

  specify('cannot add throughput data by file when date entry is invalid', () => {
    cy.get('input[type=file]').selectFile('cypress/files/invalidDateThroughputDataFile.csv', {action: 'drag-drop'})

  })

  specify('cannot add throughput data by file when items completed entry is invalid', () => {
    cy.get('input[type=file]').selectFile('cypress/files/invalidItemsCompletedThroughputDataFile.csv', {action: 'drag-drop'})

  })

})