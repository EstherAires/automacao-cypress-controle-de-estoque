import { loginElements } from './login.elements'

class login {
  loginSystem(username, password) {
    cy.get(loginElements.username).type(username)
    cy.get(loginElements.password).type(password)
    cy.get(loginElements.loginButton).click()
  }

  goToHomePage() {
    cy.get(loginElements.homePage).click()
    cy.get(loginElements.navBar).should('be.visible')
  }
}
export default new login()
