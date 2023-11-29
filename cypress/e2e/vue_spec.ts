describe('Vue Component', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080/lighthouse-viewer/vue/index.html');
  });
  it('Check heading categories results', () => {
    cy.get('h1').contains('Vue 2 APP');
    cy.get('.lh-scores-header > [href="#performance"] > .lh-gauge__percentage').contains(100);
    cy.get('.lh-scores-header > [href="#accessibility"] > .lh-gauge__percentage').contains(95);
    cy.get('.lh-scores-header > [href="#best-practices"] > .lh-gauge__percentage').contains(100);
    cy.get('.lh-scores-header > [href="#seo"] > .lh-gauge__percentage').contains(98);
    cy.get('.lh-scores-header > .lh-gauge--pwa__wrapper > .lh-gauge__label').contains('PWA');
  });
  it('Check performance metrics', () => {
    cy.get(
      '#performance > div.lh-category-header.lh-category-header__finalscreenshot > div:nth-child(1) > div.lh-exp-gauge-component > div > div > svg > g.lh-exp-gauge__inner > text',
    ).contains(100);
    cy.get('#first-contentful-paint > .lh-metric__innerwrap > .lh-metric__value').contains('1.0 s');
    cy.get('#speed-index > .lh-metric__innerwrap > .lh-metric__value').contains('1.8 s');
    cy.get('#largest-contentful-paint > .lh-metric__innerwrap > .lh-metric__value').contains('1.0 s');
    cy.get('#total-blocking-time > .lh-metric__innerwrap > .lh-metric__value').contains('0 ms');
    cy.get('#cumulative-layout-shift > .lh-metric__innerwrap > .lh-metric__value').contains('0');
  });
  it('Check TreeMap view', () => {
    cy.get('.lh-button').contains('View Treemap');
  });
  it('Check Accessibility metrics', () => {
    cy.get(
      ':nth-child(2) > .lh-category > .lh-category-header > .lh-score__gauge > .lh-gauge__wrapper > .lh-gauge__percentage',
    ).contains(95);
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
    cy.get('.lh-report-icon--devices').contains('Emulated Moto G Power with Lighthouse 11.0.0');
    cy.get('.lh-report-icon--samples-one').contains('Single page load');
    cy.get('.lh-report-icon--stopwatch').contains('Initial page load');
    cy.get('.lh-report-icon--networkspeed').contains('Slow 4G throttling');
    cy.get('.lh-report-icon--chrome').contains('Using Chromium 118.0.0.0 with cli');
  });
});
