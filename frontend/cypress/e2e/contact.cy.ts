describe('Contact Page', () => {
  beforeEach(() => {
    cy.visit('/contatos');
  });

  it('should load the contact page', () => {
    cy.contains('Entre em Contato').should('be.visible');
  });

  it('should display contact information cards', () => {
    cy.contains('Telefone').should('be.visible');
    cy.contains('E-mail').should('be.visible');
    cy.contains('Endereço').should('be.visible');
    cy.contains('Horário').should('be.visible');
  });

  it('should display contact form', () => {
    cy.contains('Envie sua Mensagem').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="subject"]').should('be.visible');
    cy.get('textarea[name="message"]').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click();
    // HTML5 validation will prevent form submission
  });

  it('should submit contact form', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="phone"]').type('11999999999');
    cy.get('input[name="subject"]').type('Test Subject');
    cy.get('textarea[name="message"]').type('This is a test message');
    
    cy.get('button[type="submit"]').click();
    
    // Aguarda a mensagem de sucesso
    cy.contains('Mensagem enviada com sucesso', { timeout: 3000 }).should('be.visible');
  });

  it('should display FAQ section', () => {
    cy.contains('Perguntas Frequentes').should('be.visible');
    cy.contains('Qual o prazo de entrega?').should('be.visible');
  });
});
