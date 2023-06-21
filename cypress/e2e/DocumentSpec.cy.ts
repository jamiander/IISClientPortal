import { AdminUser, IntegrityUser, MBPIAdminUser, MBPIUser, TestConstants } from "./TestHelpers";

const clientAdmin = MBPIAdminUser;
const integrityAdmin = AdminUser;
const regularUser = MBPIUser;
const integrityUser = IntegrityUser;
const consts = TestConstants;
const modalIds = consts.documentModalIds;

describe('initiative-level documents', () => {

  const tableIds = consts.initiativeTableIds;

  specify('client admins can add initiative documents', () => {
    cy.login(clientAdmin);

    cy.getByData(tableIds.actionMenu.menuButton).first().click();
    cy.getByData(tableIds.actionMenu.documentButton).click();
    
    cy.getByData(modalIds.documentUpload.chooseFileButton).should('exist').and('not.disabled');
  })

  specify('Integrity admins can add initiative documents', () => {
    cy.login(integrityAdmin);

    cy.getByData(tableIds.actionMenu.menuButton).first().click();
    cy.getByData(tableIds.actionMenu.documentButton).click();
    
    cy.getByData(modalIds.documentUpload.chooseFileButton).should('exist').and('not.disabled');
  })

  specify('regular users cannot add initiative documents', () => {
    cy.login(regularUser);

    cy.getByData(tableIds.actionMenu.menuButton).first().click();
    cy.getByData(tableIds.actionMenu.documentButton).click();
    
    cy.getByData(modalIds.documentUpload.chooseFileButton).should('not.exist');
  })

  specify('regular Integrity users cannot add initiative documents', () => {
    cy.login(integrityUser);

    cy.getByData(tableIds.actionMenu.menuButton).first().click();
    cy.getByData(tableIds.actionMenu.documentButton).click();
    
    cy.getByData(modalIds.documentUpload.chooseFileButton).should('not.exist');
  })

  specify('close button closes the modal', () => {
    cy.login(regularUser);

    cy.getByData(tableIds.actionMenu.menuButton).first().click();
    cy.getByData(tableIds.actionMenu.documentButton).click();

    cy.getByData(modalIds.modal).should('exist');
    cy.getByData(modalIds.closeModalButton).click();
    cy.getByData(modalIds.modal).should('not.exist');
  })
})

describe('client-level documents', () => {
  const pageIds = consts.clientPageIds;
  const navIds = consts.navPanelIds;
  const table = consts.initiativeTableIds.table;

  specify('client admins cannot add/see client documents', () => {
    cy.login(clientAdmin);
    cy.getByData(table).should('exist');
    
    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.client).click();
    cy.getByData(pageIds.actionMenu.menuButton).first().click();
    cy.getByData(pageIds.actionMenu.documentButton).should('not.exist');
  })

  specify('Integrity admins can add/see client documents', () => {
    cy.login(integrityAdmin);
    cy.getByData(table).should('exist');

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.client).click();
    cy.getByData(pageIds.actionMenu.menuButton).first().click();
    cy.getByData(pageIds.actionMenu.documentButton).click();
    
    cy.getByData(modalIds.documentUpload.chooseFileButton).should('exist').and('not.disabled');
  })

  specify('regular users cannot add/see client documents', () => {
    cy.login(regularUser);
    cy.getByData(table).should('exist');

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.client).click();
    cy.getByData(pageIds.actionMenu.menuButton).click();
    cy.getByData(pageIds.actionMenu.documentButton).should('not.exist');
  })

  specify('regular Integrity users cannot add client documents', () => {
    cy.login(integrityUser);
    cy.getByData(table).should('exist');

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.client).click();
    cy.getByData(pageIds.actionMenu.menuButton).first().click();
    cy.getByData(pageIds.actionMenu.documentButton).click();

    cy.getByData(modalIds.documentUpload.chooseFileButton).should('not.exist');
  })

  specify('close button closes the modal', () => {
    cy.login(integrityAdmin);
    cy.getByData(table).should('exist');

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.client).click();
    cy.getByData(pageIds.actionMenu.menuButton).first().click();
    cy.getByData(pageIds.actionMenu.documentButton).click();

    cy.getByData(modalIds.modal).should('exist');
    cy.getByData(modalIds.closeModalButton).click();
    cy.getByData(modalIds.modal).should('not.exist');
  })
})

export {}