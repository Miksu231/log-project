describe("Main page should work", () => {
  it("Can log in", () => {
    cy.visit("http://localhost:3000")
    cy.get("button").contains("Home page").should("exist")
    cy.get("button").contains("Calendar").should("exist")
    cy.get("button").contains("Login").should("exist")
    cy.get("button").contains("Login").click()
    cy.url().should("include", "/login")

    var loginButton = cy.get("button").contains("Sign in Anonymously")
    loginButton.should("exist")
    cy.get("button").contains("Sign in with Google (redirect)").should("exist")
    loginButton.click()
    // Wait until database processes login
    cy.wait(3000)
    cy.get("button").contains("Logout").should("exist")
  })

  it("Can log in", () => {
    cy.visit("http://localhost:3000")
    cy.get("button").contains("Home page").click()
    cy.contains("Hello, welcome to this site.").should("exist")
  })
})

describe("Calendar should work", () => {
  it("Can add a new note", () => {
    cy.visit("http://localhost:3000")
    cy.get("button").contains("Login").click()
    cy.get("button").contains("Sign in Anonymously").click()
    cy.wait(3000)

    cy.get("button").contains("Calendar").click()
    cy.get("button").contains("8").click()
    cy.get("button").contains("Select").click()
    cy.get("input").click()
  })
})
