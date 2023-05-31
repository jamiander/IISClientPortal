import { AdminUser, TestConstants } from "./TestHelpers";

describe('document spec', () => {

  const consts = TestConstants;
  const modalIds = consts.documentModalIds;
  const tableIds = consts.initiativeTableIds;
  const admin = AdminUser;

  beforeEach(() => {
    cy.login(admin);

    cy.get(tableIds.actionMenu.menuButton).click();
    cy.get(tableIds.actionMenu.documentButton).click();
  })

  specify('client admins can add initiative documents', () => {

  })

  specify('Integrity admins can add initiative documents', () => {

  })

  specify('regular users cannot add initiative documents', () => {

  })

  specify('close button closes the modal', () => {
    cy.get(modalIds.modal).should('exist');
    cy.get(modalIds.closeButton).click();
    cy.get(modalIds.modal).should('not.exist');
  })

})

export {}