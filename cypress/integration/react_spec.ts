describe('React Component', () => {
  before(() => {
    cy.visit('/packages/react2-lighthouse-viewer/demo/lh-demo.html');
  });
  it('Check heading categories results', () => {
    cy.get('h1').contains('REACT APP');
    cy.get('.lh-scores-header > [href="#performance"] > .lh-gauge__percentage').contains(99);
    cy.get('.lh-scores-header > [href="#accessibility"] > .lh-gauge__percentage').contains(97);
    cy.get('.lh-scores-header > [href="#best-practices"] > .lh-gauge__percentage').contains(100);
    cy.get('.lh-scores-header > [href="#seo"] > .lh-gauge__percentage').contains(98);
    cy.get('.lh-scores-header > .lh-gauge--pwa__wrapper > .lh-gauge__label').contains('Progressive Web App');
  });
  it('Check performance metrics', () => {
    cy.get(
      ':nth-child(1) > .lh-category > .lh-category-header > .lh-score__gauge > .lh-gauge__wrapper > .lh-gauge__percentage',
    ).contains(99);
    cy.get('#first-contentful-paint > .lh-metric__innerwrap > .lh-metric__value').contains('1.5 s');
    cy.get('#speed-index > .lh-metric__innerwrap > .lh-metric__value').contains('2.5 s');
    cy.get('#largest-contentful-paint > .lh-metric__innerwrap > .lh-metric__value').contains('1.5 s');
    cy.get('#interactive > .lh-metric__innerwrap > .lh-metric__value').contains('2.7 s');
    cy.get('#total-blocking-time > .lh-metric__innerwrap > .lh-metric__value').contains('10 ms');
    cy.get('#cumulative-layout-shift > .lh-metric__innerwrap > .lh-metric__value').contains('0');
  });
  it('Check Accessibility metrics', () => {
    cy.get(
      ':nth-child(2) > .lh-category > .lh-category-header > .lh-score__gauge > .lh-gauge__wrapper > .lh-gauge__percentage',
    ).contains(97);
  });
  it('Check Best Practices metrics', () => {
    cy.get(
      ':nth-child(3) > .lh-category > .lh-category-header > .lh-score__gauge > .lh-gauge__wrapper > .lh-gauge__percentage',
    ).contains(100);
  });
  it('Check SEO metrics', () => {
    cy.get(
      ':nth-child(4) > .lh-category > .lh-category-header > .lh-score__gauge > .lh-gauge__wrapper > .lh-gauge__percentage',
    ).contains(98);
  });
  it('Runtime Settings', () => {
    cy.get(':nth-child(2) > .lh-env__description').contains('https://d13z.dev');
    cy.get(':nth-child(4) > .lh-env__description').contains('Emulated Moto G4');
    cy.get(':nth-child(5) > .lh-env__description').contains('150 ms TCP RTT, 1,638.4 Kbps throughput (Simulated)');
    cy.get(':nth-child(6) > .lh-env__description').contains('4x slowdown (Simulated)');
    cy.get(':nth-child(7) > .lh-env__description').contains('cli');
    cy.get(':nth-child(8) > .lh-env__description').contains(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.1 Safari/537.36',
    );
    cy.get(':nth-child(9) > .lh-env__description').contains(
      'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4143.7 Mobile Safari/537.36 Chrome-Lighthouse',
    );
    cy.get(':nth-child(10) > .lh-env__description').contains('2277');
    cy.get('.lh-footer__version').contains('6.3.0');
  });
});
