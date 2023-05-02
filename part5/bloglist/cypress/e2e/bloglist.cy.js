describe("Blog page", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3001/api/testing/reset");

    const user = {
      name: "Test User",
      username: "testuser",
      password: "testpassword",
    };

    cy.request("POST", "http://localhost:3001/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("is opened with login form", () => {
    cy.contains("log in to application");
    cy.contains("username");
    cy.contains("password");
  });

  describe("logging in", () => {
    it("succeeds with correct credentials", () => {
      cy.get("#username").type("testuser");
      cy.get("#password").type("testpassword");
      cy.get("#login-button").click();

      cy.contains("Test User logged in");
    });

    it("fails with wrong credentials", () => {
      cy.get("#username").type("testuser");
      cy.get("#password").type("wrongpassword");
      cy.get("#login-button").click();

      cy.contains("Invalid username or password");
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      cy.login({ username: "testuser", password: "testpassword" });
    });

    it("a blog can be created", () => {
      cy.contains("new blog").click();
      cy.get("#title").type("A Test Blog");
      cy.get("#author").type("Test Author");
      cy.get("#url").type("https://example.com");
      cy.get("#create-button").click();

      cy.contains("A Test Blog by Test Author");
    });
  });
});
