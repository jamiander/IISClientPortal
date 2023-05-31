import { TestConstants } from "./TestHelpers";

describe('document spec', () => {

  const consts = TestConstants;
  const modalIds = consts.decisionModalIds;

  beforeEach(() => {
    
  })

  specify('close button closes the modal', () => {
    cy.get(modalIds.closeButton).click();
  })

})

export {}