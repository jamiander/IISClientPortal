import { AdminUser, MBPIAdminUser, TestConstants } from "./TestHelpers";

const user = {
  email: "zzztest@testing.com",
  password: "password",
  initaitiveIds: []
}

const editedUser = {
  email: "zzztoast@toasting.com",
  password: "p4$$20rd"
}

const consts = TestConstants;
const navIds = consts.navPanelIds;
const failMessage = consts.validationFailedMessage;
const snackbarId = consts.snackbarId;
const loginIds = consts.loginPageIds;
const snackbarWaitTime = consts.snackbarWaitTime;
const admin = AdminUser;

describe("update user spec",() => {
  const pageIds = consts.usersPageIds;
  
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(MBPIAdminUser.email);
    cy.get(loginIds.password).clear().type(MBPIAdminUser.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(navIds.users).click();
    cy.wait(1000);
    cy.get(pageIds.addButton).click({force:true});
    cy.get(pageIds.email).type(user.email);
    cy.get(pageIds.password).type(user.password);
    //cy.get(pageIds.isAdmin).check({force:true});
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(500);

    cy.get(pageIds.table).children().last().within(() => {
      cy.get(pageIds.editButton).click();
      cy.get(pageIds.email).clear().type(editedUser.email);
      cy.get(pageIds.password).clear().type(editedUser.password);
      //cy.get(pageIds.isAdmin).check({force:true});
    })
    
  })

  specify('update a user',() => {
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(500);
    cy.get(pageIds.table).children().last().within(() => {
      cy.get(pageIds.email).should('contain',editedUser.email);
    })
  })

  specify('cannot update with invalid input', () => {
    cy.get(pageIds.table).children().last().within(() => {
    
      cy.get(pageIds.email).clear();
      cy.get(pageIds.saveChangesButton).click();
    })

    cy.get(snackbarId).should('contain',failMessage);
    
    cy.get(pageIds.table).children().last().within(() => {
      cy.get(pageIds.email).type(editedUser.email);

      cy.get(pageIds.password).clear();
      cy.get(pageIds.saveChangesButton).click();
      cy.wait(snackbarWaitTime);
    })
    
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button cancels the edit', () => {
    cy.get(pageIds.cancelChangesButton).click();
    cy.get(pageIds.saveChangesButton).should('not.exist');
    cy.get(pageIds.table).children().last().within(() => {
      cy.get(pageIds.email).should('contain',user.email);
    })
  })

  specify('cannot edit multiple users at once', () => {
    cy.get(pageIds.editButton).should('be.disabled');
  })
})

describe("update admin user spec", () => {
  const pageIds = consts.integrityPageIds;
  
  beforeEach(() => {
    cy.visit('http://localhost:3000/Login');
    cy.get(loginIds.email).clear().type(admin.email);
    cy.get(loginIds.password).clear().type(admin.password);
    cy.wait(500);
    cy.get(loginIds.submitButton).click();

    cy.get(navIds.integrity).click();
    cy.wait(1000);
    cy.get(pageIds.addButton).click({force:true});
    cy.get(pageIds.email).type(user.email);
    cy.get(pageIds.password).type(user.password);
    cy.get(pageIds.isAdmin).check({force:true});
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(500);

    cy.get(pageIds.table).children().last().within(() => {
      cy.get(pageIds.editButton).click();
      cy.get(pageIds.email).clear().type(editedUser.email);
      cy.get(pageIds.password).clear().type(editedUser.password);
      cy.get(pageIds.isAdmin).check({force:true});
    })
    
  })

  specify('update an admin user',() => {
    cy.get(pageIds.saveChangesButton).click();
    cy.wait(500);
    cy.get(pageIds.table).children().last().within(() => {
      cy.get(pageIds.email).should('contain',editedUser.email);
    })
  })

  specify('cannot update with invalid input', () => {
    cy.get(pageIds.table).children().last().within(() => {
    
      cy.get(pageIds.email).clear();
      cy.get(pageIds.saveChangesButton).click();
    })

    cy.get(snackbarId).should('contain',failMessage);
    
    cy.get(pageIds.table).children().last().within(() => {
      cy.get(pageIds.email).type(editedUser.email);

      cy.get(pageIds.password).clear();
      cy.get(pageIds.saveChangesButton).click();
      cy.wait(snackbarWaitTime);
    })
    
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button cancels the edit', () => {
    cy.get(pageIds.cancelChangesButton).click();
    cy.get(pageIds.saveChangesButton).should('not.exist');
    cy.get(pageIds.table).children().last().within(() => {
      cy.get(pageIds.email).should('contain',user.email);
    })
  })

  specify('cannot edit multiple users at once', () => {
    cy.get(pageIds.editButton).should('be.disabled');
  })
})

export {}