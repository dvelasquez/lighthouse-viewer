describe('Svelte Component', () => {
  before(() => {
    cy.visit('/lighthouse-viewer/svelte/index.html');
  });
  it('Check heading categories results', () => {
    cy.get('h1').contains('Svelte APP');
    cy.get('.lh-scores-header > [href="#performance"] > .lh-gauge__percentage').contains(96);
    cy.get('.lh-scores-header > [href="#accessibility"] > .lh-gauge__percentage').contains(97);
    cy.get('.lh-scores-header > [href="#best-practices"] > .lh-gauge__percentage').contains(100);
    cy.get('.lh-scores-header > [href="#seo"] > .lh-gauge__percentage').contains(98);
    cy.get('.lh-scores-header > .lh-gauge--pwa__wrapper > .lh-gauge__label').contains('Progressive Web App');
  });
  it('Check performance metrics', () => {
    cy.get(
      '.lh-category-header > :nth-child(1) > .lh-score__gauge > .lh-gauge__wrapper > .lh-gauge__percentage',
    ).contains(96);
    cy.get('#first-contentful-paint > .lh-metric__innerwrap > .lh-metric__value').contains('1.0 s');
    cy.get('#speed-index > .lh-metric__innerwrap > .lh-metric__value').contains('1.4 s');
    cy.get('#largest-contentful-paint > .lh-metric__innerwrap > .lh-metric__value').contains('2.8 s');
    cy.get('#interactive > .lh-metric__innerwrap > .lh-metric__value').contains('1.1 s');
    cy.get('#total-blocking-time > .lh-metric__innerwrap > .lh-metric__value').contains('0 ms');
    cy.get('#cumulative-layout-shift > .lh-metric__innerwrap > .lh-metric__value').contains('0');
  });
  it('Check TreeMap view', () => {
    cy.get('.lh-button').contains('View Treemap');
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
    cy.get('.lh-topbar__url').contains('https://d13z.dev');
    cy.get('.lh-report-icon--date').contains('Captured at Jun 7, 2021, 7:45 AM GMT+2');
    cy.get('.lh-report-icon--devices').contains('Emulated Moto G4 with Lighthouse 8.0.0');
    cy.get('.lh-report-icon--samples-one').contains('Single page load');
    cy.get('.lh-report-icon--stopwatch').contains('Initial page load');
    cy.get('.lh-report-icon--networkspeed').contains('Slow 4G throttling');
    cy.get('.lh-report-icon--chrome').contains('Using Chromium 93.0.4534.0 with cli');
  });
});
