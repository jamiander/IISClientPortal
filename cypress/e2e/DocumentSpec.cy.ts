import { AdminUser, TestConstants } from "./TestHelpers";

describe('document spec', () => {

  const consts = TestConstants;
  const modalIds = consts.documentModalIds;
  const tableIds = consts.initiativeTableIds;
  const admin = AdminUser;

  beforeEach(() => {
    cy.login(admin);

    cy.getByData(tableIds.actionMenu.menuButton).click();
    cy.getByData(tableIds.actionMenu.documentButton).click();
  })

  specify('client admins can add initiative documents', () => {

  })

  specify('Integrity admins can add initiative documents', () => {

  })

  specify('regular users cannot add initiative documents', () => {

  })

  specify('close button closes the modal', () => {
    cy.getByData(modalIds.modal).should('exist');
    cy.getByData(modalIds.closeButton).click();
    cy.getByData(modalIds.modal).should('not.exist');
  })

})

export {}