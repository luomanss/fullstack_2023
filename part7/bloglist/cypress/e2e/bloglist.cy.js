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
    cy.get("[data-cy=username-field]").should("exist");
    cy.get("[data-cy=password-field]").should("exist");
  });

  describe("while logging in", () => {
    it("succeeds with correct credentials", () => {
      cy.get("[data-cy=username-field]").type("testuser");
      cy.get("[data-cy=password-field]").type("testpassword");
      cy.get("[data-cy=login-button]").click();
      cy.contains("Test User logged in").should("exist");
    });

    it("fails with wrong credentials", () => {
      cy.get("[data-cy=username-field").type("testuser");
      cy.get("[data-cy=password-field").type("wrongpassword");
      cy.get("[data-cy=login-button]").click();
      cy.contains("Invalid username or password").should("exist");
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
      cy.get("[data-cy=user-menu-button]").click();
      cy.get("[data-cy=logout-button]").click();
      cy.get("[data-cy=username-field]").should("exist");
      cy.get("[data-cy=password-field]").should("exist");
    });

    it("user can create a new blog", () => {
      cy.get("[data-cy=new-blog-modal-button]").click();
      cy.get("[data-cy=title-field]").type(testBlog.title);
      cy.get("[data-cy=author-field]").type(testBlog.author);
      cy.get("[data-cy=url-field]").type(testBlog.url);
      cy.get("[data-cy=create-blog-button]").click();
      cy.contains("A Test Blog by Test Author").should("exist");
    });

    describe("and a blog exists", () => {
      beforeEach(() => {
        cy.createBlog(testBlog);
      });

      it("user can like a blog", () => {
        cy.get("[data-cy=blog-entry]").click();
        cy.get("[data-cy=like-button]").click();
        cy.contains("likes 1").should("exist");
      });

      it("user can delete a blog if he created it", () => {
        cy.intercept("DELETE", "/api/blogs/*").as("deleteBlog");
        cy.get("[data-cy=blog-entry]").click();
        cy.get("[data-cy=delete-button]").click();
        cy.wait("@deleteBlog");
        cy.reload();
        cy.get("[data-cy=blog-entry]").should("not.exist");
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

        cy.get("[data-cy=blog-entry]").contains("A Test Blog").click();

        cy.get("[data-cy=like-button]").click();
        cy.wait("@likeBlog");
        cy.get("[data-cy=nav-link-blogs").click();

        cy.get("[data-cy=blog-entry]").eq(0).should("contain", "A Test Blog");
        cy.get("[data-cy=blog-entry]")
          .eq(1)
          .should("contain", "Another Test Blog");

        cy.get("[data-cy=blog-entry]").contains("Another Test Blog").click();

        cy.get("[data-cy=like-button]").click();
        cy.wait("@likeBlog");
        cy.get("[data-cy=like-button]").click();
        cy.wait("@likeBlog");
        cy.get("[data-cy=nav-link-blogs").click();

        cy.get("[data-cy=blog-entry]")
          .eq(0)
          .should("contain", "Another Test Blog");
        cy.get("[data-cy=blog-entry]").eq(1).should("contain", "A Test Blog");
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
      cy.get("[data-cy=user-menu-button]").click();
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
      cy.get("[data-cy=blog-entry]").click();
      cy.get("[data-cy=delete-button]").should("not.exist");
    });
  });
});
