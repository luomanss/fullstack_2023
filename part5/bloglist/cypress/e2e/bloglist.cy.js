describe("Blog app", () => {
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
    cy.get("[data-cy=username-field]");
    cy.get("[data-cy=password-field]");
  });

  describe("while logging in", () => {
    it("succeeds with correct credentials", () => {
      cy.get("[data-cy=username-field]").type("testuser");
      cy.get("[data-cy=password-field]").type("testpassword");
      cy.get("[data-cy=login-button]").click();
      cy.contains("Test User logged in");
    });

    it("fails with wrong credentials", () => {
      cy.get("[data-cy=username-field").type("testuser");
      cy.get("[data-cy=password-field").type("wrongpassword");
      cy.get("[data-cy=login-button]").click();
      cy.contains("Invalid username or password");
    });
  });

  describe("when logged in", () => {
    const testBlog = {
      title: "A Test Blog",
      author: "Test Author",
      url: "https://example.com",
    };

    beforeEach(() => {
      cy.login({ username: "testuser", password: "testpassword" });
    });

    it("user can log out", () => {
      cy.get("[data-cy=logout-button]").click();
      cy.contains("log in to application");
    });

    it("user can create a new blog", () => {
      cy.get("[data-cy=toggle-visible-button]").click();
      cy.get("[data-cy=title-field]").type(testBlog.title);
      cy.get("[data-cy=author-field]").type(testBlog.author);
      cy.get("[data-cy=url-field]").type(testBlog.url);
      cy.get("[data-cy=create-blog-button]").click();
      cy.contains("A Test Blog by Test Author");
    });

    describe("and a blog exists", () => {
      beforeEach(() => {
        cy.createBlog(testBlog);
      });

      it("user can like a blog", () => {
        cy.get("[data-cy=view-button]").click();
        cy.get("[data-cy=like-button]").click();
        cy.contains("likes 1");
      });

      it("user can delete a blog if he created it", () => {
        cy.get("[data-cy=view-button]").click();
        cy.get("[data-cy=delete-button]").click();
        cy.get("[data-cy=blog]").should("not.exist");
      });
    });

    describe("and multiple blogs exist", () => {
      const anotherTestBlog = {
        title: "Another Test Blog",
        author: "Another Test Author",
        url: "https://example.com/another",
      };

      beforeEach(() => {
        cy.intercept("POST", "/api/blogs").as("createBlog");
        cy.createBlog(testBlog);
        cy.wait("@createBlog");
        cy.createBlog(anotherTestBlog);
        cy.wait("@createBlog");
      });

      it("blogs are sorted by likes", () => {
        cy.intercept("PATCH", "/api/blogs/*").as("likeBlog");

        cy.get("[data-cy=blog]")
          .contains("A Test Blog Test Author")
          .within(() => {
            cy.get("[data-cy=view-button]").click();
            cy.get("[data-cy=like-button]").click();
            cy.wait("@likeBlog");
          });

        cy.get("[data-cy=blog]")
          .eq(0)
          .should("contain", "A Test Blog Test Author");
        cy.get("[data-cy=blog]")
          .eq(1)
          .should("contain", "Another Test Blog Another Test Author");

        cy.get("[data-cy=blog]")
          .contains("Another Test Blog Another Test Author")
          .within(() => {
            cy.get("[data-cy=view-button]").click();
            cy.get("[data-cy=like-button]").click();
            cy.wait("@likeBlog");
            cy.get("[data-cy=like-button]").click();
            cy.wait("@likeBlog");
          });

        cy.get("[data-cy=blog]")
          .eq(0)
          .should("contain", "Another Test Blog Another Test Author");
        cy.get("[data-cy=blog]")
          .eq(1)
          .should("contain", "A Test Blog Test Author");
      });
    });
  });

  describe("logging in as other user", () => {
    const testBlog = {
      title: "A Test Blog",
      author: "Test Author",
      url: "https://example.com",
    };

    beforeEach(() => {
      cy.intercept("POST", "/api/blogs").as("createBlog");
      cy.login({ username: "testuser", password: "testpassword" });
      cy.createBlog(testBlog);
      cy.wait("@createBlog");
      cy.get("[data-cy=logout-button]").click();

      const otherUser = {
        name: "Other User",
        username: "otheruser",
        password: "otherpassword",
      };

      cy.request("POST", "http://localhost:3001/api/users", otherUser);
      cy.reload();
      cy.login({ username: "otheruser", password: "otherpassword" });
    });

    it("user cannot delete blog by another user", () => {
      cy.contains("view").click();
      cy.contains("delete").should("not.exist");
    });
  });
});
