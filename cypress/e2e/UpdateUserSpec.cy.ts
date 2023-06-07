import { AdminUser, MBPIAdminUser, MBPICompany, StaplesCompany, TestConstants } from "./TestHelpers";

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
const snackbarWaitTime = consts.snackbarWaitTime;
const admin = AdminUser;

describe("update user spec",() => {
  const pageIds = consts.usersPageIds;
  
  beforeEach(() => {
    cy.login(MBPIAdminUser);

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.users).click();
    cy.wait(1000);
    cy.getByData(pageIds.addButton).click();
    cy.getByData(pageIds.editEmail).type(user.email);
    cy.getByData(pageIds.editPassword).type(user.password);
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(500);

    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.editButton).click();
      cy.getByData(pageIds.editEmail).clear().type(editedUser.email);
      cy.getByData(pageIds.editPassword).clear().type(editedUser.password);
    })
  })

  specify('update a user', () => {
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(500);
    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.email).should('contain',editedUser.email);
    })
  })

  specify('cannot update with invalid input', () => {
    cy.getByData(pageIds.table).children().last().within(() => {
    
      cy.getByData(pageIds.editEmail).clear();
      cy.getByData(pageIds.saveChangesButton).click();
    })

    cy.get(snackbarId).should('contain',failMessage);
    
    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.editEmail).type(editedUser.email);

      cy.getByData(pageIds.editPassword).clear();
      cy.getByData(pageIds.saveChangesButton).click();
      cy.wait(snackbarWaitTime);
    })
    
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button cancels the edit', () => {
    cy.getByData(pageIds.cancelChangesButton).click();
    cy.getByData(pageIds.saveChangesButton).should('not.exist');
    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.email).should('contain',user.email);
    })
  })

  specify('cannot edit multiple users at once', () => {
    cy.getByData(pageIds.editButton).should('be.disabled');
  })
})

describe("update admin user spec", () => {
  const pageIds = consts.integrityPageIds;
  
  beforeEach(() => {
    cy.login(admin);

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.integrity).click();
    cy.wait(1000);
    cy.getByData(pageIds.addButton).click();
    cy.getByData(pageIds.editEmail).type(user.email);
    cy.getByData(pageIds.editPassword).type(user.password);
    cy.getByData(pageIds.editIsAdmin).find('input').check({force:true});
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(500);

    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.editButton).click();
      cy.getByData(pageIds.editEmail).clear().type(editedUser.email);
      cy.getByData(pageIds.editPassword).clear().type(editedUser.password);
      cy.getByData(pageIds.editIsAdmin).find('input').check({force:true});
    })
    
  })

  specify('update an admin user',() => {
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(500);
    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.email).should('contain',editedUser.email);
    })
  })

  specify('cannot update with invalid input', () => {
    cy.getByData(pageIds.table).children().last().within(() => {
    
      cy.getByData(pageIds.editEmail).clear();
      cy.getByData(pageIds.saveChangesButton).click();
    })

    cy.get(snackbarId).should('contain',failMessage);
    
    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.editEmail).type(editedUser.email);

      cy.getByData(pageIds.editPassword).clear();
      cy.getByData(pageIds.saveChangesButton).click();
      cy.wait(snackbarWaitTime);
    })
    
    cy.get(snackbarId).should('contain',failMessage);
  })

  specify('cancel button cancels the edit', () => {
    cy.getByData(pageIds.cancelChangesButton).click();
    cy.getByData(pageIds.saveChangesButton).should('not.exist');
    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.email).should('contain',user.email);
    })
  })

  specify('cannot edit multiple users at once', () => {
    cy.getByData(pageIds.editButton).should('be.disabled');
  })
})

describe('add non-Integrity user as Integrity', () => {

  const pageIds = consts.usersPageIds;
  const editedCompany = MBPICompany;
  const company = StaplesCompany;

  beforeEach(() => {
    cy.login(admin);

    cy.getByData(navIds.menuButton).click();
    cy.getByData(navIds.users).click();
    cy.wait(1000);
    cy.getByData(pageIds.addButton).click();
    cy.getByData(pageIds.editEmail).type(user.email);
    cy.getByData(pageIds.editPassword).type(user.password);   
    cy.getByData(pageIds.selectCompany).parent().muiSelect(company.id);
      
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(500);

    cy.getByData(pageIds.keywordFilter).find('input').clear().type(user.email);

    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.editButton).click();
      cy.getByData(pageIds.editEmail).clear().type(editedUser.email);
      cy.getByData(pageIds.editPassword).clear().type(editedUser.password);
    })
  })

  specify("update a user's company", () => {
    cy.getByData(pageIds.selectCompany).parent().muiSelect(editedCompany.id);
    cy.getByData(pageIds.saveChangesButton).click();
    cy.wait(500);
    cy.getByData(pageIds.keywordFilter).find('input').clear().type(editedUser.email);
    cy.getByData(pageIds.table).children().last().within(() => {
      cy.getByData(pageIds.email).contains(editedUser.email).parent().within(($row) => {
        cy.wrap($row).should('contain',editedCompany.name);
      });
    })
  })
})

export {}