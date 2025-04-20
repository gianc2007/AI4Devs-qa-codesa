/* global cy */

// eslint-disable-next-line no-undef

describe('Positions Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/positions');
  });

  it('should display the title centered', () => {
    cy.get('h2.text-center').should('have.css', 'text-align', 'center');
  });

  it('should view the process of the first position', () => {
    cy.contains('button', 'Ver proceso').first().click();
    cy.url().then((url) => {
      const positionId = url.split('/').pop(); // Extraer el ID de la posición de la URL
      cy.get('button.mb-3.btn.btn-link').should('be.visible');

      // Validar las columnas de las fases de contratación
      const phases = ['Initial Screening', 'Technical Interview', 'Manager Interview'];
      phases.forEach(phase => {
        cy.contains('div.text-center.card-header', phase).should('exist');
      });

      // Validar que cada tarjeta de candidato esté en la columna correcta
      cy.request('GET', `http://localhost:3010/positions/${positionId}/candidates`).then((response) => {
        const candidates = response.body;
        if (Array.isArray(candidates)) {
          candidates.forEach(candidate => {
            cy.contains('div.text-center.card-header', candidate.currentInterviewStep).parent().within(() => {
              cy.contains('.card-title', candidate.fullName).should('exist');
            });
          });
        } else {
          throw new Error('La respuesta no es un array');
        }
      });
    });
  });
}); 