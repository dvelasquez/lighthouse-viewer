/**
 * @license
 * Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * @fileoverview Adds tools button, print, and other dynamic functionality to
 * the report.
 */

/** @typedef {import('./dom').DOM} DOM */

import {Util} from './util.js';

export class ReportUIFeatures {
  /**
   * @param {DOM} dom
   */
  constructor(dom) {
    /** @type {LH.Result} */
    this.json; // eslint-disable-line no-unused-expressions
    /** @type {DOM} */
    this._dom = dom;
    /** @type {Document} */
    this._document = this._dom.document();

    this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
  }

  /**
   * Adds tools button, print, and other functionality to the report. The method
   * should be called whenever the report needs to be re-rendered.
   * @param {LH.Result} lhr
   */
  initFeatures(lhr) {
    this.json = lhr;

    this._topbar.enable(lhr);
    this._topbar.resetUIState();
    this._setupMediaQueryListeners();

    // Show the metric descriptions by default when there is an error.
    const hasMetricError = lhr.categories.performance && lhr.categories.performance.auditRefs
      .some(audit => Boolean(audit.group === 'metrics' && lhr.audits[audit.id].errorMessage));
    if (hasMetricError) {
      const toggleInputEl = this._dom.find('input.lh-metrics-toggle__input', this._document);
      toggleInputEl.checked = true;
    }

    // Fill in all i18n data.
    for (const node of this._dom.findAll('[data-i18n]', this._dom.document())) {
      // These strings are guaranteed to (at least) have a default English string in Util.UIStrings,
      // so this cannot be undefined as long as `report-ui-features.data-i18n` test passes.
      const i18nKey = node.getAttribute('data-i18n');
      const i18nAttr = /** @type {keyof typeof Util.i18n.strings} */ (i18nKey);
      node.textContent = Util.i18n.strings[i18nAttr];
    }
  }

  /**
   * @param {{container?: Element, text: string, icon?: string, onClick: () => void}} opts
   */
  addButton(opts) {
    // report-ui-features doesn't have a reference to the root report el, and PSI has
    // 2 reports on the page (and not even attached to DOM when installFeatures is called..)
    // so we need a container option to specify where the element should go.
    const metricsEl = this._document.querySelector('.lh-audit-group--metrics');
    const containerEl = opts.container || metricsEl;
    if (!containerEl) return;

    let buttonsEl = containerEl.querySelector('.lh-buttons');
    if (!buttonsEl) buttonsEl = this._dom.createChildOf(containerEl, 'div', 'lh-buttons');

    const classes = [
      'lh-button',
    ];
    if (opts.icon) {
      classes.push('lh-report-icon');
      classes.push(`lh-report-icon--${opts.icon}`);
    }
    const buttonEl = this._dom.createChildOf(buttonsEl, 'button', classes.join(' '));
    buttonEl.textContent = opts.text;
    buttonEl.addEventListener('click', opts.onClick);
    return buttonEl;
  }

  /**
   * Returns the html that recreates this report.
   * @return {string}
   */
  getReportHtml() {
    this._topbar.resetUIState();
    return this._document.documentElement.outerHTML;
  }

  /**
   * Save json as a gist. Unimplemented in base UI features.
   */
  saveAsGist() {
    // TODO ?
    throw new Error('Cannot save as gist from base report');
  }

  _setupMediaQueryListeners() {
    const mediaQuery = self.matchMedia('(max-width: 500px)');
    mediaQuery.addListener(this.onMediaQueryChange);
    // Ensure the handler is called on init
    this.onMediaQueryChange(mediaQuery);
  }

  /**
   * Resets the state of page before capturing the page for export.
   * When the user opens the exported HTML page, certain UI elements should
   * be in their closed state (not opened) and the templates should be unstamped.
   */
  _resetUIState() {
    this._topbar.resetUIState();
  }

  /**
   * Handle media query change events.
   * @param {MediaQueryList|MediaQueryListEvent} mql
   */
  onMediaQueryChange(mql) {
    const root = this._dom.find('.lh-root', this._document);
    root.classList.toggle('lh-narrow', mql.matches);
  }
}
