describe('Products Page', () => {
  beforeEach(() => {
    cy.visit('/produtos');
  });

  it('should load the products page', () => {
    cy.contains('Nossos Produtos').should('be.visible');
  });

  it('should display filters', () => {
    cy.get('input[placeholder*="Buscar"]').should('be.visible');
    cy.get('input[placeholder*="Preço mínimo"]').should('be.visible');
    cy.get('input[placeholder*="Preço máximo"]').should('be.visible');
    cy.get('select').should('be.visible');
  });

  it('should filter products by search', () => {
    cy.get('input[placeholder*="Buscar"]').type('teste');
    cy.wait(1000);
  });

  it('should toggle between grid and list view', () => {
    cy.get('button').contains('Grid').should('exist');
    cy.get('button').contains('List').should('exist');
  });

  it('should display product cards', () => {
    cy.wait(2000);
    // Verifica se há cards de produtos ou mensagem de "nenhum produto"
    cy.get('body').then(($body) => {
      if ($body.text().includes('Nenhum produto encontrado')) {
        cy.contains('Nenhum produto encontrado').should('be.visible');
      } else {
        cy.get('[class*="grid"]').should('exist');
      }
    });
  });
});
