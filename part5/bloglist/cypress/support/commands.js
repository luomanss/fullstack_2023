// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", ({ username, password }) => {
  cy.visit("http://localhost:3000");

  cy.get("[data-cy=username-field]").type(username);
  cy.get("[data-cy=password-field]").type(password);

  cy.get("[data-cy=login-button]").click();
});

Cypress.Commands.add("createBlog", ({ title, author, url }) => {
  cy.get("[data-cy=toggle-visible-button]").click();
  cy.get("[data-cy=title-field]").type(title);
  cy.get("[data-cy=author-field").type(author);
  cy.get("[data-cy=url-field").type(url);
  cy.get("[data-cy=create-blog-button").click();
});