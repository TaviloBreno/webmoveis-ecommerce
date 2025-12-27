describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page successfully', () => {
    cy.contains('Sua Loja Online de Confiança').should('be.visible');
  });

  it('should display the hero slider', () => {
    cy.get('[aria-label="Próximo slide"]').should('be.visible');
    cy.get('[aria-label="Slide anterior"]').should('be.visible');
  });

  it('should navigate through slides', () => {
    cy.get('[aria-label="Próximo slide"]').click();
    cy.wait(500);
    cy.get('[aria-label="Próximo slide"]').click();
  });

  it('should display stats section', () => {
    cy.contains('10k+').should('be.visible');
    cy.contains('50k+').should('be.visible');
    cy.contains('4.9').should('be.visible');
  });

  it('should display features section', () => {
    cy.contains('Entrega Rápida').should('be.visible');
    cy.contains('Compra Segura').should('be.visible');
  });

  it('should display categories', () => {
    cy.contains('Eletrônicos').should('be.visible');
    cy.contains('Moda').should('be.visible');
  });

  it('should have working navigation links', () => {
    cy.contains('Produtos').click();
    cy.url().should('include', '/produtos');
  });
});
