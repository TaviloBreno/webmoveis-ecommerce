describe('About Page', () => {
  beforeEach(() => {
    cy.visit('/sobre');
  });

  it('should load the about page', () => {
    cy.contains('Sobre Nós').should('be.visible');
  });

  it('should display company stats', () => {
    cy.contains('10+').should('be.visible');
    cy.contains('Anos de Mercado').should('be.visible');
    cy.contains('50k+').should('be.visible');
    cy.contains('Clientes Felizes').should('be.visible');
  });

  it('should display mission section', () => {
    cy.contains('Nossa Missão').should('be.visible');
  });

  it('should display company values', () => {
    cy.contains('Nossos Valores').should('be.visible');
    cy.contains('Paixão pelo Cliente').should('be.visible');
    cy.contains('Confiança e Segurança').should('be.visible');
    cy.contains('Inovação Constante').should('be.visible');
    cy.contains('Sustentabilidade').should('be.visible');
  });

  it('should display team section', () => {
    cy.contains('Nossa Equipe').should('be.visible');
  });

  it('should have CTA section with link to contact', () => {
    cy.contains('Quer fazer parte da nossa história?').should('be.visible');
    cy.contains('Entre em Contato').should('be.visible');
  });
});
