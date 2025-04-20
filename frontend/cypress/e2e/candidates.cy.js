/* global Cypress */
/* global cy */

Cypress.Commands.add('dragAndDrop', { prevSubject: 'element' }, (subject, target) => {
  const dataTransfer = new DataTransfer();
  cy.wrap(subject)
    .trigger('dragstart', { dataTransfer })
    .trigger('drag', { dataTransfer });
  cy.get(target)
    .trigger('dragover', { dataTransfer })
    .trigger('drop', { dataTransfer })
    .trigger('dragend', { dataTransfer });
});

describe('Candidates Page Tests', () => {
  it('should navigate to the positions page and view the process of a position', () => {
    cy.visit('http://localhost:3000/positions');
    cy.intercept('GET', '**/positions/*/candidates').as('getCandidates');
    cy.contains('button', 'Ver proceso').first().click();
    cy.url().should('include', '/positions/').then((url) => {
      const positionId = url.split('/').pop(); // Extraer el ID de la posición de la URL
      cy.get('button.mb-3.btn.btn-link').should('be.visible');

      // Interceptar la solicitud de candidatos
      cy.intercept('GET', `http://localhost:3010/positions/${positionId}/candidates`).as('getCandidates');
      cy.wait('@getCandidates');

      // Check if there is a card to move
      cy.get('#root > div > div > div:nth-child(1) > div > div.card-body > div', { timeout: 10000 })
        .should('exist')
        .then((cards) => {
          if (cards.length === 0) {
            throw new Error('No card available to move');
          }
        })
        .first()
        .dragAndDrop('#root > div > div > div:nth-child(2) > div > div.card-body');

      // Add assertions to verify the card has been moved to the correct container
      cy.get('#root > div > div > div:nth-child(2) > div > div.card-body', { timeout: 10000 })
        .should('contain', 'Carlos García');
    });
  });
}); 