var Ee=Object.defineProperty,ke=Object.defineProperties;var Ae=Object.getOwnPropertyDescriptors;var ue=Object.getOwnPropertySymbols;var Ce=Object.prototype.hasOwnProperty,Se=Object.prototype.propertyIsEnumerable;var re=(r,e,t)=>e in r?Ee(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,ee=(r,e)=>{for(var t in e||(e={}))Ce.call(e,t)&&re(r,t,e[t]);if(ue)for(var t of ue(e))Se.call(e,t)&&re(r,t,e[t]);return r},ge=(r,e)=>ke(r,Ae(e));var me=(r,e,t)=>(re(r,typeof e!="symbol"?e+"":e,t),t);/**
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
 */const F="\u2026",J="\xA0",fe=.9,be="data:image/jpeg;base64,",N={PASS:{label:"pass",minScore:fe},AVERAGE:{label:"average",minScore:.5},FAIL:{label:"fail"},ERROR:{label:"error"}},ze=["com","co","gov","edu","ac","org","go","gob","or","net","in","ne","nic","gouv","web","spb","blog","jus","kiev","mil","wi","qc","ca","bel","on"],x=class{static get PASS_THRESHOLD(){return fe}static get MS_DISPLAY_VALUE(){return`%10d${J}ms`}static prepareReportResult(e){const t=JSON.parse(JSON.stringify(e));t.configSettings.locale||(t.configSettings.locale="en"),t.configSettings.formFactor||(t.configSettings.formFactor=t.configSettings.emulatedFormFactor);for(const a of Object.values(t.audits))if((a.scoreDisplayMode==="not_applicable"||a.scoreDisplayMode==="not-applicable")&&(a.scoreDisplayMode="notApplicable"),a.details&&((a.details.type===void 0||a.details.type==="diagnostic")&&(a.details.type="debugdata"),a.details.type==="filmstrip"))for(const l of a.details.items)l.data.startsWith(be)||(l.data=be+l.data);if(typeof t.categories!="object")throw new Error("No categories provided.");const n=new Map,[o]=t.lighthouseVersion.split(".").map(Number),i=t.categories.performance;if(o<9&&i){t.categoryGroups||(t.categoryGroups={}),t.categoryGroups.hidden={title:""};for(const a of i.auditRefs)a.group?["load-opportunities","diagnostics"].includes(a.group)&&delete a.group:a.group="hidden"}for(const a of Object.values(t.categories))a.auditRefs.forEach(l=>{!l.relevantAudits||l.relevantAudits.forEach(s=>{const c=n.get(s)||[];c.push(l),n.set(s,c)})}),a.auditRefs.forEach(l=>{const s=t.audits[l.id];l.result=s,n.has(l.id)&&(l.relevantMetrics=n.get(l.id)),t.stackPacks&&t.stackPacks.forEach(c=>{c.descriptions[l.id]&&(l.stackPacks=l.stackPacks||[],l.stackPacks.push({title:c.title,iconDataURL:c.iconDataURL,description:c.descriptions[l.id]}))})});return t}static showAsPassed(e){switch(e.scoreDisplayMode){case"manual":case"notApplicable":return!0;case"error":case"informative":return!1;case"numeric":case"binary":default:return Number(e.score)>=N.PASS.minScore}}static calculateRating(e,t){if(t==="manual"||t==="notApplicable")return N.PASS.label;if(t==="error")return N.ERROR.label;if(e===null)return N.FAIL.label;let n=N.FAIL.label;return e>=N.PASS.minScore?n=N.PASS.label:e>=N.AVERAGE.minScore&&(n=N.AVERAGE.label),n}static splitMarkdownCodeSpans(e){const t=[],n=e.split(/`(.*?)`/g);for(let o=0;o<n.length;o++){const i=n[o];if(!i)continue;const a=o%2!=0;t.push({isCode:a,text:i})}return t}static splitMarkdownLink(e){const t=[],n=e.split(/\[([^\]]+?)\]\((https?:\/\/.*?)\)/g);for(;n.length;){const[o,i,a]=n.splice(0,3);o&&t.push({isLink:!1,text:o}),i&&a&&t.push({isLink:!0,text:i,linkHref:a})}return t}static getURLDisplayName(e,t){t=t||{numPathParts:void 0,preserveQuery:void 0,preserveHost:void 0};const n=t.numPathParts!==void 0?t.numPathParts:2,o=t.preserveQuery!==void 0?t.preserveQuery:!0,i=t.preserveHost||!1;let a;if(e.protocol==="about:"||e.protocol==="data:")a=e.href;else{a=e.pathname;const s=a.split("/").filter(c=>c.length);n&&s.length>n&&(a=F+s.slice(-1*n).join("/")),i&&(a=`${e.host}/${a.replace(/^\//,"")}`),o&&(a=`${a}${e.search}`)}const l=64;if(a=a.replace(/([a-f0-9]{7})[a-f0-9]{13}[a-f0-9]*/g,`$1${F}`),a=a.replace(/([a-zA-Z0-9-_]{9})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9-_]{10,}/g,`$1${F}`),a=a.replace(/(\d{3})\d{6,}/g,`$1${F}`),a=a.replace(/\u2026+/g,F),a.length>l&&a.includes("?")&&(a=a.replace(/\?([^=]*)(=)?.*/,`?$1$2${F}`),a.length>l&&(a=a.replace(/\?.*/,`?${F}`))),a.length>l){const s=a.lastIndexOf(".");s>=0?a=a.slice(0,l-1-(a.length-s))+`${F}${a.slice(s)}`:a=a.slice(0,l-1)+F}return a}static parseURL(e){const t=new URL(e);return{file:x.getURLDisplayName(t),hostname:t.hostname,origin:t.origin}}static createOrReturnURL(e){return e instanceof URL?e:new URL(e)}static getTld(e){const t=e.split(".").slice(-2);return ze.includes(t[0])?`.${t.join(".")}`:`.${t[t.length-1]}`}static getRootDomain(e){const t=x.createOrReturnURL(e).hostname,o=x.getTld(t).split(".");return t.split(".").slice(-o.length).join(".")}static getEmulationDescriptions(e){let t,n,o;const i=e.throttling;switch(e.throttlingMethod){case"provided":o=n=t=x.i18n.strings.throttlingProvided;break;case"devtools":{const{cpuSlowdownMultiplier:l,requestLatencyMs:s}=i;t=`${x.i18n.formatNumber(l)}x slowdown (DevTools)`,n=`${x.i18n.formatNumber(s)}${J}ms HTTP RTT, ${x.i18n.formatNumber(i.downloadThroughputKbps)}${J}Kbps down, ${x.i18n.formatNumber(i.uploadThroughputKbps)}${J}Kbps up (DevTools)`,o=(()=>s===150*3.75&&i.downloadThroughputKbps===1.6*1024*.9&&i.uploadThroughputKbps===750*.9)()?x.i18n.strings.runtimeSlow4g:x.i18n.strings.runtimeCustom;break}case"simulate":{const{cpuSlowdownMultiplier:l,rttMs:s,throughputKbps:c}=i;t=`${x.i18n.formatNumber(l)}x slowdown (Simulated)`,n=`${x.i18n.formatNumber(s)}${J}ms TCP RTT, ${x.i18n.formatNumber(c)}${J}Kbps throughput (Simulated)`,o=(()=>s===150&&c===1.6*1024)()?x.i18n.strings.runtimeSlow4g:x.i18n.strings.runtimeCustom;break}default:o=t=n=x.i18n.strings.runtimeUnknown}return{deviceEmulation:{mobile:x.i18n.strings.runtimeMobileEmulation,desktop:x.i18n.strings.runtimeDesktopEmulation}[e.formFactor]||x.i18n.strings.runtimeNoEmulation,cpuThrottling:t,networkThrottling:n,summary:o}}static filterRelevantLines(e,t,n){if(t.length===0)return e.slice(0,n*2+1);const o=3,i=new Set;return t=t.sort((a,l)=>(a.lineNumber||0)-(l.lineNumber||0)),t.forEach(({lineNumber:a})=>{let l=a-n,s=a+n;for(;l<1;)l++,s++;i.has(l-o-1)&&(l-=o);for(let c=l;c<=s;c++){const d=c;i.add(d)}}),e.filter(a=>i.has(a.lineNumber))}static isPluginCategory(e){return e.startsWith("lighthouse-plugin-")}static shouldDisplayAsFraction(e){return e==="timespan"||e==="snapshot"}static calculateCategoryFraction(e){let t=0,n=0,o=0,i=0;for(const a of e.auditRefs){const l=x.showAsPassed(a.result);if(!(a.group==="hidden"||a.result.scoreDisplayMode==="manual"||a.result.scoreDisplayMode==="notApplicable")){if(a.result.scoreDisplayMode==="informative"){l||++o;continue}++t,i+=a.weight,l&&n++}}return{numPassed:n,numPassableAudits:t,numInformative:o,totalWeight:i}}};let u=x;me(u,"i18n",null);u.reportJson=null;u.getUniqueSuffix=(()=>{let r=0;return function(){return r++}})();const Le={varianceDisclaimer:"Values are estimated and may vary. The [performance score is calculated](https://web.dev/performance-scoring/) directly from these metrics.",calculatorLink:"See calculator.",showRelevantAudits:"Show audits relevant to:",opportunityResourceColumnLabel:"Opportunity",opportunitySavingsColumnLabel:"Estimated Savings",errorMissingAuditInfo:"Report error: no audit information",errorLabel:"Error!",warningHeader:"Warnings: ",warningAuditsGroupTitle:"Passed audits but with warnings",passedAuditsGroupTitle:"Passed audits",notApplicableAuditsGroupTitle:"Not applicable",manualAuditsGroupTitle:"Additional items to manually check",toplevelWarningsMessage:"There were issues affecting this run of Lighthouse:",crcInitialNavigation:"Initial Navigation",crcLongestDurationLabel:"Maximum critical path latency:",snippetExpandButtonLabel:"Expand snippet",snippetCollapseButtonLabel:"Collapse snippet",lsPerformanceCategoryDescription:"[Lighthouse](https://developers.google.com/web/tools/lighthouse/) analysis of the current page on an emulated mobile network. Values are estimated and may vary.",labDataTitle:"Lab Data",thirdPartyResourcesLabel:"Show 3rd-party resources",viewTreemapLabel:"View Treemap",dropdownPrintSummary:"Print Summary",dropdownPrintExpanded:"Print Expanded",dropdownCopyJSON:"Copy JSON",dropdownSaveHTML:"Save as HTML",dropdownSaveJSON:"Save as JSON",dropdownViewer:"Open in Viewer",dropdownSaveGist:"Save as Gist",dropdownDarkTheme:"Toggle Dark Theme",runtimeSettingsDevice:"Device",runtimeSettingsNetworkThrottling:"Network throttling",runtimeSettingsCPUThrottling:"CPU throttling",runtimeSettingsUANetwork:"User agent (network)",runtimeSettingsBenchmark:"CPU/Memory Power",runtimeSettingsAxeVersion:"Axe version",footerIssue:"File an issue",runtimeNoEmulation:"No emulation",runtimeMobileEmulation:"Emulated Moto G4",runtimeDesktopEmulation:"Emulated Desktop",runtimeUnknown:"Unknown",runtimeSingleLoad:"Single page load",runtimeAnalysisWindow:"Initial page load",runtimeSingleLoadTooltip:"This data is taken from a single page load, as opposed to field data summarizing many sessions.",throttlingProvided:"Provided by environment",show:"Show",hide:"Hide",expandView:"Expand view",collapseView:"Collapse view",runtimeSlow4g:"Slow 4G throttling",runtimeCustom:"Custom throttling"};u.UIStrings=Le;function Me(r){const e=r.createFragment(),t=r.createElement("style");t.append(`
    .lh-3p-filter {
      color: var(--color-gray-600);
      float: right;
      padding: 6px var(--stackpack-padding-horizontal);
    }
    .lh-3p-filter-label, .lh-3p-filter-input {
      vertical-align: middle;
      user-select: none;
    }
    .lh-3p-filter-input:disabled + .lh-3p-ui-string {
      text-decoration: line-through;
    }
  `),e.append(t);const n=r.createElement("div","lh-3p-filter"),o=r.createElement("label","lh-3p-filter-label"),i=r.createElement("input","lh-3p-filter-input");i.setAttribute("type","checkbox"),i.setAttribute("checked","");const a=r.createElement("span","lh-3p-ui-string");a.append("Show 3rd party resources");const l=r.createElement("span","lh-3p-filter-count");return o.append(" ",i," ",a," (",l,") "),n.append(" ",o," "),e.append(n),e}function Te(r){const e=r.createFragment(),t=r.createElement("div","lh-audit"),n=r.createElement("details","lh-expandable-details"),o=r.createElement("summary"),i=r.createElement("div","lh-audit__header lh-expandable-details__summary"),a=r.createElement("span","lh-audit__score-icon"),l=r.createElement("span","lh-audit__title-and-text"),s=r.createElement("span","lh-audit__title"),c=r.createElement("span","lh-audit__display-text");l.append(" ",s," ",c," ");const d=r.createElement("div","lh-chevron-container");i.append(" ",a," ",l," ",d," "),o.append(" ",i," ");const h=r.createElement("div","lh-audit__description"),p=r.createElement("div","lh-audit__stackpacks");return n.append(" ",o," ",h," ",p," "),t.append(" ",n," "),e.append(t),e}function Fe(r){const e=r.createFragment(),t=r.createElement("div","lh-category-header"),n=r.createElement("div","lh-score__gauge");n.setAttribute("role","heading"),n.setAttribute("aria-level","2");const o=r.createElement("div","lh-category-header__description");return t.append(" ",n," ",o," "),e.append(t),e}function Ne(r){const e=r.createFragment(),t=r.createElementNS("http://www.w3.org/2000/svg","svg","lh-chevron");t.setAttribute("viewBox","0 0 100 100");const n=r.createElementNS("http://www.w3.org/2000/svg","g","lh-chevron__lines"),o=r.createElementNS("http://www.w3.org/2000/svg","path","lh-chevron__line lh-chevron__line-left");o.setAttribute("d","M10 50h40");const i=r.createElementNS("http://www.w3.org/2000/svg","path","lh-chevron__line lh-chevron__line-right");return i.setAttribute("d","M90 50H50"),n.append(" ",o," ",i," "),t.append(" ",n," "),e.append(t),e}function De(r){const e=r.createFragment(),t=r.createElement("div","lh-audit-group"),n=r.createElement("details","lh-clump"),o=r.createElement("summary"),i=r.createElement("div","lh-audit-group__summary"),a=r.createElement("div","lh-audit-group__header"),l=r.createElement("span","lh-audit-group__title"),s=r.createElement("span","lh-audit-group__itemcount");a.append(" ",l," ",s," "," "," ");const c=r.createElement("div","lh-clump-toggle"),d=r.createElement("span","lh-clump-toggletext--show"),h=r.createElement("span","lh-clump-toggletext--hide");return c.append(" ",d," ",h," "),i.append(" ",a," ",c," "),o.append(" ",i," "),n.append(" ",o," "),t.append(" "," ",n," "),e.append(t),e}function He(r){const e=r.createFragment(),t=r.createElement("div","lh-crc-container"),n=r.createElement("style");n.append(`
      .lh-crc .lh-tree-marker {
        width: 12px;
        height: 26px;
        display: block;
        float: left;
        background-position: top left;
      }
      .lh-crc .lh-horiz-down {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><g fill="%23D8D8D8" fill-rule="evenodd"><path d="M16 12v2H-2v-2z"/><path d="M9 12v14H7V12z"/></g></svg>');
      }
      .lh-crc .lh-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M16 12v2H0v-2z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-up-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v14H7zm2 12h7v2H9z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-vert-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v27H7zm2 12h7v2H9z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-vert {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v26H7z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-crc-tree {
        font-size: 14px;
        width: 100%;
        overflow-x: auto;
      }
      .lh-crc .lh-crc-node {
        height: 26px;
        line-height: 26px;
        white-space: nowrap;
      }
      .lh-crc .lh-crc-node__tree-value {
        margin-left: 10px;
      }
      .lh-crc .lh-crc-node__tree-value div {
        display: inline;
      }
      .lh-crc .lh-crc-node__chain-duration {
        font-weight: 700;
      }
      .lh-crc .lh-crc-initial-nav {
        color: #595959;
        font-style: italic;
      }
      .lh-crc__summary-value {
        margin-bottom: 10px;
      }
    `);const o=r.createElement("div"),i=r.createElement("div","lh-crc__summary-value"),a=r.createElement("span","lh-crc__longest_duration_label"),l=r.createElement("b","lh-crc__longest_duration");i.append(" ",a," ",l," "),o.append(" ",i," ");const s=r.createElement("div","lh-crc"),c=r.createElement("div","lh-crc-initial-nav");return s.append(" ",c," "," "),t.append(" ",n," ",o," ",s," "),e.append(t),e}function Pe(r){const e=r.createFragment(),t=r.createElement("div","lh-crc-node"),n=r.createElement("span","lh-crc-node__tree-marker"),o=r.createElement("span","lh-crc-node__tree-value");return t.append(" ",n," ",o," "),e.append(t),e}function Re(r){const e=r.createFragment(),t=r.createElement("div","lh-element-screenshot"),n=r.createElement("div","lh-element-screenshot__content"),o=r.createElement("div","lh-element-screenshot__mask"),i=r.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttribute("height","0"),i.setAttribute("width","0");const a=r.createElementNS("http://www.w3.org/2000/svg","defs"),l=r.createElementNS("http://www.w3.org/2000/svg","clipPath");l.setAttribute("clipPathUnits","objectBoundingBox"),a.append(" ",l," "," "),i.append(" ",a," "),o.append(" ",i," ");const s=r.createElement("div","lh-element-screenshot__image"),c=r.createElement("div","lh-element-screenshot__element-marker");return n.append(" ",o," ",s," ",c," "),t.append(" ",n," "),e.append(t),e}function Oe(r){const e=r.createFragment(),t=r.createElement("style");t.append(`
    .lh-footer {
      padding: var(--footer-padding-vertical) calc(var(--default-padding) * 2);
      max-width: var(--report-content-max-width);
      margin: 0 auto;
    }
    .lh-footer .lh-generated {
      text-align: center;
    }
  `),e.append(t);const n=r.createElement("footer","lh-footer"),o=r.createElement("ul","lh-meta__items");o.append(" ");const i=r.createElement("div","lh-generated"),a=r.createElement("b");a.append("Lighthouse");const l=r.createElement("span","lh-footer__version"),s=r.createElement("a","lh-footer__version_issue");return s.setAttribute("href","https://github.com/GoogleChrome/Lighthouse/issues"),s.setAttribute("target","_blank"),s.setAttribute("rel","noopener"),s.append("File an issue"),i.append(" "," Generated by ",a," ",l," | ",s," "),n.append(" ",o," ",i," "),e.append(n),e}function Ie(r){const e=r.createFragment(),t=r.createElement("a","lh-fraction__wrapper"),n=r.createElement("div","lh-fraction__content-wrapper"),o=r.createElement("div","lh-fraction__content"),i=r.createElement("div","lh-fraction__background");o.append(" ",i," "),n.append(" ",o," ");const a=r.createElement("div","lh-fraction__label");return t.append(" ",n," ",a," "),e.append(t),e}function $e(r){const e=r.createFragment(),t=r.createElement("a","lh-gauge__wrapper"),n=r.createElement("div","lh-gauge__svg-wrapper"),o=r.createElementNS("http://www.w3.org/2000/svg","svg","lh-gauge");o.setAttribute("viewBox","0 0 120 120");const i=r.createElementNS("http://www.w3.org/2000/svg","circle","lh-gauge-base");i.setAttribute("r","56"),i.setAttribute("cx","60"),i.setAttribute("cy","60"),i.setAttribute("stroke-width","8");const a=r.createElementNS("http://www.w3.org/2000/svg","circle","lh-gauge-arc");a.setAttribute("r","56"),a.setAttribute("cx","60"),a.setAttribute("cy","60"),a.setAttribute("stroke-width","8"),o.append(" ",i," ",a," "),n.append(" ",o," ");const l=r.createElement("div","lh-gauge__percentage"),s=r.createElement("div","lh-gauge__label");return t.append(" "," ",n," ",l," "," ",s," "),e.append(t),e}function Ue(r){const e=r.createFragment(),t=r.createElement("style");t.append(`
    .lh-gauge--pwa .lh-gauge--pwa__component {
      display: none;
    }
    .lh-gauge--pwa__wrapper:not(.lh-badged--all) .lh-gauge--pwa__logo > path {
      /* Gray logo unless everything is passing. */
      fill: #B0B0B0;
    }

    .lh-gauge--pwa__disc {
      fill: var(--color-gray-200);
    }

    .lh-gauge--pwa__logo--primary-color {
      fill: #304FFE;
    }

    .lh-gauge--pwa__logo--secondary-color {
      fill: #3D3D3D;
    }
    .lh-dark .lh-gauge--pwa__logo--secondary-color {
      fill: #D8B6B6;
    }

    /* No passing groups. */
    .lh-gauge--pwa__wrapper:not([class*='lh-badged--']) .lh-gauge--pwa__na-line {
      display: inline;
    }
    /* Just optimized. Same n/a line as no passing groups. */
    .lh-gauge--pwa__wrapper.lh-badged--pwa-optimized:not(.lh-badged--pwa-installable) .lh-gauge--pwa__na-line {
      display: inline;
    }

    /* Just installable. */
    .lh-gauge--pwa__wrapper.lh-badged--pwa-installable .lh-gauge--pwa__installable-badge {
      display: inline;
    }

    /* All passing groups. */
    .lh-gauge--pwa__wrapper.lh-badged--all .lh-gauge--pwa__check-circle {
      display: inline;
    }
  `),e.append(t);const n=r.createElement("a","lh-gauge__wrapper lh-gauge--pwa__wrapper"),o=r.createElementNS("http://www.w3.org/2000/svg","svg","lh-gauge lh-gauge--pwa");o.setAttribute("viewBox","0 0 60 60");const i=r.createElementNS("http://www.w3.org/2000/svg","defs"),a=r.createElementNS("http://www.w3.org/2000/svg","linearGradient");a.setAttribute("id","lh-gauge--pwa__check-circle__gradient"),a.setAttribute("x1","50%"),a.setAttribute("y1","0%"),a.setAttribute("x2","50%"),a.setAttribute("y2","100%");const l=r.createElementNS("http://www.w3.org/2000/svg","stop");l.setAttribute("stop-color","#00C852"),l.setAttribute("offset","0%");const s=r.createElementNS("http://www.w3.org/2000/svg","stop");s.setAttribute("stop-color","#009688"),s.setAttribute("offset","100%"),a.append(" ",l," ",s," ");const c=r.createElementNS("http://www.w3.org/2000/svg","linearGradient");c.setAttribute("id","lh-gauge--pwa__installable__shadow-gradient"),c.setAttribute("x1","76.056%"),c.setAttribute("x2","24.111%"),c.setAttribute("y1","82.995%"),c.setAttribute("y2","24.735%");const d=r.createElementNS("http://www.w3.org/2000/svg","stop");d.setAttribute("stop-color","#A5D6A7"),d.setAttribute("offset","0%");const h=r.createElementNS("http://www.w3.org/2000/svg","stop");h.setAttribute("stop-color","#80CBC4"),h.setAttribute("offset","100%"),c.append(" ",d," ",h," ");const p=r.createElementNS("http://www.w3.org/2000/svg","g");p.setAttribute("id","lh-gauge--pwa__installable-badge");const m=r.createElementNS("http://www.w3.org/2000/svg","circle");m.setAttribute("fill","#FFFFFF"),m.setAttribute("cx","10"),m.setAttribute("cy","10"),m.setAttribute("r","10");const f=r.createElementNS("http://www.w3.org/2000/svg","path");f.setAttribute("fill","#009688"),f.setAttribute("d","M10 4.167A5.835 5.835 0 0 0 4.167 10 5.835 5.835 0 0 0 10 15.833 5.835 5.835 0 0 0 15.833 10 5.835 5.835 0 0 0 10 4.167zm2.917 6.416h-2.334v2.334H9.417v-2.334H7.083V9.417h2.334V7.083h1.166v2.334h2.334v1.166z"),p.append(" ",m," ",f," "),i.append(" ",a," ",c," ",p," ");const b=r.createElementNS("http://www.w3.org/2000/svg","g");b.setAttribute("stroke","none"),b.setAttribute("fill-rule","nonzero");const v=r.createElementNS("http://www.w3.org/2000/svg","circle","lh-gauge--pwa__disc");v.setAttribute("cx","30"),v.setAttribute("cy","30"),v.setAttribute("r","30");const g=r.createElementNS("http://www.w3.org/2000/svg","g","lh-gauge--pwa__logo"),_=r.createElementNS("http://www.w3.org/2000/svg","path","lh-gauge--pwa__logo--secondary-color");_.setAttribute("d","M35.66 19.39l.7-1.75h2L37.4 15 38.6 12l3.4 9h-2.51l-.58-1.61z");const w=r.createElementNS("http://www.w3.org/2000/svg","path","lh-gauge--pwa__logo--primary-color");w.setAttribute("d","M33.52 21l3.65-9h-2.42l-2.5 5.82L30.5 12h-1.86l-1.9 5.82-1.35-2.65-1.21 3.72L25.4 21h2.38l1.72-5.2 1.64 5.2z");const C=r.createElementNS("http://www.w3.org/2000/svg","path","lh-gauge--pwa__logo--secondary-color");C.setAttribute("fill-rule","nonzero"),C.setAttribute("d","M20.3 17.91h1.48c.45 0 .85-.05 1.2-.15l.39-1.18 1.07-3.3a2.64 2.64 0 0 0-.28-.37c-.55-.6-1.36-.91-2.42-.91H18v9h2.3V17.9zm1.96-3.84c.22.22.33.5.33.87 0 .36-.1.65-.29.87-.2.23-.59.35-1.15.35h-.86v-2.41h.87c.52 0 .89.1 1.1.32z"),g.append(" ",_," ",w," ",C," ");const y=r.createElementNS("http://www.w3.org/2000/svg","rect","lh-gauge--pwa__component lh-gauge--pwa__na-line");y.setAttribute("fill","#FFFFFF"),y.setAttribute("x","20"),y.setAttribute("y","32"),y.setAttribute("width","20"),y.setAttribute("height","4"),y.setAttribute("rx","2");const k=r.createElementNS("http://www.w3.org/2000/svg","g","lh-gauge--pwa__component lh-gauge--pwa__installable-badge");k.setAttribute("transform","translate(20, 29)");const A=r.createElementNS("http://www.w3.org/2000/svg","path");A.setAttribute("fill","url(#lh-gauge--pwa__installable__shadow-gradient)"),A.setAttribute("d","M33.629 19.487c-4.272 5.453-10.391 9.39-17.415 10.869L3 17.142 17.142 3 33.63 19.487z");const S=r.createElementNS("http://www.w3.org/2000/svg","use");S.setAttribute("href","#lh-gauge--pwa__installable-badge"),k.append(" ",A," ",S," ");const E=r.createElementNS("http://www.w3.org/2000/svg","g","lh-gauge--pwa__component lh-gauge--pwa__check-circle");E.setAttribute("transform","translate(18, 28)");const z=r.createElementNS("http://www.w3.org/2000/svg","circle");z.setAttribute("fill","#FFFFFF"),z.setAttribute("cx","12"),z.setAttribute("cy","12"),z.setAttribute("r","12");const T=r.createElementNS("http://www.w3.org/2000/svg","path");T.setAttribute("fill","url(#lh-gauge--pwa__check-circle__gradient)"),T.setAttribute("d","M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"),E.append(" ",z," ",T," "),b.append(" "," ",v," ",g," "," ",y," "," ",k," "," ",E," "),o.append(" ",i," ",b," ");const I=r.createElement("div","lh-gauge__label");return n.append(" ",o," ",I," "),e.append(n),e}function Be(r){const e=r.createFragment(),t=r.createElement("style");t.append(`
    /* CSS Fireworks. Originally by Eddie Lin
       https://codepen.io/paulirish/pen/yEVMbP
    */
    .lh-pyro {
      display: none;
      z-index: 1;
      pointer-events: none;
    }
    .lh-score100 .lh-pyro {
      display: block;
    }
    .lh-score100 .lh-lighthouse stop:first-child {
      stop-color: hsla(200, 12%, 95%, 0);
    }
    .lh-score100 .lh-lighthouse stop:last-child {
      stop-color: hsla(65, 81%, 76%, 1);
    }

    .lh-pyro > .lh-pyro-before, .lh-pyro > .lh-pyro-after {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 2.5px;
      box-shadow: 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff;
      animation: 1s bang ease-out infinite backwards,  1s gravity ease-in infinite backwards,  5s position linear infinite backwards;
      animation-delay: 1s, 1s, 1s;
    }

    .lh-pyro > .lh-pyro-after {
      animation-delay: 2.25s, 2.25s, 2.25s;
      animation-duration: 1.25s, 1.25s, 6.25s;
    }
    .lh-fireworks-paused .lh-pyro > div {
      animation-play-state: paused;
    }

    @keyframes bang {
      to {
        box-shadow: -70px -115.67px #47ebbc, -28px -99.67px #eb47a4, 58px -31.67px #7eeb47, 13px -141.67px #eb47c5, -19px 6.33px #7347eb, -2px -74.67px #ebd247, 24px -151.67px #eb47e0, 57px -138.67px #b4eb47, -51px -104.67px #479eeb, 62px 8.33px #ebcf47, -93px 0.33px #d547eb, -16px -118.67px #47bfeb, 53px -84.67px #47eb83, 66px -57.67px #eb47bf, -93px -65.67px #91eb47, 30px -13.67px #86eb47, -2px -59.67px #83eb47, -44px 1.33px #eb47eb, 61px -58.67px #47eb73, 5px -22.67px #47e8eb, -66px -28.67px #ebe247, 42px -123.67px #eb5547, -75px 26.33px #7beb47, 15px -52.67px #a147eb, 36px -51.67px #eb8347, -38px -12.67px #eb5547, -46px -59.67px #47eb81, 78px -114.67px #eb47ba, 15px -156.67px #eb47bf, -36px 1.33px #eb4783, -72px -86.67px #eba147, 31px -46.67px #ebe247, -68px 29.33px #47e2eb, -55px 19.33px #ebe047, -56px 27.33px #4776eb, -13px -91.67px #eb5547, -47px -138.67px #47ebc7, -18px -96.67px #eb47ac, 11px -88.67px #4783eb, -67px -28.67px #47baeb, 53px 10.33px #ba47eb, 11px 19.33px #5247eb, -5px -11.67px #eb4791, -68px -4.67px #47eba7, 95px -37.67px #eb478b, -67px -162.67px #eb5d47, -54px -120.67px #eb6847, 49px -12.67px #ebe047, 88px 8.33px #47ebda, 97px 33.33px #eb8147, 6px -71.67px #ebbc47;
      }
    }
    @keyframes gravity {
      to {
        transform: translateY(80px);
        opacity: 0;
      }
    }
    @keyframes position {
      0%, 19.9% {
        margin-top: 4%;
        margin-left: 47%;
      }
      20%, 39.9% {
        margin-top: 7%;
        margin-left: 30%;
      }
      40%, 59.9% {
        margin-top: 6%;
        margin-left: 70%;
      }
      60%, 79.9% {
        margin-top: 3%;
        margin-left: 20%;
      }
      80%, 99.9% {
        margin-top: 3%;
        margin-left: 80%;
      }
    }
  `),e.append(t);const n=r.createElement("div","lh-header-container"),o=r.createElement("div","lh-scores-wrapper-placeholder");return n.append(" ",o," "),e.append(n),e}function Ve(r){const e=r.createFragment(),t=r.createElement("div","lh-metric"),n=r.createElement("div","lh-metric__innerwrap"),o=r.createElement("div","lh-metric__icon"),i=r.createElement("span","lh-metric__title"),a=r.createElement("div","lh-metric__value"),l=r.createElement("div","lh-metric__description");return n.append(" ",o," ",i," ",a," ",l," "),t.append(" ",n," "),e.append(t),e}function Ge(r){const e=r.createFragment(),t=r.createElement("div","lh-audit lh-audit--load-opportunity"),n=r.createElement("details","lh-expandable-details"),o=r.createElement("summary"),i=r.createElement("div","lh-audit__header"),a=r.createElement("div","lh-load-opportunity__cols"),l=r.createElement("div","lh-load-opportunity__col lh-load-opportunity__col--one"),s=r.createElement("span","lh-audit__score-icon"),c=r.createElement("div","lh-audit__title");l.append(" ",s," ",c," ");const d=r.createElement("div","lh-load-opportunity__col lh-load-opportunity__col--two"),h=r.createElement("div","lh-load-opportunity__sparkline"),p=r.createElement("div","lh-sparkline"),m=r.createElement("div","lh-sparkline__bar");p.append(m),h.append(" ",p," ");const f=r.createElement("div","lh-audit__display-text"),b=r.createElement("div","lh-chevron-container");d.append(" ",h," ",f," ",b," "),a.append(" ",l," ",d," "),i.append(" ",a," "),o.append(" ",i," ");const v=r.createElement("div","lh-audit__description"),g=r.createElement("div","lh-audit__stackpacks");return n.append(" ",o," ",v," ",g," "),t.append(" ",n," "),e.append(t),e}function We(r){const e=r.createFragment(),t=r.createElement("div","lh-load-opportunity__header lh-load-opportunity__cols"),n=r.createElement("div","lh-load-opportunity__col lh-load-opportunity__col--one"),o=r.createElement("div","lh-load-opportunity__col lh-load-opportunity__col--two");return t.append(" ",n," ",o," "),e.append(t),e}function je(r){const e=r.createFragment(),t=r.createElement("div","lh-scorescale"),n=r.createElement("span","lh-scorescale-range lh-scorescale-range--fail");n.append("0\u201349");const o=r.createElement("span","lh-scorescale-range lh-scorescale-range--average");o.append("50\u201389");const i=r.createElement("span","lh-scorescale-range lh-scorescale-range--pass");return i.append("90\u2013100"),t.append(" ",n," ",o," ",i," "),e.append(t),e}function qe(r){const e=r.createFragment(),t=r.createElement("style");t.append(`
    .lh-scores-container {
      display: flex;
      flex-direction: column;
      padding: var(--default-padding) 0;
      position: relative;
      width: 100%;
    }

    .lh-sticky-header {
      --gauge-circle-size: var(--gauge-circle-size-sm);
      --plugin-badge-size: 16px;
      --plugin-icon-size: 75%;
      --gauge-wrapper-width: 60px;
      --gauge-percentage-font-size: 13px;
      position: fixed;
      left: 0;
      right: 0;
      top: var(--topbar-height);
      font-weight: 500;
      display: none;
      justify-content: center;
      background-color: var(--sticky-header-background-color);
      border-bottom: 1px solid var(--color-gray-200);
      padding-top: var(--score-container-padding);
      padding-bottom: 4px;
      z-index: 1;
      pointer-events: none;
    }

    .lh-devtools .lh-sticky-header {
      /* The report within DevTools is placed in a container with overflow, which changes the placement of this header unless we change \`position\` to \`sticky.\` */
      position: sticky;
    }

    .lh-sticky-header--visible {
      display: grid;
      grid-auto-flow: column;
      pointer-events: auto;
    }

    /* Disable the gauge arc animation for the sticky header, so toggling display: none
       does not play the animation. */
    .lh-sticky-header .lh-gauge-arc {
      animation: none;
    }

    .lh-sticky-header .lh-gauge__label {
      display: none;
    }

    .lh-highlighter {
      width: var(--gauge-wrapper-width);
      height: 1px;
      background-color: var(--highlighter-background-color);
      /* Position at bottom of first gauge in sticky header. */
      position: absolute;
      grid-column: 1;
      bottom: -1px;
    }

    .lh-gauge__wrapper:first-of-type {
      contain: none;
    }
  `),e.append(t);const n=r.createElement("div","lh-scores-wrapper"),o=r.createElement("div","lh-scores-container"),i=r.createElement("div","lh-pyro"),a=r.createElement("div","lh-before"),l=r.createElement("div","lh-after");return i.append(" ",a," ",l," "),o.append(" ",i," "),n.append(" ",o," "),e.append(n),e}function Ke(r){const e=r.createFragment(),t=r.createElement("div","lh-snippet"),n=r.createElement("style");return n.append(`
          :root {
            --snippet-highlight-light: #fbf1f2;
            --snippet-highlight-dark: #ffd6d8;
          }

         .lh-snippet__header {
          position: relative;
          overflow: hidden;
          padding: 10px;
          border-bottom: none;
          color: var(--snippet-color);
          background-color: var(--snippet-background-color);
          border: 1px solid var(--report-border-color-secondary);
        }
        .lh-snippet__title {
          font-weight: bold;
          float: left;
        }
        .lh-snippet__node {
          float: left;
          margin-left: 4px;
        }
        .lh-snippet__toggle-expand {
          padding: 1px 7px;
          margin-top: -1px;
          margin-right: -7px;
          float: right;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #0c50c7;
        }

        .lh-snippet__snippet {
          overflow: auto;
          border: 1px solid var(--report-border-color-secondary);
        }
        /* Container needed so that all children grow to the width of the scroll container */
        .lh-snippet__snippet-inner {
          display: inline-block;
          min-width: 100%;
        }

        .lh-snippet:not(.lh-snippet--expanded) .lh-snippet__show-if-expanded {
          display: none;
        }
        .lh-snippet.lh-snippet--expanded .lh-snippet__show-if-collapsed {
          display: none;
        }

        .lh-snippet__line {
          background: white;
          white-space: pre;
          display: flex;
        }
        .lh-snippet__line:not(.lh-snippet__line--message):first-child {
          padding-top: 4px;
        }
        .lh-snippet__line:not(.lh-snippet__line--message):last-child {
          padding-bottom: 4px;
        }
        .lh-snippet__line--content-highlighted {
          background: var(--snippet-highlight-dark);
        }
        .lh-snippet__line--message {
          background: var(--snippet-highlight-light);
        }
        .lh-snippet__line--message .lh-snippet__line-number {
          padding-top: 10px;
          padding-bottom: 10px;
        }
        .lh-snippet__line--message code {
          padding: 10px;
          padding-left: 5px;
          color: var(--color-fail);
          font-family: var(--report-font-family);
        }
        .lh-snippet__line--message code {
          white-space: normal;
        }
        .lh-snippet__line-icon {
          padding-top: 10px;
          display: none;
        }
        .lh-snippet__line--message .lh-snippet__line-icon {
          display: block;
        }
        .lh-snippet__line-icon:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          margin-right: 4px;
          width: var(--score-icon-size);
          height: var(--score-icon-size);
          background-image: var(--fail-icon-url);
        }
        .lh-snippet__line-number {
          flex-shrink: 0;
          width: 40px;
          text-align: right;
          font-family: monospace;
          padding-right: 5px;
          margin-right: 5px;
          color: var(--color-gray-600);
          user-select: none;
        }
    `),t.append(" ",n," "),e.append(t),e}function Je(r){const e=r.createFragment(),t=r.createElement("div","lh-snippet__snippet"),n=r.createElement("div","lh-snippet__snippet-inner");return t.append(" ",n," "),e.append(t),e}function Ye(r){const e=r.createFragment(),t=r.createElement("div","lh-snippet__header"),n=r.createElement("div","lh-snippet__title"),o=r.createElement("div","lh-snippet__node"),i=r.createElement("button","lh-snippet__toggle-expand"),a=r.createElement("span","lh-snippet__btn-label-collapse lh-snippet__show-if-expanded"),l=r.createElement("span","lh-snippet__btn-label-expand lh-snippet__show-if-collapsed");return i.append(" ",a," ",l," "),t.append(" ",n," ",o," ",i," "),e.append(t),e}function Qe(r){const e=r.createFragment(),t=r.createElement("div","lh-snippet__line"),n=r.createElement("div","lh-snippet__line-number"),o=r.createElement("div","lh-snippet__line-icon"),i=r.createElement("code");return t.append(" ",n," ",o," ",i," "),e.append(t),e}function Xe(r){const e=r.createFragment(),t=r.createElement("style");return t.append(`/**
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

/*
  Naming convention:

  If a variable is used for a specific component: --{component}-{property name}-{modifier}

  Both {component} and {property name} should be kebab-case. If the target is the entire page,
  use 'report' for the component. The property name should not be abbreviated. Use the
  property name the variable is intended for - if it's used for multiple, a common descriptor
  is fine (ex: 'size' for a variable applied to 'width' and 'height'). If a variable is shared
  across multiple components, either create more variables or just drop the "{component}-"
  part of the name. Append any modifiers at the end (ex: 'big', 'dark').

  For colors: --color-{hue}-{intensity}

  {intensity} is the Material Design tag - 700, A700, etc.
*/
.lh-vars {
  /* Palette using Material Design Colors
   * https://www.materialui.co/colors */
  --color-amber-50: #FFF8E1;
  --color-blue-200: #90CAF9;
  --color-blue-900: #0D47A1;
  --color-blue-A700: #2962FF;
  --color-blue-primary: #06f;
  --color-cyan-500: #00BCD4;
  --color-gray-100: #F5F5F5;
  --color-gray-300: #CFCFCF;
  --color-gray-200: #E0E0E0;
  --color-gray-400: #BDBDBD;
  --color-gray-50: #FAFAFA;
  --color-gray-500: #9E9E9E;
  --color-gray-600: #757575;
  --color-gray-700: #616161;
  --color-gray-800: #424242;
  --color-gray-900: #212121;
  --color-gray: #000000;
  --color-green-700: #080;
  --color-green: #0c6;
  --color-lime-400: #D3E156;
  --color-orange-50: #FFF3E0;
  --color-orange-700: #C33300;
  --color-orange: #fa3;
  --color-red-700: #c00;
  --color-red: #f33;
  --color-teal-600: #00897B;
  --color-white: #FFFFFF;

  /* Context-specific colors */
  --color-average-secondary: var(--color-orange-700);
  --color-average: var(--color-orange);
  --color-fail-secondary: var(--color-red-700);
  --color-fail: var(--color-red);
  --color-hover: var(--color-gray-50);
  --color-informative: var(--color-blue-900);
  --color-pass-secondary: var(--color-green-700);
  --color-pass: var(--color-green);
  --color-not-applicable: var(--color-gray-600);

  /* Component variables */
  --audit-description-padding-left: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right));
  --audit-explanation-line-height: 16px;
  --audit-group-margin-bottom: calc(var(--default-padding) * 6);
  --audit-group-padding-vertical: 8px;
  --audit-margin-horizontal: 5px;
  --audit-padding-vertical: 8px;
  --category-padding: calc(var(--default-padding) * 6) var(--edge-gap-padding) calc(var(--default-padding) * 4);
  --chevron-line-stroke: var(--color-gray-600);
  --chevron-size: 12px;
  --default-padding: 8px;
  --edge-gap-padding: calc(var(--default-padding) * 4);
  --env-item-background-color: var(--color-gray-100);
  --env-item-font-size: 28px;
  --env-item-line-height: 36px;
  --env-item-padding: 10px 0px;
  --env-name-min-width: 220px;
  --footer-padding-vertical: 16px;
  --gauge-circle-size-big: 96px;
  --gauge-circle-size: 48px;
  --gauge-circle-size-sm: 32px;
  --gauge-label-font-size-big: 18px;
  --gauge-label-font-size: var(--report-font-size-secondary);
  --gauge-label-line-height-big: 24px;
  --gauge-label-line-height: var(--report-line-height-secondary);
  --gauge-percentage-font-size-big: 38px;
  --gauge-percentage-font-size: var(--report-font-size-secondary);
  --gauge-wrapper-width: 120px;
  --header-line-height: 24px;
  --highlighter-background-color: var(--report-text-color);
  --icon-square-size: calc(var(--score-icon-size) * 0.88);
  --image-preview-size: 48px;
  --link-color: var(--color-blue-primary);
  --locale-selector-background-color: var(--color-white);
  --metric-toggle-lines-fill: #7F7F7F;
  --metric-value-font-size: calc(var(--report-font-size) * 1.8);
  --metrics-toggle-background-color: var(--color-gray-200);
  --plugin-badge-background-color: var(--color-white);
  --plugin-badge-size-big: calc(var(--gauge-circle-size-big) / 2.7);
  --plugin-badge-size: calc(var(--gauge-circle-size) / 2.7);
  --plugin-icon-size: 65%;
  --pwa-icon-margin: 0 var(--default-padding);
  --pwa-icon-size: var(--topbar-logo-size);
  --report-background-color: #fff;
  --report-border-color-secondary: #ebebeb;
  --report-font-family-monospace: 'Roboto Mono', 'Menlo', 'dejavu sans mono', 'Consolas', 'Lucida Console', monospace;
  --report-font-family: Roboto, Helvetica, Arial, sans-serif;
  --report-font-size: 14px;
  --report-font-size-secondary: 12px;
  --report-icon-size: var(--score-icon-background-size);
  --report-line-height: 24px;
  --report-line-height-secondary: 20px;
  --report-monospace-font-size: calc(var(--report-font-size) * 0.85);
  --report-text-color-secondary: var(--color-gray-800);
  --report-text-color: var(--color-gray-900);
  --report-content-max-width: calc(60 * var(--report-font-size)); /* defaults to 840px */
  --report-content-min-width: 360px;
  --report-content-max-width-minus-edge-gap: calc(var(--report-content-max-width) - var(--edge-gap-padding) * 2);
  --score-container-padding: 8px;
  --score-icon-background-size: 24px;
  --score-icon-margin-left: 6px;
  --score-icon-margin-right: 14px;
  --score-icon-margin: 0 var(--score-icon-margin-right) 0 var(--score-icon-margin-left);
  --score-icon-size: 12px;
  --score-icon-size-big: 16px;
  --screenshot-overlay-background: rgba(0, 0, 0, 0.3);
  --section-padding-vertical: calc(var(--default-padding) * 6);
  --snippet-background-color: var(--color-gray-50);
  --snippet-color: #0938C2;
  --sparkline-height: 5px;
  --stackpack-padding-horizontal: 10px;
  --sticky-header-background-color: var(--report-background-color);
  --table-higlight-background-color: hsla(210, 17%, 77%, 0.1);
  --tools-icon-color: var(--color-gray-600);
  --topbar-background-color: var(--color-white);
  --topbar-height: 32px;
  --topbar-logo-size: 24px;
  --topbar-padding: 0 8px;
  --toplevel-warning-background-color: hsla(30, 100%, 75%, 10%);
  --toplevel-warning-message-text-color: var(--color-average-secondary);
  --toplevel-warning-padding: 18px;
  --toplevel-warning-text-color: var(--report-text-color);

  /* SVGs */
  --plugin-icon-url-dark: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="%23FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg>');
  --plugin-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="%23757575"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg>');

  --pass-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>check</title><path fill="%23178239" d="M24 4C12.95 4 4 12.95 4 24c0 11.04 8.95 20 20 20 11.04 0 20-8.96 20-20 0-11.05-8.96-20-20-20zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z"/></svg>');
  --average-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>info</title><path fill="%23E67700" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 30h-4V22h4v12zm0-16h-4v-4h4v4z"/></svg>');
  --fail-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>warn</title><path fill="%23C7221F" d="M2 42h44L24 4 2 42zm24-6h-4v-4h4v4zm0-8h-4v-8h4v8z"/></svg>');

  --pwa-installable-gray-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="nonzero"><circle fill="%23DAE0E3" cx="12" cy="12" r="12"/><path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.5 7.7h-2.8v2.8h-1.4v-2.8H8.5v-1.4h2.8V8.5h1.4v2.8h2.8v1.4z" fill="%23FFF"/></g></svg>');
  --pwa-optimized-gray-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><rect fill="%23DAE0E3" width="24" height="24" rx="12"/><path fill="%23FFF" d="M12 15.07l3.6 2.18-.95-4.1 3.18-2.76-4.2-.36L12 6.17l-1.64 3.86-4.2.36 3.2 2.76-.96 4.1z"/><path d="M5 5h14v14H5z"/></g></svg>');

  --pwa-installable-gray-url-dark: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="nonzero"><circle fill="%23424242" cx="12" cy="12" r="12"/><path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.5 7.7h-2.8v2.8h-1.4v-2.8H8.5v-1.4h2.8V8.5h1.4v2.8h2.8v1.4z" fill="%23FFF"/></g></svg>');
  --pwa-optimized-gray-url-dark: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><rect fill="%23424242" width="24" height="24" rx="12"/><path fill="%23FFF" d="M12 15.07l3.6 2.18-.95-4.1 3.18-2.76-4.2-.36L12 6.17l-1.64 3.86-4.2.36 3.2 2.76-.96 4.1z"/><path d="M5 5h14v14H5z"/></g></svg>');

  --pwa-installable-color-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill-rule="nonzero" fill="none"><circle fill="%230CCE6B" cx="12" cy="12" r="12"/><path d="M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm3.5 7.7h-2.8v2.8h-1.4v-2.8H8.5v-1.4h2.8V8.5h1.4v2.8h2.8v1.4z" fill="%23FFF"/></g></svg>');
  --pwa-optimized-color-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><rect fill="%230CCE6B" width="24" height="24" rx="12"/><path d="M5 5h14v14H5z"/><path fill="%23FFF" d="M12 15.07l3.6 2.18-.95-4.1 3.18-2.76-4.2-.36L12 6.17l-1.64 3.86-4.2.36 3.2 2.76-.96 4.1z"/></g></svg>');

  --swap-locale-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>');
}

@media not print {
  .lh-dark {
    /* Pallete */
    --color-gray-200: var(--color-gray-800);
    --color-gray-300: #616161;
    --color-gray-400: var(--color-gray-600);
    --color-gray-700: var(--color-gray-400);
    --color-gray-50: #757575;
    --color-gray-600: var(--color-gray-500);
    --color-green-700: var(--color-green);
    --color-orange-700: var(--color-orange);
    --color-red-700: var(--color-red);
    --color-teal-600: var(--color-cyan-500);

    /* Context-specific colors */
    --color-hover: rgba(0, 0, 0, 0.2);
    --color-informative: var(--color-blue-200);

    /* Component variables */
    --env-item-background-color: #393535;
    --link-color: var(--color-blue-200);
    --locale-selector-background-color: var(--color-gray-200);
    --plugin-badge-background-color: var(--color-gray-800);
    --report-background-color: var(--color-gray-900);
    --report-border-color-secondary: var(--color-gray-200);
    --report-text-color-secondary: var(--color-gray-400);
    --report-text-color: var(--color-gray-100);
    --snippet-color: var(--color-cyan-500);
    --topbar-background-color: var(--color-gray);
    --toplevel-warning-background-color: hsl(33deg 14% 18%);
    --toplevel-warning-message-text-color: var(--color-orange-700);
    --toplevel-warning-text-color: var(--color-gray-100);

    /* SVGs */
    --plugin-icon-url: var(--plugin-icon-url-dark);
    --pwa-installable-gray-url: var(--pwa-installable-gray-url-dark);
    --pwa-optimized-gray-url: var(--pwa-optimized-gray-url-dark);
  }
}

@media only screen and (max-width: 480px) {
  .lh-vars {
    --audit-group-margin-bottom: 20px;
    --edge-gap-padding: var(--default-padding);
    --env-name-min-width: 120px;
    --gauge-circle-size-big: 96px;
    --gauge-circle-size: 72px;
    --gauge-label-font-size-big: 22px;
    --gauge-label-font-size: 14px;
    --gauge-label-line-height-big: 26px;
    --gauge-label-line-height: 20px;
    --gauge-percentage-font-size-big: 34px;
    --gauge-percentage-font-size: 26px;
    --gauge-wrapper-width: 112px;
    --header-padding: 16px 0 16px 0;
    --image-preview-size: 24px;
    --plugin-icon-size: 75%;
    --pwa-icon-margin: 0 7px 0 -3px;
    --report-font-size: 14px;
    --report-line-height: 20px;
    --score-icon-margin-left: 2px;
    --score-icon-size: 10px;
    --topbar-height: 28px;
    --topbar-logo-size: 20px;
  }

  /* Not enough space to adequately show the relative savings bars. */
  .lh-sparkline {
    display: none;
  }
}

.lh-vars.lh-devtools {
  --audit-explanation-line-height: 14px;
  --audit-group-margin-bottom: 20px;
  --audit-group-padding-vertical: 12px;
  --audit-padding-vertical: 4px;
  --category-padding: 12px;
  --default-padding: 12px;
  --env-name-min-width: 120px;
  --footer-padding-vertical: 8px;
  --gauge-circle-size-big: 72px;
  --gauge-circle-size: 64px;
  --gauge-label-font-size-big: 22px;
  --gauge-label-font-size: 14px;
  --gauge-label-line-height-big: 26px;
  --gauge-label-line-height: 20px;
  --gauge-percentage-font-size-big: 34px;
  --gauge-percentage-font-size: 26px;
  --gauge-wrapper-width: 97px;
  --header-line-height: 20px;
  --header-padding: 16px 0 16px 0;
  --screenshot-overlay-background: transparent;
  --plugin-icon-size: 75%;
  --pwa-icon-margin: 0 7px 0 -3px;
  --report-font-family-monospace: 'Menlo', 'dejavu sans mono', 'Consolas', 'Lucida Console', monospace;
  --report-font-family: '.SFNSDisplay-Regular', 'Helvetica Neue', 'Lucida Grande', sans-serif;
  --report-font-size: 12px;
  --report-line-height: 20px;
  --score-icon-margin-left: 2px;
  --score-icon-size: 10px;
  --section-padding-vertical: 8px;
}

.lh-devtools.lh-root {
  height: 100%;
}
.lh-devtools.lh-root img {
  /* Override devtools default 'min-width: 0' so svg without size in a flexbox isn't collapsed. */
  min-width: auto;
}
.lh-devtools .lh-container {
  overflow-y: scroll;
  height: calc(100% - var(--topbar-height));
}
@media print {
  .lh-devtools .lh-container {
    overflow: unset;
  }
}
.lh-devtools .lh-sticky-header {
  /* This is normally the height of the topbar, but we want it to stick to the top of our scroll container .lh-container\` */
  top: 0;
}

@keyframes fadeIn {
  0% { opacity: 0;}
  100% { opacity: 0.6;}
}

.lh-root *, .lh-root *::before, .lh-root *::after {
  box-sizing: border-box;
}

.lh-root {
  font-family: var(--report-font-family);
  font-size: var(--report-font-size);
  margin: 0;
  line-height: var(--report-line-height);
  background: var(--report-background-color);
  color: var(--report-text-color);
}

.lh-root :focus {
    outline: -webkit-focus-ring-color auto 3px;
}
.lh-root summary:focus {
    outline: none;
    box-shadow: 0 0 0 1px hsl(217, 89%, 61%);
}

.lh-root [hidden] {
  display: none !important;
}

.lh-root pre {
  margin: 0;
}

.lh-root details > summary {
  cursor: pointer;
}

.lh-hidden {
  display: none !important;
}

.lh-container {
  /*
  Text wrapping in the report is so much FUN!
  We have a \`word-break: break-word;\` globally here to prevent a few common scenarios, namely
  long non-breakable text (usually URLs) found in:
    1. The footer
    2. .lh-node (outerHTML)
    3. .lh-code

  With that sorted, the next challenge is appropriate column sizing and text wrapping inside our
  .lh-details tables. Even more fun.
    * We don't want table headers ("Potential Savings (ms)") to wrap or their column values, but
    we'd be happy for the URL column to wrap if the URLs are particularly long.
    * We want the narrow columns to remain narrow, providing the most column width for URL
    * We don't want the table to extend past 100% width.
    * Long URLs in the URL column can wrap. Util.getURLDisplayName maxes them out at 64 characters,
      but they do not get any overflow:ellipsis treatment.
  */
  word-break: break-word;
}

.lh-audit-group a,
.lh-category-header__description a,
.lh-audit__description a,
.lh-warnings a,
.lh-footer a,
.lh-table-column--link a {
  color: var(--link-color);
}

.lh-audit__description, .lh-audit__stackpack {
  --inner-audit-padding-right: var(--stackpack-padding-horizontal);
  padding-left: var(--audit-description-padding-left);
  padding-right: var(--inner-audit-padding-right);
  padding-top: 8px;
  padding-bottom: 8px;
}

.lh-details {
  margin-top: var(--default-padding);
  margin-bottom: var(--default-padding);
  margin-left: var(--audit-description-padding-left);
  /* whatever the .lh-details side margins are */
  width: 100%;
}

.lh-audit__stackpack {
  display: flex;
  align-items: center;
}

.lh-audit__stackpack__img {
  max-width: 30px;
  margin-right: var(--default-padding)
}

/* Report header */

.lh-report-icon {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
}
.lh-report-icon[disabled] {
  opacity: 0.3;
  pointer-events: none;
}

.lh-report-icon::before {
  content: "";
  margin: 4px;
  background-repeat: no-repeat;
  width: var(--report-icon-size);
  height: var(--report-icon-size);
  opacity: 0.7;
  display: inline-block;
  vertical-align: middle;
}
.lh-report-icon:hover::before {
  opacity: 1;
}
.lh-dark .lh-report-icon::before {
  filter: invert(1);
}
.lh-report-icon--print::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/><path fill="none" d="M0 0h24v24H0z"/></svg>');
}
.lh-report-icon--copy::before {
  background-image: url('data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>');
}
.lh-report-icon--open::before {
  background-image: url('data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z"/></svg>');
}
.lh-report-icon--download::before {
  background-image: url('data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
}
.lh-report-icon--dark::before {
  background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 100 125"><path d="M50 23.587c-16.27 0-22.799 12.574-22.799 21.417 0 12.917 10.117 22.451 12.436 32.471h20.726c2.32-10.02 12.436-19.554 12.436-32.471 0-8.843-6.528-21.417-22.799-21.417zM39.637 87.161c0 3.001 1.18 4.181 4.181 4.181h.426l.41 1.231C45.278 94.449 46.042 95 48.019 95h3.963c1.978 0 2.74-.551 3.365-2.427l.409-1.231h.427c3.002 0 4.18-1.18 4.18-4.181V80.91H39.637v6.251zM50 18.265c1.26 0 2.072-.814 2.072-2.073v-9.12C52.072 5.813 51.26 5 50 5c-1.259 0-2.072.813-2.072 2.073v9.12c0 1.259.813 2.072 2.072 2.072zM68.313 23.727c.994.774 2.135.634 2.91-.357l5.614-7.187c.776-.992.636-2.135-.356-2.909-.992-.776-2.135-.636-2.91.357l-5.613 7.186c-.778.993-.636 2.135.355 2.91zM91.157 36.373c-.306-1.222-1.291-1.815-2.513-1.51l-8.85 2.207c-1.222.305-1.814 1.29-1.51 2.512.305 1.223 1.291 1.814 2.513 1.51l8.849-2.206c1.223-.305 1.816-1.291 1.511-2.513zM86.757 60.48l-8.331-3.709c-1.15-.512-2.225-.099-2.736 1.052-.512 1.151-.1 2.224 1.051 2.737l8.33 3.707c1.15.514 2.225.101 2.736-1.05.513-1.149.1-2.223-1.05-2.737zM28.779 23.37c.775.992 1.917 1.131 2.909.357.992-.776 1.132-1.917.357-2.91l-5.615-7.186c-.775-.992-1.917-1.132-2.909-.357s-1.131 1.917-.356 2.909l5.614 7.187zM21.715 39.583c.305-1.223-.288-2.208-1.51-2.513l-8.849-2.207c-1.222-.303-2.208.289-2.513 1.511-.303 1.222.288 2.207 1.511 2.512l8.848 2.206c1.222.304 2.208-.287 2.513-1.509zM21.575 56.771l-8.331 3.711c-1.151.511-1.563 1.586-1.05 2.735.511 1.151 1.586 1.563 2.736 1.052l8.331-3.711c1.151-.511 1.563-1.586 1.05-2.735-.512-1.15-1.585-1.562-2.736-1.052z"/></svg>');
}
.lh-report-icon--treemap::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="black"><path d="M3 5v14h19V5H3zm2 2h15v4H5V7zm0 10v-4h4v4H5zm6 0v-4h9v4h-9z"/></svg>');
}
.lh-report-icon--date::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 11h2v2H7v-2zm14-5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6c0-1.1.9-2 2-2h1V2h2v2h8V2h2v2h1a2 2 0 012 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z"/></svg>');
}
.lh-report-icon--devices::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 6h18V4H4a2 2 0 00-2 2v11H0v3h14v-3H4V6zm19 2h-6a1 1 0 00-1 1v10c0 .6.5 1 1 1h6c.6 0 1-.5 1-1V9c0-.6-.5-1-1-1zm-1 9h-4v-7h4v7z"/></svg>');
}
.lh-report-icon--world::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7 6h-3c-.3-1.3-.8-2.5-1.4-3.6A8 8 0 0 1 18.9 8zm-7-4a14 14 0 0 1 2 4h-4a14 14 0 0 1 2-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.3a16.5 16.5 0 0 0 0 4H4.3zm.8 2h3a14 14 0 0 0 1.3 3.6A8 8 0 0 1 5.1 16zm3-8H5a8 8 0 0 1 4.3-3.6L8 8zM12 20a14 14 0 0 1-2-4h4a14 14 0 0 1-2 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.6 14.6 0 0 1 0 4zm.3 5.6c.6-1.2 1-2.4 1.4-3.6h3a8 8 0 0 1-4.4 3.6zm1.8-5.6a16.5 16.5 0 0 0 0-4h3.3a8.2 8.2 0 0 1 0 4h-3.3z"/></svg>');
}
.lh-report-icon--stopwatch::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.1-6.6L20.5 6l-1.4-1.4L17.7 6A9 9 0 0 0 3 13a9 9 0 1 0 16-5.6zm-7 12.6a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/></svg>');
}
.lh-report-icon--networkspeed::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.9 5c-.2 0-.3 0-.4.2v.2L10.1 17a2 2 0 0 0-.2 1 2 2 0 0 0 4 .4l2.4-12.9c0-.3-.2-.5-.5-.5zM1 9l2 2c2.9-2.9 6.8-4 10.5-3.6l1.2-2.7C10 3.8 4.7 5.3 1 9zm20 2 2-2a15.4 15.4 0 0 0-5.6-3.6L17 8.2c1.5.7 2.9 1.6 4.1 2.8zm-4 4 2-2a9.9 9.9 0 0 0-2.7-1.9l-.5 3 1.2.9zM5 13l2 2a7.1 7.1 0 0 1 4-2l1.3-2.9C9.7 10.1 7 11 5 13z"/></svg>');
}
.lh-report-icon--samples-one::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="7" cy="14" r="3"/><path d="M7 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5.6 17.6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>');
}
.lh-report-icon--samples-many::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5.6 17.6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><circle cx="7" cy="14" r="3"/><circle cx="11" cy="6" r="3"/></svg>');
}
.lh-report-icon--chrome::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 562 562"><path d="M256 25.6v25.6a204 204 0 0 1 144.8 60 204 204 0 0 1 60 144.8 204 204 0 0 1-60 144.8 204 204 0 0 1-144.8 60 204 204 0 0 1-144.8-60 204 204 0 0 1-60-144.8 204 204 0 0 1 60-144.8 204 204 0 0 1 144.8-60V0a256 256 0 1 0 0 512 256 256 0 0 0 0-512v25.6z"/><path d="M256 179.2v25.6a51.3 51.3 0 0 1 0 102.4 51.3 51.3 0 0 1 0-102.4v-51.2a102.3 102.3 0 1 0-.1 204.7 102.3 102.3 0 0 0 .1-204.7v25.6z"/><path d="M256 204.8h217.6a25.6 25.6 0 0 0 0-51.2H256a25.6 25.6 0 0 0 0 51.2m44.3 76.8L191.5 470.1a25.6 25.6 0 1 0 44.4 25.6l108.8-188.5a25.6 25.6 0 1 0-44.4-25.6m-88.6 0L102.9 93.2a25.7 25.7 0 0 0-35-9.4 25.7 25.7 0 0 0-9.4 35l108.8 188.5a25.7 25.7 0 0 0 35 9.4 25.9 25.9 0 0 0 9.4-35.1"/></svg>');
}



.lh-buttons {
  display: flex;
  flex-wrap: wrap;
  margin: var(--default-padding) 0;
}
.lh-button {
  height: 32px;
  border: 1px solid var(--report-border-color-secondary);
  border-radius: 3px;
  color: var(--link-color);
  background-color: var(--report-background-color);
  margin: 5px;
}

.lh-button:first-of-type {
  margin-left: 0;
}

/* Node */
.lh-node__snippet {
  font-family: var(--report-font-family-monospace);
  color: var(--snippet-color);
  font-size: var(--report-monospace-font-size);
  line-height: 20px;
}

/* Score */

.lh-audit__score-icon {
  width: var(--score-icon-size);
  height: var(--score-icon-size);
  margin: var(--score-icon-margin);
}

.lh-audit--pass .lh-audit__display-text {
  color: var(--color-pass-secondary);
}
.lh-audit--pass .lh-audit__score-icon,
.lh-scorescale-range--pass::before {
  border-radius: 100%;
  background: var(--color-pass);
}

.lh-audit--average .lh-audit__display-text {
  color: var(--color-average-secondary);
}
.lh-audit--average .lh-audit__score-icon,
.lh-scorescale-range--average::before {
  background: var(--color-average);
  width: var(--icon-square-size);
  height: var(--icon-square-size);
}

.lh-audit--fail .lh-audit__display-text {
  color: var(--color-fail-secondary);
}
.lh-audit--fail .lh-audit__score-icon,
.lh-audit--error .lh-audit__score-icon,
.lh-scorescale-range--fail::before {
  border-left: calc(var(--score-icon-size) / 2) solid transparent;
  border-right: calc(var(--score-icon-size) / 2) solid transparent;
  border-bottom: var(--score-icon-size) solid var(--color-fail);
}

.lh-audit--manual .lh-audit__display-text,
.lh-audit--notapplicable .lh-audit__display-text {
  color: var(--color-gray-600);
}
.lh-audit--manual .lh-audit__score-icon,
.lh-audit--notapplicable .lh-audit__score-icon {
  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-400);
  border-radius: 100%;
  background: none;
}

.lh-audit--informative .lh-audit__display-text {
  color: var(--color-gray-600);
}

.lh-audit--informative .lh-audit__score-icon {
  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-400);
  border-radius: 100%;
}

.lh-audit__description,
.lh-audit__stackpack {
  color: var(--report-text-color-secondary);
}
.lh-audit__adorn {
  border: 1px solid slategray;
  border-radius: 3px;
  margin: 0 3px;
  padding: 0 2px;
  line-height: 1.1;
  display: inline-block;
  font-size: 90%;
}

.lh-category-header__description  {
  text-align: center;
  color: var(--color-gray-700);
  margin: 0px auto;
  max-width: 400px;
}


.lh-audit__display-text,
.lh-load-opportunity__sparkline,
.lh-chevron-container {
  margin: 0 var(--audit-margin-horizontal);
}
.lh-chevron-container {
  margin-right: 0;
}

.lh-audit__title-and-text {
  flex: 1;
}

.lh-audit__title-and-text code {
  color: var(--snippet-color);
  font-size: var(--report-monospace-font-size);
}

/* Prepend display text with em dash separator. But not in Opportunities. */
.lh-audit__display-text:not(:empty):before {
  content: '\u2014';
  margin-right: var(--audit-margin-horizontal);
}
.lh-audit-group.lh-audit-group--load-opportunities .lh-audit__display-text:not(:empty):before {
  display: none;
}

/* Expandable Details (Audit Groups, Audits) */
.lh-audit__header {
  display: flex;
  align-items: center;
  padding: var(--default-padding);
}

.lh-audit--load-opportunity .lh-audit__header {
  display: block;
}


.lh-metricfilter {
  display: grid;
  justify-content: end;
  align-items: center;
  grid-auto-flow: column;
  gap: 4px;
  color: var(--color-gray-700);
}

.lh-metricfilter__radio {
  position: absolute;
  left: -9999px;
}
.lh-metricfilter input[type='radio']:focus-visible + label {
  outline: -webkit-focus-ring-color auto 1px;
}

.lh-metricfilter__label {
  display: inline-flex;
  padding: 0 4px;
  height: 16px;
  text-decoration: underline;
  align-items: center;
  cursor: pointer;
  font-size: 90%;
}

.lh-metricfilter__label--active {
  background: var(--color-blue-primary);
  color: var(--color-white);
  border-radius: 3px;
  text-decoration: none;
}
/* Give the 'All' choice a more muted display */
.lh-metricfilter__label--active[for="metric-All"] {
  background-color: var(--color-blue-200) !important;
  color: black !important;
}

.lh-metricfilter__text {
  margin-right: 8px;
}

/* If audits are filtered, hide the itemcount for Passed Audits\u2026 */
.lh-category--filtered .lh-audit-group .lh-audit-group__itemcount {
  display: none;
}


.lh-audit__header:hover {
  background-color: var(--color-hover);
}

/* We want to hide the browser's default arrow marker on summary elements. Admittedly, it's complicated. */
.lh-root details > summary {
  /* Blink 89+ and Firefox will hide the arrow when display is changed from (new) default of \`list-item\` to block.  https://chromestatus.com/feature/6730096436051968*/
  display: block;
}
/* Safari and Blink <=88 require using the -webkit-details-marker selector */
.lh-root details > summary::-webkit-details-marker {
  display: none;
}

/* Perf Metric */

.lh-metrics-container {
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: var(--report-line-height);
  margin-bottom: var(--default-padding);
}

.lh-metric {
  border-top: 1px solid var(--report-border-color-secondary);
}

.lh-metric:nth-last-child(-n+2) {
  border-bottom: 1px solid var(--report-border-color-secondary);
}


.lh-metric__innerwrap {
  display: grid;
  /**
   * Icon -- Metric Name
   *      -- Metric Value
   */
  grid-template-columns: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right)) 1fr;
  align-items: center;
  padding: var(--default-padding);
}

.lh-metric__details {
  order: -1;
}

.lh-metric__title {
  flex: 1;
}

.lh-calclink {
  padding-left: calc(1ex / 3);
}

.lh-metric__description {
  display: none;
  grid-column-start: 2;
  grid-column-end: 4;
  color: var(--report-text-color-secondary);
}

.lh-metric__value {
  font-size: var(--metric-value-font-size);
  margin: calc(var(--default-padding) / 2) 0;
  white-space: nowrap; /* No wrapping between metric value and the icon */
  grid-column-start: 2;
}


@media screen and (max-width: 535px) {
  .lh-metrics-container {
    display: block;
  }

  .lh-metric {
    border-bottom: none !important;
  }
  .lh-metric:nth-last-child(1) {
    border-bottom: 1px solid var(--report-border-color-secondary) !important;
  }

  /* Change the grid to 3 columns for narrow viewport. */
  .lh-metric__innerwrap {
  /**
   * Icon -- Metric Name -- Metric Value
   */
    grid-template-columns: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right)) 2fr 1fr;
  }
  .lh-metric__value {
    justify-self: end;
    grid-column-start: unset;
  }
}

/* No-JS toggle switch */
/* Keep this selector sync'd w/ \`magicSelector\` in report-ui-features-test.js */
 .lh-metrics-toggle__input:checked ~ .lh-metrics-container .lh-metric__description {
  display: block;
}

/* TODO get rid of the SVGS and clean up these some more */
.lh-metrics-toggle__input {
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0px;
}

.lh-metrics-toggle__input + div > label > .lh-metrics-toggle__labeltext--hide,
.lh-metrics-toggle__input:checked + div > label > .lh-metrics-toggle__labeltext--show {
  display: none;
}
.lh-metrics-toggle__input:checked + div > label > .lh-metrics-toggle__labeltext--hide {
  display: inline;
}
.lh-metrics-toggle__input:focus + div > label {
  outline: -webkit-focus-ring-color auto 3px;
}

.lh-metrics-toggle__label {
  cursor: pointer;
  font-size: var(--report-font-size-secondary);
  line-height: var(--report-line-height-secondary);
  color: var(--color-gray-700);
}

/* Pushes the metric description toggle button to the right. */
.lh-audit-group--metrics .lh-audit-group__header {
  display: flex;
  justify-content: space-between;
}

.lh-metric__icon,
.lh-scorescale-range::before {
  content: '';
  width: var(--score-icon-size);
  height: var(--score-icon-size);
  display: inline-block;
  margin: var(--score-icon-margin);
}

.lh-metric--pass .lh-metric__value {
  color: var(--color-pass-secondary);
}
.lh-metric--pass .lh-metric__icon {
  border-radius: 100%;
  background: var(--color-pass);
}

.lh-metric--average .lh-metric__value {
  color: var(--color-average-secondary);
}
.lh-metric--average .lh-metric__icon {
  background: var(--color-average);
  width: var(--icon-square-size);
  height: var(--icon-square-size);
}

.lh-metric--fail .lh-metric__value {
  color: var(--color-fail-secondary);
}
.lh-metric--fail .lh-metric__icon,
.lh-metric--error .lh-metric__icon {
  border-left: calc(var(--score-icon-size) / 2) solid transparent;
  border-right: calc(var(--score-icon-size) / 2) solid transparent;
  border-bottom: var(--score-icon-size) solid var(--color-fail);
}

.lh-metric--error .lh-metric__value,
.lh-metric--error .lh-metric__description {
  color: var(--color-fail-secondary);
}

/* Perf load opportunity */

.lh-load-opportunity__cols {
  display: flex;
  align-items: flex-start;
}

.lh-load-opportunity__header .lh-load-opportunity__col {
  color: var(--color-gray-600);
  display: unset;
  line-height: calc(2.3 * var(--report-font-size));
}

.lh-load-opportunity__col {
  display: flex;
}

.lh-load-opportunity__col--one {
  flex: 5;
  align-items: center;
  margin-right: 2px;
}
.lh-load-opportunity__col--two {
  flex: 4;
  text-align: right;
}

.lh-audit--load-opportunity .lh-audit__display-text {
  text-align: right;
  flex: 0 0 calc(3 * var(--report-font-size));
}


/* Sparkline */

.lh-load-opportunity__sparkline {
  flex: 1;
  margin-top: calc((var(--report-line-height) - var(--sparkline-height)) / 2);
}

.lh-sparkline {
  height: var(--sparkline-height);
  width: 100%;
}

.lh-sparkline__bar {
  height: 100%;
  float: right;
}

.lh-audit--pass .lh-sparkline__bar {
  background: var(--color-pass);
}

.lh-audit--average .lh-sparkline__bar {
  background: var(--color-average);
}

.lh-audit--fail .lh-sparkline__bar {
  background: var(--color-fail);
}

/* Filmstrip */

.lh-filmstrip-container {
  /* smaller gap between metrics and filmstrip */
  margin: -8px auto 0 auto;
}

.lh-filmstrip {
  display: grid;
  justify-content: space-between;
  padding-bottom: var(--default-padding);
  width: 100%;
  grid-template-columns: repeat(auto-fit, 60px);
}

.lh-filmstrip__frame {
  text-align: right;
  position: relative;
}

.lh-filmstrip__thumbnail {
  border: 1px solid var(--report-border-color-secondary);
  max-height: 100px;
  max-width: 60px;
}

/* Audit */

.lh-audit {
  border-bottom: 1px solid var(--report-border-color-secondary);
}

/* Apply border-top to just the first audit. */
.lh-audit {
  border-top: 1px solid var(--report-border-color-secondary);
}
.lh-audit ~ .lh-audit {
  border-top: none;
}


.lh-audit--error .lh-audit__display-text {
  color: var(--color-fail-secondary);
}

/* Audit Group */

.lh-audit-group {
  margin-bottom: var(--audit-group-margin-bottom);
  position: relative;
}
.lh-audit-group--metrics {
  margin-bottom: calc(var(--audit-group-margin-bottom) / 2);
}

.lh-audit-group__header::before {
  /* By default, groups don't get an icon */
  content: none;
  width: var(--pwa-icon-size);
  height: var(--pwa-icon-size);
  margin: var(--pwa-icon-margin);
  display: inline-block;
  vertical-align: middle;
}

/* Style the "over budget" columns red. */
.lh-audit-group--budgets #performance-budget tbody tr td:nth-child(4),
.lh-audit-group--budgets #performance-budget tbody tr td:nth-child(5),
.lh-audit-group--budgets #timing-budget tbody tr td:nth-child(3) {
  color: var(--color-red-700);
}

/* Align the "over budget request count" text to be close to the "over budget bytes" column. */
.lh-audit-group--budgets .lh-table tbody tr td:nth-child(4){
  text-align: right;
}

.lh-audit-group--budgets .lh-details--budget {
  width: 100%;
  margin: 0 0 var(--default-padding);
}

.lh-audit-group--pwa-installable .lh-audit-group__header::before {
  content: '';
  background-image: var(--pwa-installable-gray-url);
}
.lh-audit-group--pwa-optimized .lh-audit-group__header::before {
  content: '';
  background-image: var(--pwa-optimized-gray-url);
}
.lh-audit-group--pwa-installable.lh-badged .lh-audit-group__header::before {
  background-image: var(--pwa-installable-color-url);
}
.lh-audit-group--pwa-optimized.lh-badged .lh-audit-group__header::before {
  background-image: var(--pwa-optimized-color-url);
}

.lh-audit-group--metrics .lh-audit-group__summary {
  margin-top: 0;
  margin-bottom: 0;
}

.lh-audit-group__summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lh-audit-group__header .lh-chevron {
  margin-top: calc((var(--report-line-height) - 5px) / 2);
}

.lh-audit-group__header {
  letter-spacing: 0.8px;
  padding: var(--default-padding);
  padding-left: 0;
}

.lh-audit-group__header, .lh-audit-group__summary {
  font-size: var(--report-font-size-secondary);
  line-height: var(--report-line-height-secondary);
  color: var(--color-gray-700);
}

.lh-audit-group__title {
  text-transform: uppercase;
  font-weight: 500;
}

.lh-audit-group__itemcount {
  color: var(--color-gray-600);
}

.lh-audit-group__footer {
  color: var(--color-gray-600);
  display: block;
  margin-top: var(--default-padding);
}

.lh-details,
.lh-category-header__description,
.lh-load-opportunity__header,
.lh-audit-group__footer {
  font-size: var(--report-font-size-secondary);
  line-height: var(--report-line-height-secondary);
}

.lh-audit-explanation {
  margin: var(--audit-padding-vertical) 0 calc(var(--audit-padding-vertical) / 2) var(--audit-margin-horizontal);
  line-height: var(--audit-explanation-line-height);
  display: inline-block;
}

.lh-audit--fail .lh-audit-explanation {
  color: var(--color-fail-secondary);
}

/* Report */
.lh-list > div:not(:last-child) {
  padding-bottom: 20px;
}

.lh-header-container {
  display: block;
  margin: 0 auto;
  position: relative;
  word-wrap: break-word;
}

.lh-header-container .lh-scores-wrapper {
  border-bottom: 1px solid var(--color-gray-200);
}


.lh-report {
  min-width: var(--report-content-min-width);
}

.lh-exception {
  font-size: large;
}

.lh-code {
  white-space: normal;
  margin-top: 0;
  font-size: var(--report-monospace-font-size);
}

.lh-warnings {
  --item-margin: calc(var(--report-line-height) / 6);
  color: var(--color-average-secondary);
  margin: var(--audit-padding-vertical) 0;
  padding: var(--default-padding)
    var(--default-padding)
    var(--default-padding)
    calc(var(--audit-description-padding-left));
  background-color: var(--toplevel-warning-background-color);
}
.lh-warnings span {
  font-weight: bold;
}

.lh-warnings--toplevel {
  --item-margin: calc(var(--header-line-height) / 4);
  color: var(--toplevel-warning-text-color);
  margin-left: auto;
  margin-right: auto;
  max-width: var(--report-content-max-width-minus-edge-gap);
  padding: var(--toplevel-warning-padding);
  border-radius: 8px;
}

.lh-warnings__msg {
  color: var(--toplevel-warning-message-text-color);
  margin: 0;
}

.lh-warnings ul {
  margin: 0;
}
.lh-warnings li {
  margin: var(--item-margin) 0;
}
.lh-warnings li:last-of-type {
  margin-bottom: 0;
}

.lh-scores-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.lh-scores-header__solo {
  padding: 0;
  border: 0;
}

/* Gauge */

.lh-gauge__wrapper--pass {
  color: var(--color-pass-secondary);
  fill: var(--color-pass);
  stroke: var(--color-pass);
}

.lh-gauge__wrapper--average {
  color: var(--color-average-secondary);
  fill: var(--color-average);
  stroke: var(--color-average);
}

.lh-gauge__wrapper--fail {
  color: var(--color-fail-secondary);
  fill: var(--color-fail);
  stroke: var(--color-fail);
}

.lh-gauge__wrapper--not-applicable {
  color: var(--color-not-applicable);
  fill: var(--color-not-applicable);
  stroke: var(--color-not-applicable);
}

.lh-fraction__wrapper .lh-fraction__content::before {
  content: '';
  height: var(--score-icon-size);
  width: var(--score-icon-size);
  margin: var(--score-icon-margin);
  display: inline-block;
}
.lh-fraction__wrapper--pass .lh-fraction__content {
  color: var(--color-pass-secondary);
}
.lh-fraction__wrapper--pass .lh-fraction__background {
  background-color: var(--color-pass);
}
.lh-fraction__wrapper--pass .lh-fraction__content::before {
  background-color: var(--color-pass);
  border-radius: 50%;
}
.lh-fraction__wrapper--average .lh-fraction__content {
  color: var(--color-average-secondary);
}
.lh-fraction__wrapper--average .lh-fraction__background,
.lh-fraction__wrapper--average .lh-fraction__content::before {
  background-color: var(--color-average);
}
.lh-fraction__wrapper--fail .lh-fraction__content {
  color: var(--color-fail);
}
.lh-fraction__wrapper--fail .lh-fraction__background {
  background-color: var(--color-fail);
}
.lh-fraction__wrapper--fail .lh-fraction__content::before {
  border-left: calc(var(--score-icon-size) / 2) solid transparent;
  border-right: calc(var(--score-icon-size) / 2) solid transparent;
  border-bottom: var(--score-icon-size) solid var(--color-fail);
}
.lh-fraction__wrapper--null .lh-fraction__content {
  color: var(--color-gray-700);
}
.lh-fraction__wrapper--null .lh-fraction__background {
  background-color: var(--color-gray-700);
}
.lh-fraction__wrapper--null .lh-fraction__content::before {
  border-radius: 50%;
  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-700);
}

.lh-fraction__background {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: calc(var(--gauge-circle-size) / 2);
  opacity: 0.1;
  z-index: -1;
}

.lh-fraction__content-wrapper {
  height: var(--gauge-circle-size);
  display: flex;
  align-items: center;
}

.lh-fraction__content {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  font-size: calc(0.3 * var(--gauge-circle-size));
  line-height: calc(0.4 * var(--gauge-circle-size));
  width: max-content;
  min-width: calc(1.5 * var(--gauge-circle-size));
  padding: calc(0.1 * var(--gauge-circle-size)) calc(0.2 * var(--gauge-circle-size));
  --score-icon-size: calc(0.21 * var(--gauge-circle-size));
  --score-icon-margin: 0 calc(0.15 * var(--gauge-circle-size)) 0 0;
}

.lh-gauge {
  stroke-linecap: round;
  width: var(--gauge-circle-size);
  height: var(--gauge-circle-size);
}

.lh-category .lh-gauge {
  --gauge-circle-size: var(--gauge-circle-size-big);
}

.lh-gauge-base {
  opacity: 0.1;
}

.lh-gauge-arc {
  fill: none;
  transform-origin: 50% 50%;
  animation: load-gauge var(--transition-length) ease forwards;
  animation-delay: 250ms;
}

.lh-gauge__svg-wrapper {
  position: relative;
  height: var(--gauge-circle-size);
}
.lh-category .lh-gauge__svg-wrapper,
.lh-category .lh-fraction__wrapper {
  --gauge-circle-size: var(--gauge-circle-size-big);
}

/* The plugin badge overlay */
.lh-gauge__wrapper--plugin .lh-gauge__svg-wrapper::before {
  width: var(--plugin-badge-size);
  height: var(--plugin-badge-size);
  background-color: var(--plugin-badge-background-color);
  background-image: var(--plugin-icon-url);
  background-repeat: no-repeat;
  background-size: var(--plugin-icon-size);
  background-position: 58% 50%;
  content: "";
  position: absolute;
  right: -6px;
  bottom: 0px;
  display: block;
  z-index: 100;
  box-shadow: 0 0 4px rgba(0,0,0,.2);
  border-radius: 25%;
}
.lh-category .lh-gauge__wrapper--plugin .lh-gauge__svg-wrapper::before {
  width: var(--plugin-badge-size-big);
  height: var(--plugin-badge-size-big);
}

@keyframes load-gauge {
  from { stroke-dasharray: 0 352; }
}

.lh-gauge__percentage {
  width: 100%;
  height: var(--gauge-circle-size);
  position: absolute;
  font-family: var(--report-font-family-monospace);
  font-size: calc(var(--gauge-circle-size) * 0.34 + 1.3px);
  line-height: 0;
  text-align: center;
  top: calc(var(--score-container-padding) + var(--gauge-circle-size) / 2);
}

.lh-category .lh-gauge__percentage {
  --gauge-circle-size: var(--gauge-circle-size-big);
  --gauge-percentage-font-size: var(--gauge-percentage-font-size-big);
}

.lh-gauge__wrapper,
.lh-fraction__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-decoration: none;
  padding: var(--score-container-padding);

  --transition-length: 1s;

  /* Contain the layout style paint & layers during animation*/
  contain: content;
  will-change: opacity; /* Only using for layer promotion */
}

.lh-gauge__label,
.lh-fraction__label {
  font-size: var(--gauge-label-font-size);
  font-weight: 500;
  line-height: var(--gauge-label-line-height);
  margin-top: 10px;
  text-align: center;
  color: var(--report-text-color);
  word-break: keep-all;
}

/* TODO(#8185) use more BEM (.lh-gauge__label--big) instead of relying on descendant selector */
.lh-category .lh-gauge__label,
.lh-category .lh-fraction__label {
  --gauge-label-font-size: var(--gauge-label-font-size-big);
  --gauge-label-line-height: var(--gauge-label-line-height-big);
  margin-top: 14px;
}

.lh-scores-header .lh-gauge__wrapper,
.lh-scores-header .lh-fraction__wrapper,
.lh-scores-header .lh-gauge--pwa__wrapper,
.lh-sticky-header .lh-gauge__wrapper,
.lh-sticky-header .lh-fraction__wrapper,
.lh-sticky-header .lh-gauge--pwa__wrapper {
  width: var(--gauge-wrapper-width);
}

.lh-scorescale {
  display: inline-flex;

  gap: calc(var(--default-padding) * 4);
  margin: 16px auto 0 auto;
  font-size: var(--report-font-size-secondary);
  color: var(--color-gray-700);

}

.lh-scorescale-range {
  display: flex;
  align-items: center;
  font-family: var(--report-font-family-monospace);
  white-space: nowrap;
}

.lh-category-header__finalscreenshot .lh-scorescale {
  border: 0;
  display: flex;
  justify-content: center;
}

.lh-category-header__finalscreenshot .lh-scorescale-range {
  font-family: unset;
  font-size: 12px;
}

.lh-scorescale-wrap {
  display: contents;
}

/* Hide category score gauages if it's a single category report */
.lh-header--solo-category .lh-scores-wrapper {
  display: none;
}


.lh-categories {
  width: 100%;
  overflow: hidden;
}

.lh-category {
  padding: var(--category-padding);
  max-width: var(--report-content-max-width);
  margin: 0 auto;

  --sticky-header-height: calc(var(--gauge-circle-size-sm) + var(--score-container-padding) * 2);
  --topbar-plus-sticky-header: calc(var(--topbar-height) + var(--sticky-header-height));
  scroll-margin-top: var(--topbar-plus-sticky-header);

  /* Faster recalc style & layout of the report. https://web.dev/content-visibility/ */
  content-visibility: auto;
  contain-intrinsic-size: 1000px;
}

.lh-category-wrapper {
  border-bottom: 1px solid var(--color-gray-200);
}

.lh-category-header {
  margin-bottom: var(--section-padding-vertical);
}

.lh-category-header .lh-score__gauge {
  max-width: 400px;
  width: auto;
  margin: 0px auto;
}

.lh-category-header__finalscreenshot {
  display: grid;
  grid-template: none / 1fr 1px 1fr;
  justify-items: center;
  align-items: center;
  gap: var(--report-line-height);
  min-height: 288px;
  margin-bottom: var(--default-padding);
}

.lh-final-ss-image {
  /* constrain the size of the image to not be too large */
  max-height: calc(var(--gauge-circle-size-big) * 2.8);
  max-width: calc(var(--gauge-circle-size-big) * 3.5);
  border: 1px solid var(--color-gray-200);
  padding: 4px;
  border-radius: 3px;
  display: block;
}

.lh-category-headercol--separator {
  background: var(--color-gray-200);
  width: 1px;
  height: var(--gauge-circle-size-big);
}

@media screen and (max-width: 780px) {
  .lh-category-header__finalscreenshot {
    grid-template: 1fr 1fr / none
  }
  .lh-category-headercol--separator {
    display: none;
  }
}


/* 964 fits the min-width of the filmstrip */
@media screen and (max-width: 964px) {
  .lh-report {
    margin-left: 0;
    width: 100%;
  }
}

@media print {
  body {
    -webkit-print-color-adjust: exact; /* print background colors */
  }
  .lh-container {
    display: block;
  }
  .lh-report {
    margin-left: 0;
    padding-top: 0;
  }
  .lh-categories {
    margin-top: 0;
  }
}

.lh-table {
  border-collapse: collapse;
  /* Can't assign padding to table, so shorten the width instead. */
  width: calc(100% - var(--audit-description-padding-left) - var(--stackpack-padding-horizontal));
  border: 1px solid var(--report-border-color-secondary);

}

.lh-table thead th {
  font-weight: normal;
  color: var(--color-gray-600);
  /* See text-wrapping comment on .lh-container. */
  word-break: normal;
}

.lh-row--even {
  background-color: var(--table-higlight-background-color);
}
.lh-row--hidden {
  display: none;
}

.lh-table th,
.lh-table td {
  padding: var(--default-padding);
}

.lh-table tr {
  vertical-align: middle;
}

/* Looks unnecessary, but mostly for keeping the <th>s left-aligned */
.lh-table-column--text,
.lh-table-column--source-location,
.lh-table-column--url,
/* .lh-table-column--thumbnail, */
/* .lh-table-column--empty,*/
.lh-table-column--code,
.lh-table-column--node {
  text-align: left;
}

.lh-table-column--code {
  min-width: 100px;
}

.lh-table-column--bytes,
.lh-table-column--timespanMs,
.lh-table-column--ms,
.lh-table-column--numeric {
  text-align: right;
  word-break: normal;
}



.lh-table .lh-table-column--thumbnail {
  width: var(--image-preview-size);
}

.lh-table-column--url {
  min-width: 250px;
}

.lh-table-column--text {
  min-width: 80px;
}

/* Keep columns narrow if they follow the URL column */
/* 12% was determined to be a decent narrow width, but wide enough for column headings */
.lh-table-column--url + th.lh-table-column--bytes,
.lh-table-column--url + .lh-table-column--bytes + th.lh-table-column--bytes,
.lh-table-column--url + .lh-table-column--ms,
.lh-table-column--url + .lh-table-column--ms + th.lh-table-column--bytes,
.lh-table-column--url + .lh-table-column--bytes + th.lh-table-column--timespanMs {
  width: 12%;
}

.lh-text__url-host {
  display: inline;
}

.lh-text__url-host {
  margin-left: calc(var(--report-font-size) / 2);
  opacity: 0.6;
  font-size: 90%
}

.lh-thumbnail {
  object-fit: cover;
  width: var(--image-preview-size);
  height: var(--image-preview-size);
  display: block;
}

.lh-unknown pre {
  overflow: scroll;
  border: solid 1px var(--color-gray-200);
}

.lh-text__url > a {
  color: inherit;
  text-decoration: none;
}

.lh-text__url > a:hover {
  text-decoration: underline dotted #999;
}

.lh-sub-item-row {
  margin-left: 20px;
  margin-bottom: 0;
  color: var(--color-gray-700);
}
.lh-sub-item-row td {
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 20px;
}

/* Chevron
   https://codepen.io/paulirish/pen/LmzEmK
 */
.lh-chevron {
  --chevron-angle: 42deg;
  /* Edge doesn't support transform: rotate(calc(...)), so we define it here */
  --chevron-angle-right: -42deg;
  width: var(--chevron-size);
  height: var(--chevron-size);
  margin-top: calc((var(--report-line-height) - 12px) / 2);
}

.lh-chevron__lines {
  transition: transform 0.4s;
  transform: translateY(var(--report-line-height));
}
.lh-chevron__line {
 stroke: var(--chevron-line-stroke);
 stroke-width: var(--chevron-size);
 stroke-linecap: square;
 transform-origin: 50%;
 transform: rotate(var(--chevron-angle));
 transition: transform 300ms, stroke 300ms;
}

.lh-expandable-details .lh-chevron__line-right,
.lh-expandable-details[open] .lh-chevron__line-left {
 transform: rotate(var(--chevron-angle-right));
}

.lh-expandable-details[open] .lh-chevron__line-right {
  transform: rotate(var(--chevron-angle));
}


.lh-expandable-details[open]  .lh-chevron__lines {
 transform: translateY(calc(var(--chevron-size) * -1));
}

.lh-expandable-details[open] {
  animation: 300ms openDetails forwards;
  padding-bottom: var(--default-padding);
}

@keyframes openDetails {
  from {
    outline: 1px solid var(--report-background-color);
  }
  to {
   outline: 1px solid;
   box-shadow: 0 2px 4px rgba(0, 0, 0, .24);
  }
}

@media screen and (max-width: 780px) {
  /* no black outline if we're not confident the entire table can be displayed within bounds */
  .lh-expandable-details[open] {
    animation: none;
  }
}

.lh-expandable-details[open] summary, details.lh-clump > summary {
  border-bottom: 1px solid var(--report-border-color-secondary);
}
details.lh-clump[open] > summary {
  border-bottom-width: 0;
}



details .lh-clump-toggletext--hide,
details[open] .lh-clump-toggletext--show { display: none; }
details[open] .lh-clump-toggletext--hide { display: block;}


/* Tooltip */
.lh-tooltip-boundary {
  position: relative;
}

.lh-tooltip {
  position: absolute;
  display: none; /* Don't retain these layers when not needed */
  opacity: 0;
  background: #ffffff;
  white-space: pre-line; /* Render newlines in the text */
  min-width: 246px;
  max-width: 275px;
  padding: 15px;
  border-radius: 5px;
  text-align: initial;
  line-height: 1.4;
}
/* shrink tooltips to not be cutoff on left edge of narrow viewports
   45vw is chosen to be ~= width of the left column of metrics
*/
@media screen and (max-width: 535px) {
  .lh-tooltip {
    min-width: 45vw;
    padding: 3vw;
  }
}

.lh-tooltip-boundary:hover .lh-tooltip {
  display: block;
  animation: fadeInTooltip 250ms;
  animation-fill-mode: forwards;
  animation-delay: 850ms;
  bottom: 100%;
  z-index: 1;
  will-change: opacity;
  right: 0;
  pointer-events: none;
}

.lh-tooltip::before {
  content: "";
  border: solid transparent;
  border-bottom-color: #fff;
  border-width: 10px;
  position: absolute;
  bottom: -20px;
  right: 6px;
  transform: rotate(180deg);
  pointer-events: none;
}

@keyframes fadeInTooltip {
  0% { opacity: 0; }
  75% { opacity: 1; }
  100% { opacity: 1;  filter: drop-shadow(1px 0px 1px #aaa) drop-shadow(0px 2px 4px hsla(206, 6%, 25%, 0.15)); pointer-events: auto; }
}

/* Element screenshot */
.lh-element-screenshot {
  position: relative;
  overflow: hidden;
  float: left;
  margin-right: 20px;
}
.lh-element-screenshot__content {
  overflow: hidden;
}
.lh-element-screenshot__image {
  /* Set by ElementScreenshotRenderer.installFullPageScreenshotCssVariable */
  background-image: var(--element-screenshot-url);
  outline: 2px solid #777;
  background-color: white;
  background-repeat: no-repeat;
}
.lh-element-screenshot__mask {
  position: absolute;
  background: #555;
  opacity: 0.8;
}
.lh-element-screenshot__element-marker {
  position: absolute;
  outline: 2px solid var(--color-lime-400);
}
.lh-element-screenshot__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000; /* .lh-topbar is 1000 */
  background: var(--screenshot-overlay-background);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.lh-element-screenshot__overlay .lh-element-screenshot {
  margin-right: 0; /* clearing margin used in thumbnail case */
  outline: 1px solid var(--color-gray-700);
}

.lh-screenshot-overlay--enabled .lh-element-screenshot {
  cursor: zoom-out;
}
.lh-screenshot-overlay--enabled .lh-node .lh-element-screenshot {
  cursor: zoom-in;
}


.lh-meta__items {
  --meta-icon-size: calc(var(--report-icon-size) * 0.667);
  padding: var(--default-padding);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: var(--env-item-background-color);
  border-radius: 3px;
  margin: 0 0 var(--default-padding) 0;
  font-size: 12px;
  column-gap: var(--default-padding);
  color: var(--color-gray-700);
}

.lh-meta__item {
  display: block;
  list-style-type: none;
  position: relative;
  padding: 0 0 0 calc(var(--meta-icon-size) + var(--default-padding) * 2);
  cursor: unset; /* disable pointer cursor from report-icon */
}

.lh-meta__item.lh-tooltip-boundary {
  text-decoration: dotted underline var(--color-gray-500);
  cursor: help;
}

.lh-meta__item.lh-report-icon::before {
  position: absolute;
  left: var(--default-padding);
  width: var(--meta-icon-size);
  height: var(--meta-icon-size);
}

.lh-meta__item.lh-report-icon:hover::before {
  opacity: 0.7;
}

.lh-meta__item .lh-tooltip {
  color: var(--color-gray-800);
}

.lh-meta__item .lh-tooltip::before {
  right: auto; /* Set the tooltip arrow to the leftside */
  left: 6px;
}

/* Change the grid for narrow viewport. */
@media screen and (max-width: 640px) {
  .lh-meta__items {
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (max-width: 535px) {
  .lh-meta__items {
    display: block;
  }
}


/*# sourceURL=report-styles.css */
`),e.append(t),e}function Ze(r){const e=r.createFragment(),t=r.createElement("style");t.append(`
    .lh-topbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      height: var(--topbar-height);
      padding: var(--topbar-padding);
      font-size: var(--report-font-size-secondary);
      background-color: var(--topbar-background-color);
      border-bottom: 1px solid var(--color-gray-200);
    }

    .lh-topbar__logo {
      width: var(--topbar-logo-size);
      height: var(--topbar-logo-size);
      user-select: none;
      flex: none;
    }

    .lh-topbar__url {
      margin: var(--topbar-padding);
      text-decoration: none;
      color: var(--report-text-color);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .lh-tools {
      display: flex;
      align-items: center;
      margin-left: auto;
      will-change: transform;
      min-width: var(--report-icon-size);
    }
    .lh-tools__button {
      width: var(--report-icon-size);
      min-width: 24px;
      height: var(--report-icon-size);
      cursor: pointer;
      margin-right: 5px;
      /* This is actually a button element, but we want to style it like a transparent div. */
      display: flex;
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      outline: inherit;
    }
    .lh-tools__button svg {
      fill: var(--tools-icon-color);
    }
    .lh-dark .lh-tools__button svg {
      filter: invert(1);
    }
    .lh-tools__button.lh-active + .lh-tools__dropdown {
      opacity: 1;
      clip: rect(-1px, 194px, 242px, -3px);
      visibility: visible;
    }
    .lh-tools__dropdown {
      position: absolute;
      background-color: var(--report-background-color);
      border: 1px solid var(--report-border-color);
      border-radius: 3px;
      padding: calc(var(--default-padding) / 2) 0;
      cursor: pointer;
      top: 36px;
      right: 0;
      box-shadow: 1px 1px 3px #ccc;
      min-width: 125px;
      clip: rect(0, 164px, 0, 0);
      visibility: hidden;
      opacity: 0;
      transition: all 200ms cubic-bezier(0,0,0.2,1);
    }
    .lh-tools__dropdown a {
      color: currentColor;
      text-decoration: none;
      white-space: nowrap;
      padding: 0 6px;
      line-height: 2;
    }
    .lh-tools__dropdown a:hover,
    .lh-tools__dropdown a:focus {
      background-color: var(--color-gray-200);
      outline: none;
    }
    /* save-gist option hidden in report. */
    .lh-tools__dropdown a[data-action='save-gist'] {
      display: none;
    }

    .lh-locale-selector {
      width: 100%;
      color: var(--report-text-color);
      background-color: var(--locale-selector-background-color);
      padding: 2px;
    }
    .lh-tools-locale {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
    }
    .lh-tools-locale__selector-wrapper {
      transition: opacity 0.15s;
      opacity: 0;
      max-width: 200px;
    }
    .lh-button.lh-tool-locale__button {
      height: var(--topbar-height);
      color: var(--tools-icon-color);
      padding: calc(var(--default-padding) / 2);
    }
    .lh-tool-locale__button.lh-active + .lh-tools-locale__selector-wrapper {
      opacity: 1;
      clip: rect(-1px, 194px, 242px, -3px);
      visibility: visible;
      margin: 0 4px;
    }

    @media screen and (max-width: 964px) {
      .lh-tools__dropdown {
        right: 0;
        left: initial;
      }
    }
    @media print {
      .lh-topbar {
        position: static;
        margin-left: 0;
      }

      .lh-tools__dropdown {
        display: none;
      }
    }
  `),e.append(t);const n=r.createElement("div","lh-topbar"),o=r.createElementNS("http://www.w3.org/2000/svg","svg","lh-topbar__logo");o.setAttribute("viewBox","0 0 24 24");const i=r.createElementNS("http://www.w3.org/2000/svg","defs"),a=r.createElementNS("http://www.w3.org/2000/svg","linearGradient");a.setAttribute("x1","57.456%"),a.setAttribute("y1","13.086%"),a.setAttribute("x2","18.259%"),a.setAttribute("y2","72.322%"),a.setAttribute("id","lh-topbar__logo--a");const l=r.createElementNS("http://www.w3.org/2000/svg","stop");l.setAttribute("stop-color","#262626"),l.setAttribute("stop-opacity",".1"),l.setAttribute("offset","0%");const s=r.createElementNS("http://www.w3.org/2000/svg","stop");s.setAttribute("stop-color","#262626"),s.setAttribute("stop-opacity","0"),s.setAttribute("offset","100%"),a.append(" ",l," ",s," ");const c=r.createElementNS("http://www.w3.org/2000/svg","linearGradient");c.setAttribute("x1","100%"),c.setAttribute("y1","50%"),c.setAttribute("x2","0%"),c.setAttribute("y2","50%"),c.setAttribute("id","lh-topbar__logo--b");const d=r.createElementNS("http://www.w3.org/2000/svg","stop");d.setAttribute("stop-color","#262626"),d.setAttribute("stop-opacity",".1"),d.setAttribute("offset","0%");const h=r.createElementNS("http://www.w3.org/2000/svg","stop");h.setAttribute("stop-color","#262626"),h.setAttribute("stop-opacity","0"),h.setAttribute("offset","100%"),c.append(" ",d," ",h," ");const p=r.createElementNS("http://www.w3.org/2000/svg","linearGradient");p.setAttribute("x1","58.764%"),p.setAttribute("y1","65.756%"),p.setAttribute("x2","36.939%"),p.setAttribute("y2","50.14%"),p.setAttribute("id","lh-topbar__logo--c");const m=r.createElementNS("http://www.w3.org/2000/svg","stop");m.setAttribute("stop-color","#262626"),m.setAttribute("stop-opacity",".1"),m.setAttribute("offset","0%");const f=r.createElementNS("http://www.w3.org/2000/svg","stop");f.setAttribute("stop-color","#262626"),f.setAttribute("stop-opacity","0"),f.setAttribute("offset","100%"),p.append(" ",m," ",f," ");const b=r.createElementNS("http://www.w3.org/2000/svg","linearGradient");b.setAttribute("x1","41.635%"),b.setAttribute("y1","20.358%"),b.setAttribute("x2","72.863%"),b.setAttribute("y2","85.424%"),b.setAttribute("id","lh-topbar__logo--d");const v=r.createElementNS("http://www.w3.org/2000/svg","stop");v.setAttribute("stop-color","#FFF"),v.setAttribute("stop-opacity",".1"),v.setAttribute("offset","0%");const g=r.createElementNS("http://www.w3.org/2000/svg","stop");g.setAttribute("stop-color","#FFF"),g.setAttribute("stop-opacity","0"),g.setAttribute("offset","100%"),b.append(" ",v," ",g," "),i.append(" ",a," ",c," ",p," ",b," ");const _=r.createElementNS("http://www.w3.org/2000/svg","g");_.setAttribute("fill","none"),_.setAttribute("fill-rule","evenodd");const w=r.createElementNS("http://www.w3.org/2000/svg","path");w.setAttribute("d","M12 3l4.125 2.625v3.75H18v2.25h-1.688l1.5 9.375H6.188l1.5-9.375H6v-2.25h1.875V5.648L12 3zm2.201 9.938L9.54 14.633 9 18.028l5.625-2.062-.424-3.028zM12.005 5.67l-1.88 1.207v2.498h3.75V6.86l-1.87-1.19z"),w.setAttribute("fill","#F44B21");const C=r.createElementNS("http://www.w3.org/2000/svg","path");C.setAttribute("fill","#FFF"),C.setAttribute("d","M14.201 12.938L9.54 14.633 9 18.028l5.625-2.062z");const y=r.createElementNS("http://www.w3.org/2000/svg","path");y.setAttribute("d","M6 18c-2.042 0-3.95-.01-5.813 0l1.5-9.375h4.326L6 18z"),y.setAttribute("fill","url(#lh-topbar__logo--a)"),y.setAttribute("fill-rule","nonzero"),y.setAttribute("transform","translate(6 3)");const k=r.createElementNS("http://www.w3.org/2000/svg","path");k.setAttribute("fill","#FFF176"),k.setAttribute("fill-rule","nonzero"),k.setAttribute("d","M13.875 9.375v-2.56l-1.87-1.19-1.88 1.207v2.543z");const A=r.createElementNS("http://www.w3.org/2000/svg","path");A.setAttribute("fill","url(#lh-topbar__logo--b)"),A.setAttribute("fill-rule","nonzero"),A.setAttribute("d","M0 6.375h6v2.25H0z"),A.setAttribute("transform","translate(6 3)");const S=r.createElementNS("http://www.w3.org/2000/svg","path");S.setAttribute("fill","url(#lh-topbar__logo--c)"),S.setAttribute("fill-rule","nonzero"),S.setAttribute("d","M6 6.375H1.875v-3.75L6 0z"),S.setAttribute("transform","translate(6 3)");const E=r.createElementNS("http://www.w3.org/2000/svg","path");E.setAttribute("fill","url(#lh-topbar__logo--d)"),E.setAttribute("fill-rule","nonzero"),E.setAttribute("d","M6 0l4.125 2.625v3.75H12v2.25h-1.688l1.5 9.375H.188l1.5-9.375H0v-2.25h1.875V2.648z"),E.setAttribute("transform","translate(6 3)"),_.append(" ",w," ",C," ",y," ",k," ",A," ",S," ",E," "),o.append(" ",i," ",_," ");const z=r.createElement("a","lh-topbar__url");z.setAttribute("href",""),z.setAttribute("target","_blank"),z.setAttribute("rel","noopener");const T=r.createElement("div","lh-tools"),I=r.createElement("div","lh-tools-locale lh-hidden"),L=r.createElement("button","lh-button lh-tool-locale__button");L.setAttribute("id","lh-button__swap-locales"),L.setAttribute("title","Show Language Picker"),L.setAttribute("aria-label","Toggle language picker"),L.setAttribute("aria-haspopup","menu"),L.setAttribute("aria-expanded","false"),L.setAttribute("aria-controls","lh-tools-locale__selector-wrapper");const H=r.createElementNS("http://www.w3.org/2000/svg","svg");H.setAttribute("width","20px"),H.setAttribute("height","20px"),H.setAttribute("viewBox","0 0 24 24"),H.setAttribute("fill","currentColor");const te=r.createElementNS("http://www.w3.org/2000/svg","path");te.setAttribute("d","M0 0h24v24H0V0z"),te.setAttribute("fill","none");const pe=r.createElementNS("http://www.w3.org/2000/svg","path");pe.setAttribute("d","M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"),H.append(te,pe),L.append(" ",H," ");const $=r.createElement("div","lh-tools-locale__selector-wrapper");$.setAttribute("id","lh-tools-locale__selector-wrapper"),$.setAttribute("role","menu"),$.setAttribute("aria-labelledby","lh-button__swap-locales"),$.setAttribute("aria-hidden","true"),$.append(" "," "),I.append(" ",L," ",$," ");const P=r.createElement("button","lh-tools__button");P.setAttribute("id","lh-tools-button"),P.setAttribute("title","Tools menu"),P.setAttribute("aria-label","Toggle report tools menu"),P.setAttribute("aria-haspopup","menu"),P.setAttribute("aria-expanded","false"),P.setAttribute("aria-controls","lh-tools-dropdown");const X=r.createElementNS("http://www.w3.org/2000/svg","svg");X.setAttribute("width","100%"),X.setAttribute("height","100%"),X.setAttribute("viewBox","0 0 24 24");const ne=r.createElementNS("http://www.w3.org/2000/svg","path");ne.setAttribute("d","M0 0h24v24H0z"),ne.setAttribute("fill","none");const he=r.createElementNS("http://www.w3.org/2000/svg","path");he.setAttribute("d","M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"),X.append(" ",ne," ",he," "),P.append(" ",X," ");const Z=r.createElement("div","lh-tools__dropdown");Z.setAttribute("id","lh-tools-dropdown"),Z.setAttribute("role","menu"),Z.setAttribute("aria-labelledby","lh-tools-button");const U=r.createElement("a","lh-report-icon lh-report-icon--print");U.setAttribute("role","menuitem"),U.setAttribute("tabindex","-1"),U.setAttribute("href","#"),U.setAttribute("data-i18n","dropdownPrintSummary"),U.setAttribute("data-action","print-summary");const B=r.createElement("a","lh-report-icon lh-report-icon--print");B.setAttribute("role","menuitem"),B.setAttribute("tabindex","-1"),B.setAttribute("href","#"),B.setAttribute("data-i18n","dropdownPrintExpanded"),B.setAttribute("data-action","print-expanded");const V=r.createElement("a","lh-report-icon lh-report-icon--copy");V.setAttribute("role","menuitem"),V.setAttribute("tabindex","-1"),V.setAttribute("href","#"),V.setAttribute("data-i18n","dropdownCopyJSON"),V.setAttribute("data-action","copy");const G=r.createElement("a","lh-report-icon lh-report-icon--download lh-hidden");G.setAttribute("role","menuitem"),G.setAttribute("tabindex","-1"),G.setAttribute("href","#"),G.setAttribute("data-i18n","dropdownSaveHTML"),G.setAttribute("data-action","save-html");const W=r.createElement("a","lh-report-icon lh-report-icon--download");W.setAttribute("role","menuitem"),W.setAttribute("tabindex","-1"),W.setAttribute("href","#"),W.setAttribute("data-i18n","dropdownSaveJSON"),W.setAttribute("data-action","save-json");const j=r.createElement("a","lh-report-icon lh-report-icon--open");j.setAttribute("role","menuitem"),j.setAttribute("tabindex","-1"),j.setAttribute("href","#"),j.setAttribute("data-i18n","dropdownViewer"),j.setAttribute("data-action","open-viewer");const q=r.createElement("a","lh-report-icon lh-report-icon--open");q.setAttribute("role","menuitem"),q.setAttribute("tabindex","-1"),q.setAttribute("href","#"),q.setAttribute("data-i18n","dropdownSaveGist"),q.setAttribute("data-action","save-gist");const K=r.createElement("a","lh-report-icon lh-report-icon--dark");return K.setAttribute("role","menuitem"),K.setAttribute("tabindex","-1"),K.setAttribute("href","#"),K.setAttribute("data-i18n","dropdownDarkTheme"),K.setAttribute("data-action","toggle-dark"),Z.append(" ",U," ",B," ",V," "," ",G," ",W," ",j," ",q," ",K," "),T.append(" ",I," ",P," ",Z," "),n.append(" "," ",o," ",z," ",T," "),e.append(n),e}function et(r){const e=r.createFragment(),t=r.createElement("div","lh-warnings lh-warnings--toplevel"),n=r.createElement("p","lh-warnings__msg"),o=r.createElement("ul");return t.append(" ",n," ",o," "),e.append(t),e}function tt(r,e){switch(e){case"3pFilter":return Me(r);case"audit":return Te(r);case"categoryHeader":return Fe(r);case"chevron":return Ne(r);case"clump":return De(r);case"crc":return He(r);case"crcChain":return Pe(r);case"elementScreenshot":return Re(r);case"footer":return Oe(r);case"fraction":return Ie(r);case"gauge":return $e(r);case"gaugePwa":return Ue(r);case"heading":return Be(r);case"metric":return Ve(r);case"opportunity":return Ge(r);case"opportunityHeader":return We(r);case"scorescale":return je(r);case"scoresWrapper":return qe(r);case"snippet":return Ke(r);case"snippetContent":return Je(r);case"snippetHeader":return Ye(r);case"snippetLine":return Qe(r);case"styles":return Xe(r);case"topbar":return Ze(r);case"warningsToplevel":return et(r)}throw new Error("unexpected component: "+e)}/**
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
 */class nt{constructor(e,t){this._document=e,this._lighthouseChannel="unknown",this._componentCache=new Map,this.rootEl=t}createElement(e,t){const n=this._document.createElement(e);if(t)for(const o of t.split(/\s+/))o&&n.classList.add(o);return n}createElementNS(e,t,n){const o=this._document.createElementNS(e,t);if(n)for(const i of n.split(/\s+/))i&&o.classList.add(i);return o}createFragment(){return this._document.createDocumentFragment()}createTextNode(e){return this._document.createTextNode(e)}createChildOf(e,t,n){const o=this.createElement(t,n);return e.appendChild(o),o}createComponent(e){let t=this._componentCache.get(e);if(t){const o=t.cloneNode(!0);return this.findAll("style",o).forEach(i=>i.remove()),o}return t=tt(this,e),this._componentCache.set(e,t),t.cloneNode(!0)}clearComponentCache(){this._componentCache.clear()}convertMarkdownLinkSnippets(e){const t=this.createElement("span");for(const n of u.splitMarkdownLink(e)){if(!n.isLink){t.appendChild(this._document.createTextNode(n.text));continue}const o=new URL(n.linkHref);["https://developers.google.com","https://web.dev"].includes(o.origin)&&(o.searchParams.set("utm_source","lighthouse"),o.searchParams.set("utm_medium",this._lighthouseChannel));const a=this.createElement("a");a.rel="noopener",a.target="_blank",a.textContent=n.text,this.safelySetHref(a,o.href),t.appendChild(a)}return t}safelySetHref(e,t){if(t=t||"",t.startsWith("#")){e.href=t;return}const n=["https:","http:"];let o;try{o=new URL(t)}catch{}o&&n.includes(o.protocol)&&(e.href=o.href)}safelySetBlobHref(e,t){if(t.type!=="text/html"&&t.type!=="application/json")throw new Error("Unsupported blob type");const n=URL.createObjectURL(t);e.href=n}convertMarkdownCodeSnippets(e){const t=this.createElement("span");for(const n of u.splitMarkdownCodeSpans(e))if(n.isCode){const o=this.createElement("code");o.textContent=n.text,t.appendChild(o)}else t.appendChild(this._document.createTextNode(n.text));return t}setLighthouseChannel(e){this._lighthouseChannel=e}document(){return this._document}isDevTools(){return!!this._document.querySelector(".lh-devtools")}find(e,t){const n=t.querySelector(e);if(n===null)throw new Error(`query ${e} not found`);return n}findAll(e,t){return Array.from(t.querySelectorAll(e))}fireEventOn(e,t=this._document,n){const o=new CustomEvent(e,n?{detail:n}:void 0);t.dispatchEvent(o)}saveFile(e,t){const n=e.type.match("json")?".json":".html",o=this.createElement("a");o.download=`${t}${n}`,this.safelySetBlobHref(o,e),this._document.body.appendChild(o),o.click(),this._document.body.removeChild(o),setTimeout(()=>URL.revokeObjectURL(o.href),500)}}/**
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
 */class oe{constructor(e,t){this.dom=e,this.detailsRenderer=t}get _clumpTitles(){return{warning:u.i18n.strings.warningAuditsGroupTitle,manual:u.i18n.strings.manualAuditsGroupTitle,passed:u.i18n.strings.passedAuditsGroupTitle,notApplicable:u.i18n.strings.notApplicableAuditsGroupTitle}}renderAudit(e){const t=this.dom.createComponent("audit");return this.populateAuditValues(e,t)}populateAuditValues(e,t){const n=u.i18n.strings,o=this.dom.find(".lh-audit",t);o.id=e.result.id;const i=e.result.scoreDisplayMode;e.result.displayValue&&(this.dom.find(".lh-audit__display-text",o).textContent=e.result.displayValue);const a=this.dom.find(".lh-audit__title",o);a.appendChild(this.dom.convertMarkdownCodeSnippets(e.result.title));const l=this.dom.find(".lh-audit__description",o);l.appendChild(this.dom.convertMarkdownLinkSnippets(e.result.description));for(const p of e.relevantMetrics||[]){const m=this.dom.createChildOf(l,"span","lh-audit__adorn");m.title=`Relevant to ${p.result.title}`,m.textContent=p.acronym||p.id}e.stackPacks&&e.stackPacks.forEach(p=>{const m=this.dom.createElement("div");m.classList.add("lh-audit__stackpack");const f=this.dom.createElement("img");f.classList.add("lh-audit__stackpack__img"),f.src=p.iconDataURL,f.alt=p.title,m.appendChild(f),m.appendChild(this.dom.convertMarkdownLinkSnippets(p.description)),this.dom.find(".lh-audit__stackpacks",o).appendChild(m)});const s=this.dom.find("details",o);if(e.result.details){const p=this.detailsRenderer.render(e.result.details);p&&(p.classList.add("lh-details"),s.appendChild(p))}if(this.dom.find(".lh-chevron-container",o).appendChild(this._createChevron()),this._setRatingClass(o,e.result.score,i),e.result.scoreDisplayMode==="error"){o.classList.add("lh-audit--error");const p=this.dom.find(".lh-audit__display-text",o);p.textContent=n.errorLabel,p.classList.add("lh-tooltip-boundary");const m=this.dom.createChildOf(p,"div","lh-tooltip lh-tooltip--error");m.textContent=e.result.errorMessage||n.errorMissingAuditInfo}else if(e.result.explanation){const p=this.dom.createChildOf(a,"div","lh-audit-explanation");p.textContent=e.result.explanation}const c=e.result.warnings;if(!c||c.length===0)return o;const d=this.dom.find("summary",s),h=this.dom.createChildOf(d,"div","lh-warnings");if(this.dom.createChildOf(h,"span").textContent=n.warningHeader,c.length===1)h.appendChild(this.dom.createTextNode(c.join("")));else{const p=this.dom.createChildOf(h,"ul");for(const m of c){const f=this.dom.createChildOf(p,"li");f.textContent=m}}return o}injectFinalScreenshot(e,t,n){const o=t["final-screenshot"];if(!o||o.scoreDisplayMode==="error"||!o.details||o.details.type!=="screenshot")return null;const i=this.dom.createElement("img","lh-final-ss-image"),a=o.details.data;i.src=a,i.alt=o.title;const l=this.dom.find(".lh-category .lh-category-header",e),s=this.dom.createElement("div","lh-category-headercol"),c=this.dom.createElement("div","lh-category-headercol lh-category-headercol--separator"),d=this.dom.createElement("div","lh-category-headercol");s.append(...l.childNodes),s.append(n),d.append(i),l.append(s,c,d),l.classList.add("lh-category-header__finalscreenshot")}_createChevron(){const e=this.dom.createComponent("chevron");return this.dom.find("svg.lh-chevron",e)}_setRatingClass(e,t,n){const o=u.calculateRating(t,n);return e.classList.add(`lh-audit--${n.toLowerCase()}`),n!=="informative"&&e.classList.add(`lh-audit--${o}`),e}renderCategoryHeader(e,t,n){const o=this.dom.createComponent("categoryHeader"),i=this.dom.find(".lh-score__gauge",o),a=this.renderCategoryScore(e,t,n);if(i.appendChild(a),e.description){const l=this.dom.convertMarkdownLinkSnippets(e.description);this.dom.find(".lh-category-header__description",o).appendChild(l)}return o}renderAuditGroup(e){const t=this.dom.createElement("div","lh-audit-group"),n=this.dom.createElement("div","lh-audit-group__header");this.dom.createChildOf(n,"span","lh-audit-group__title").textContent=e.title,t.appendChild(n);let o=null;return e.description&&(o=this.dom.convertMarkdownLinkSnippets(e.description),o.classList.add("lh-audit-group__description","lh-audit-group__footer"),t.appendChild(o)),[t,o]}_renderGroupedAudits(e,t){const n=new Map,o="NotAGroup";n.set(o,[]);for(const a of e){const l=a.group||o,s=n.get(l)||[];s.push(a),n.set(l,s)}const i=[];for(const[a,l]of n){if(a===o){for(const h of l)i.push(this.renderAudit(h));continue}const s=t[a],[c,d]=this.renderAuditGroup(s);for(const h of l)c.insertBefore(this.renderAudit(h),d);c.classList.add(`lh-audit-group--${a}`),i.push(c)}return i}renderUnexpandableClump(e,t){const n=this.dom.createElement("div");return this._renderGroupedAudits(e,t).forEach(i=>n.appendChild(i)),n}renderClump(e,{auditRefs:t,description:n}){const o=this.dom.createComponent("clump"),i=this.dom.find(".lh-clump",o);e==="warning"&&i.setAttribute("open","");const a=this.dom.find(".lh-audit-group__header",i),l=this._clumpTitles[e];this.dom.find(".lh-audit-group__title",a).textContent=l;const s=this.dom.find(".lh-audit-group__itemcount",i);s.textContent=`(${t.length})`;const c=t.map(this.renderAudit.bind(this));i.append(...c);const d=this.dom.find(".lh-audit-group",o);if(n){const h=this.dom.convertMarkdownLinkSnippets(n);h.classList.add("lh-audit-group__description","lh-audit-group__footer"),d.appendChild(h)}return this.dom.find(".lh-clump-toggletext--show",d).textContent=u.i18n.strings.show,this.dom.find(".lh-clump-toggletext--hide",d).textContent=u.i18n.strings.hide,i.classList.add(`lh-clump--${e.toLowerCase()}`),d}renderCategoryScore(e,t,n){let o;if(n&&u.shouldDisplayAsFraction(n.gatherMode)?o=this.renderCategoryFraction(e):o=this.renderScoreGauge(e,t),(n==null?void 0:n.omitLabel)&&this.dom.find(".lh-gauge__label,.lh-fraction__label",o).remove(),n==null?void 0:n.onPageAnchorRendered){const i=this.dom.find("a",o);n.onPageAnchorRendered(i)}return o}renderScoreGauge(e,t){const n=this.dom.createComponent("gauge"),o=this.dom.find("a.lh-gauge__wrapper",n);u.isPluginCategory(e.id)&&o.classList.add("lh-gauge__wrapper--plugin");const i=Number(e.score),a=this.dom.find(".lh-gauge",n),l=this.dom.find("circle.lh-gauge-arc",a);l&&this._setGaugeArc(l,i);const s=Math.round(i*100),c=this.dom.find("div.lh-gauge__percentage",n);return c.textContent=s.toString(),e.score===null&&(c.textContent="?",c.title=u.i18n.strings.errorLabel),e.auditRefs.length===0||this.hasApplicableAudits(e)?o.classList.add(`lh-gauge__wrapper--${u.calculateRating(e.score)}`):(o.classList.add("lh-gauge__wrapper--not-applicable"),c.textContent="-",c.title=u.i18n.strings.notApplicableAuditsGroupTitle),this.dom.find(".lh-gauge__label",n).textContent=e.title,n}renderCategoryFraction(e){const t=this.dom.createComponent("fraction"),n=this.dom.find("a.lh-fraction__wrapper",t),{numPassed:o,numPassableAudits:i,totalWeight:a}=u.calculateCategoryFraction(e),l=o/i,s=this.dom.find(".lh-fraction__content",t),c=this.dom.createElement("span");c.textContent=`${o}/${i}`,s.appendChild(c);let d=u.calculateRating(l);return a===0&&(d="null"),n.classList.add(`lh-fraction__wrapper--${d}`),this.dom.find(".lh-fraction__label",t).textContent=e.title,t}hasApplicableAudits(e){return e.auditRefs.some(t=>t.result.scoreDisplayMode!=="notApplicable")}_setGaugeArc(e,t){const n=2*Math.PI*Number(e.getAttribute("r")),o=Number(e.getAttribute("stroke-width")),i=.25*o/n;e.style.transform=`rotate(${-90+i*360}deg)`;let a=t*n-o/2;t===0&&(e.style.opacity="0"),t===1&&(a=n),e.style.strokeDasharray=`${Math.max(a,0)} ${n}`}_auditHasWarning(e){var t;return Boolean((t=e.result.warnings)==null?void 0:t.length)}_getClumpIdForAuditRef(e){const t=e.result.scoreDisplayMode;return t==="manual"||t==="notApplicable"?t:u.showAsPassed(e.result)?this._auditHasWarning(e)?"warning":"passed":"failed"}render(e,t={},n){const o=this.dom.createElement("div","lh-category");o.id=e.id,o.appendChild(this.renderCategoryHeader(e,t,n));const i=new Map;i.set("failed",[]),i.set("warning",[]),i.set("manual",[]),i.set("passed",[]),i.set("notApplicable",[]);for(const a of e.auditRefs){const l=this._getClumpIdForAuditRef(a),s=i.get(l);s.push(a),i.set(l,s)}for(const a of i.values())a.sort((l,s)=>s.weight-l.weight);for(const[a,l]of i){if(l.length===0)continue;if(a==="failed"){const d=this.renderUnexpandableClump(l,t);d.classList.add("lh-clump--failed"),o.appendChild(d);continue}const s=a==="manual"?e.manualDescription:void 0,c=this.renderClump(a,{auditRefs:l,description:s});o.appendChild(c)}return o}}/**
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
 */class ve{static initTree(e){let t=0;const n=Object.keys(e);return n.length>0&&(t=e[n[0]].request.startTime),{tree:e,startTime:t,transferSize:0}}static createSegment(e,t,n,o,i,a){const l=e[t],s=Object.keys(e),c=s.indexOf(t)===s.length-1,d=!!l.children&&Object.keys(l.children).length>0,h=Array.isArray(i)?i.slice(0):[];return typeof a!="undefined"&&h.push(!a),{node:l,isLastChild:c,hasChildren:d,startTime:n,transferSize:o+l.request.transferSize,treeMarkers:h}}static createChainNode(e,t,n){const o=e.createComponent("crcChain");e.find(".lh-crc-node",o).setAttribute("title",t.node.request.url);const i=e.find(".lh-crc-node__tree-marker",o);t.treeMarkers.forEach(c=>{c?(i.appendChild(e.createElement("span","lh-tree-marker lh-vert")),i.appendChild(e.createElement("span","lh-tree-marker"))):(i.appendChild(e.createElement("span","lh-tree-marker")),i.appendChild(e.createElement("span","lh-tree-marker")))}),t.isLastChild?(i.appendChild(e.createElement("span","lh-tree-marker lh-up-right")),i.appendChild(e.createElement("span","lh-tree-marker lh-right"))):(i.appendChild(e.createElement("span","lh-tree-marker lh-vert-right")),i.appendChild(e.createElement("span","lh-tree-marker lh-right"))),t.hasChildren?i.appendChild(e.createElement("span","lh-tree-marker lh-horiz-down")):i.appendChild(e.createElement("span","lh-tree-marker lh-right"));const a=t.node.request.url,l=n.renderTextURL(a),s=e.find(".lh-crc-node__tree-value",o);if(s.appendChild(l),!t.hasChildren){const{startTime:c,endTime:d,transferSize:h}=t.node.request,p=e.createElement("span","lh-crc-node__chain-duration");p.textContent=" - "+u.i18n.formatMilliseconds((d-c)*1e3)+", ";const m=e.createElement("span","lh-crc-node__chain-duration");m.textContent=u.i18n.formatBytesToKiB(h,.01),s.appendChild(p),s.appendChild(m)}return o}static buildTree(e,t,n,o,i,a){if(o.appendChild(Y.createChainNode(e,n,a)),n.node.children)for(const l of Object.keys(n.node.children)){const s=Y.createSegment(n.node.children,l,n.startTime,n.transferSize,n.treeMarkers,n.isLastChild);Y.buildTree(e,t,s,o,i,a)}}static render(e,t,n){const o=e.createComponent("crc"),i=e.find(".lh-crc",o);e.find(".lh-crc-initial-nav",o).textContent=u.i18n.strings.crcInitialNavigation,e.find(".lh-crc__longest_duration_label",o).textContent=u.i18n.strings.crcLongestDurationLabel,e.find(".lh-crc__longest_duration",o).textContent=u.i18n.formatMilliseconds(t.longestChain.duration);const a=Y.initTree(t.chains);for(const l of Object.keys(a.tree)){const s=Y.createSegment(a.tree,l,a.startTime,a.transferSize);Y.buildTree(e,o,s,i,t,n)}return e.find(".lh-crc-container",o)}}const Y=ve;/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */const R={ALWAYS:0,WHEN_COLLAPSED:1,WHEN_EXPANDED:2},D={CONTENT_NORMAL:0,CONTENT_HIGHLIGHTED:1,PLACEHOLDER:2,MESSAGE:3},rt={[D.CONTENT_NORMAL]:["lh-snippet__line--content"],[D.CONTENT_HIGHLIGHTED]:["lh-snippet__line--content","lh-snippet__line--content-highlighted"],[D.PLACEHOLDER]:["lh-snippet__line--placeholder"],[D.MESSAGE]:["lh-snippet__line--message"]};function _e(r,e){return{line:r.find(t=>t.lineNumber===e),previousLine:r.find(t=>t.lineNumber===e-1)}}function ot(r,e){return r.filter(t=>t.lineNumber===e)}function we(r){const e=2;return u.filterRelevantLines(r.lines,r.lineMessages,e)}class M{static renderHeader(e,t,n,o){const a=we(t).length<t.lines.length,l=e.createComponent("snippetHeader");e.find(".lh-snippet__title",l).textContent=t.title;const{snippetCollapseButtonLabel:s,snippetExpandButtonLabel:c}=u.i18n.strings;e.find(".lh-snippet__btn-label-collapse",l).textContent=s,e.find(".lh-snippet__btn-label-expand",l).textContent=c;const d=e.find(".lh-snippet__toggle-expand",l);return a?d.addEventListener("click",()=>o()):d.remove(),t.node&&e.isDevTools()&&e.find(".lh-snippet__node",l).appendChild(n.renderNode(t.node)),l}static renderSnippetLine(e,t,{content:n,lineNumber:o,truncated:i,contentType:a,visibility:l}){const s=e.createComponent("snippetLine"),c=e.find(".lh-snippet__line",s),{classList:d}=c;rt[a].forEach(m=>d.add(m)),l===R.WHEN_COLLAPSED?d.add("lh-snippet__show-if-collapsed"):l===R.WHEN_EXPANDED&&d.add("lh-snippet__show-if-expanded");const h=n+(i?"\u2026":""),p=e.find(".lh-snippet__line code",c);return a===D.MESSAGE?p.appendChild(e.convertMarkdownLinkSnippets(h)):p.textContent=h,e.find(".lh-snippet__line-number",c).textContent=o.toString(),c}static renderMessage(e,t,n){return M.renderSnippetLine(e,t,{lineNumber:" ",content:n.message,contentType:D.MESSAGE})}static renderOmittedLinesPlaceholder(e,t,n){return M.renderSnippetLine(e,t,{lineNumber:"\u2026",content:"",visibility:n,contentType:D.PLACEHOLDER})}static renderSnippetContent(e,t,n){const o=e.createComponent("snippetContent"),i=e.find(".lh-snippet__snippet-inner",o);return n.generalMessages.forEach(a=>i.append(M.renderMessage(e,t,a))),i.append(M.renderSnippetLines(e,t,n)),o}static renderSnippetLines(e,t,n){const{lineMessages:o,generalMessages:i,lineCount:a,lines:l}=n,s=we(n),c=i.length>0&&o.length===0,d=e.createFragment();let h=!1;for(let p=1;p<=a;p++){const{line:m,previousLine:f}=_e(l,p),{line:b,previousLine:v}=_e(s,p),g=!!b;if(!!v&&!g&&(h=!0),g&&h&&(d.append(M.renderOmittedLinesPlaceholder(e,t,R.WHEN_COLLAPSED)),h=!1),!m&&!!f||!m&&p===1){const E=!s.some(z=>z.lineNumber>p)||p===1;d.append(M.renderOmittedLinesPlaceholder(e,t,E?R.WHEN_EXPANDED:R.ALWAYS)),h=!1}if(!m)continue;const y=ot(o,p),k=y.length>0||c,A=Object.assign({},m,{contentType:k?D.CONTENT_HIGHLIGHTED:D.CONTENT_NORMAL,visibility:b?R.ALWAYS:R.WHEN_EXPANDED});d.append(M.renderSnippetLine(e,t,A)),y.forEach(S=>{d.append(M.renderMessage(e,t,S))})}return d}static render(e,t,n){const o=e.createComponent("snippet"),i=e.find(".lh-snippet",o),a=M.renderHeader(e,t,n,()=>i.classList.toggle("lh-snippet--expanded")),l=M.renderSnippetContent(e,o,t);return i.append(a,l),i}}/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */function it(r,e){return e.left<=r.width&&0<=e.right&&e.top<=r.height&&0<=e.bottom}function ye(r,e,t){return r<e?e:r>t?t:r}function at(r){return{x:r.left+r.width/2,y:r.top+r.height/2}}class O{static getScreenshotPositions(e,t,n){const o=at(e),i=ye(o.x-t.width/2,0,n.width-t.width),a=ye(o.y-t.height/2,0,n.height-t.height);return{screenshot:{left:i,top:a},clip:{left:e.left-i,top:e.top-a}}}static renderClipPathInScreenshot(e,t,n,o,i){const a=e.find("clipPath",t),l=`clip-${u.getUniqueSuffix()}`;a.id=l,t.style.clipPath=`url(#${l})`;const s=n.top/i.height,c=s+o.height/i.height,d=n.left/i.width,h=d+o.width/i.width,p=[`0,0             1,0            1,${s}          0,${s}`,`0,${c}     1,${c}    1,1               0,1`,`0,${s}        ${d},${s} ${d},${c} 0,${c}`,`${h},${s} 1,${s}       1,${c}       ${h},${c}`];for(const m of p){const f=e.createElementNS("http://www.w3.org/2000/svg","polygon");f.setAttribute("points",m),a.append(f)}}static installFullPageScreenshot(e,t){e.style.setProperty("--element-screenshot-url",`url('${t.data}')`)}static installOverlayFeature(e){const{dom:t,rootEl:n,overlayContainerEl:o,fullPageScreenshot:i}=e,a="lh-screenshot-overlay--enabled";n.classList.contains(a)||(n.classList.add(a),n.addEventListener("click",l=>{const s=l.target;if(!s)return;const c=s.closest(".lh-node > .lh-element-screenshot");if(!c)return;const d=t.createElement("div","lh-element-screenshot__overlay");o.append(d);const h={width:d.clientWidth*.95,height:d.clientHeight*.8},p={width:Number(c.dataset.rectWidth),height:Number(c.dataset.rectHeight),left:Number(c.dataset.rectLeft),right:Number(c.dataset.rectLeft)+Number(c.dataset.rectWidth),top:Number(c.dataset.rectTop),bottom:Number(c.dataset.rectTop)+Number(c.dataset.rectHeight)},m=O.render(t,i.screenshot,p,h);if(!m){d.remove();return}d.appendChild(m),d.addEventListener("click",()=>d.remove())}))}static _computeZoomFactor(e,t){const n=.75,o={x:t.width/e.width,y:t.height/e.height},i=n*Math.min(o.x,o.y);return Math.min(1,i)}static render(e,t,n,o){if(!it(t,n))return null;const i=e.createComponent("elementScreenshot"),a=e.find("div.lh-element-screenshot",i);a.dataset.rectWidth=n.width.toString(),a.dataset.rectHeight=n.height.toString(),a.dataset.rectLeft=n.left.toString(),a.dataset.rectTop=n.top.toString();const l=this._computeZoomFactor(n,o),s={width:o.width/l,height:o.height/l};s.width=Math.min(t.width,s.width);const c={width:s.width*l,height:s.height*l},d=O.getScreenshotPositions(n,s,{width:t.width,height:t.height}),h=e.find("div.lh-element-screenshot__content",a);h.style.top=`-${c.height}px`;const p=e.find("div.lh-element-screenshot__image",a);p.style.width=c.width+"px",p.style.height=c.height+"px",p.style.backgroundPositionY=-(d.screenshot.top*l)+"px",p.style.backgroundPositionX=-(d.screenshot.left*l)+"px",p.style.backgroundSize=`${t.width*l}px ${t.height*l}px`;const m=e.find("div.lh-element-screenshot__element-marker",a);m.style.width=n.width*l+"px",m.style.height=n.height*l+"px",m.style.left=d.clip.left*l+"px",m.style.top=d.clip.top*l+"px";const f=e.find("div.lh-element-screenshot__mask",a);return f.style.width=c.width+"px",f.style.height=c.height+"px",O.renderClipPathInScreenshot(e,f,d.clip,n,s),a}}/**
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
 */const lt=["http://","https://","data:"];class st{constructor(e,t={}){this._dom=e,this._fullPageScreenshot=t.fullPageScreenshot}render(e){switch(e.type){case"filmstrip":return this._renderFilmstrip(e);case"list":return this._renderList(e);case"table":return this._renderTable(e);case"criticalrequestchain":return ve.render(this._dom,e,this);case"opportunity":return this._renderTable(e);case"screenshot":case"debugdata":case"full-page-screenshot":case"treemap-data":return null;default:return this._renderUnknown(e.type,e)}}_renderBytes(e){const t=u.i18n.formatBytesToKiB(e.value,e.granularity),n=this._renderText(t);return n.title=u.i18n.formatBytes(e.value),n}_renderMilliseconds(e){let t=u.i18n.formatMilliseconds(e.value,e.granularity);return e.displayUnit==="duration"&&(t=u.i18n.formatDuration(e.value)),this._renderText(t)}renderTextURL(e){const t=e;let n,o,i;try{const l=u.parseURL(t);n=l.file==="/"?l.origin:l.file,o=l.file==="/"||l.hostname===""?"":`(${l.hostname})`,i=t}catch{n=t}const a=this._dom.createElement("div","lh-text__url");if(a.appendChild(this._renderLink({text:n,url:t})),o){const l=this._renderText(o);l.classList.add("lh-text__url-host"),a.appendChild(l)}return i&&(a.title=t,a.dataset.url=t),a}_renderLink(e){const t=this._dom.createElement("a");if(this._dom.safelySetHref(t,e.url),!t.href){const n=this._renderText(e.text);return n.classList.add("lh-link"),n}return t.rel="noopener",t.target="_blank",t.textContent=e.text,t.classList.add("lh-link"),t}_renderText(e){const t=this._dom.createElement("div","lh-text");return t.textContent=e,t}_renderNumeric(e){const t=u.i18n.formatNumber(e.value,e.granularity),n=this._dom.createElement("div","lh-numeric");return n.textContent=t,n}_renderThumbnail(e){const t=this._dom.createElement("img","lh-thumbnail"),n=e;return t.src=n,t.title=n,t.alt="",t}_renderUnknown(e,t){console.error(`Unknown details type: ${e}`,t);const n=this._dom.createElement("details","lh-unknown");return this._dom.createChildOf(n,"summary").textContent=`We don't know how to render audit details of type \`${e}\`. The Lighthouse version that collected this data is likely newer than the Lighthouse version of the report renderer. Expand for the raw JSON.`,this._dom.createChildOf(n,"pre").textContent=JSON.stringify(t,null,2),n}_renderTableValue(e,t){if(e==null)return null;if(typeof e=="object")switch(e.type){case"code":return this._renderCode(e.value);case"link":return this._renderLink(e);case"node":return this.renderNode(e);case"numeric":return this._renderNumeric(e);case"source-location":return this.renderSourceLocation(e);case"url":return this.renderTextURL(e.value);default:return this._renderUnknown(e.type,e)}switch(t.valueType){case"bytes":{const n=Number(e);return this._renderBytes({value:n,granularity:t.granularity})}case"code":{const n=String(e);return this._renderCode(n)}case"ms":{const n={value:Number(e),granularity:t.granularity,displayUnit:t.displayUnit};return this._renderMilliseconds(n)}case"numeric":{const n=Number(e);return this._renderNumeric({value:n,granularity:t.granularity})}case"text":{const n=String(e);return this._renderText(n)}case"thumbnail":{const n=String(e);return this._renderThumbnail(n)}case"timespanMs":{const n=Number(e);return this._renderMilliseconds({value:n})}case"url":{const n=String(e);return lt.some(o=>n.startsWith(o))?this.renderTextURL(n):this._renderCode(n)}default:return this._renderUnknown(t.valueType,e)}}_getCanonicalizedHeadingsFromTable(e){return e.type==="opportunity"?e.headings:e.headings.map(t=>this._getCanonicalizedHeading(t))}_getCanonicalizedHeading(e){let t;return e.subItemsHeading&&(t=this._getCanonicalizedsubItemsHeading(e.subItemsHeading,e)),{key:e.key,valueType:e.itemType,subItemsHeading:t,label:e.text,displayUnit:e.displayUnit,granularity:e.granularity}}_getCanonicalizedsubItemsHeading(e,t){return e.key||console.warn("key should not be null"),{key:e.key||"",valueType:e.itemType||t.itemType,granularity:e.granularity||t.granularity,displayUnit:e.displayUnit||t.displayUnit}}_getDerivedsubItemsHeading(e){return e.subItemsHeading?{key:e.subItemsHeading.key||"",valueType:e.subItemsHeading.valueType||e.valueType,granularity:e.subItemsHeading.granularity||e.granularity,displayUnit:e.subItemsHeading.displayUnit||e.displayUnit,label:""}:null}_renderTableRow(e,t){const n=this._dom.createElement("tr");for(const o of t){if(!o||!o.key){this._dom.createChildOf(n,"td","lh-table-column--empty");continue}const i=e[o.key];let a;if(i!=null&&(a=this._renderTableValue(i,o)),a){const l=`lh-table-column--${o.valueType}`;this._dom.createChildOf(n,"td",l).appendChild(a)}else this._dom.createChildOf(n,"td","lh-table-column--empty")}return n}_renderTableRowsFromItem(e,t){const n=this._dom.createFragment();if(n.append(this._renderTableRow(e,t)),!e.subItems)return n;const o=t.map(this._getDerivedsubItemsHeading);if(!o.some(Boolean))return n;for(const i of e.subItems.items){const a=this._renderTableRow(i,o);a.classList.add("lh-sub-item-row"),n.append(a)}return n}_renderTable(e){if(!e.items.length)return this._dom.createElement("span");const t=this._dom.createElement("table","lh-table"),n=this._dom.createChildOf(t,"thead"),o=this._dom.createChildOf(n,"tr"),i=this._getCanonicalizedHeadingsFromTable(e);for(const s of i){const d=`lh-table-column--${s.valueType||"text"}`,h=this._dom.createElement("div","lh-text");h.textContent=s.label,this._dom.createChildOf(o,"th",d).appendChild(h)}const a=this._dom.createChildOf(t,"tbody");let l=!0;for(const s of e.items){const c=this._renderTableRowsFromItem(s,i);for(const d of this._dom.findAll("tr",c))d.classList.add(l?"lh-row--even":"lh-row--odd");l=!l,a.append(c)}return t}_renderList(e){const t=this._dom.createElement("div","lh-list");return e.items.forEach(n=>{const o=M.render(this._dom,n,this);t.appendChild(o)}),t}renderNode(e){const t=this._dom.createElement("span","lh-node");if(e.nodeLabel){const a=this._dom.createElement("div");a.textContent=e.nodeLabel,t.appendChild(a)}if(e.snippet){const a=this._dom.createElement("div");a.classList.add("lh-node__snippet"),a.textContent=e.snippet,t.appendChild(a)}if(e.selector&&(t.title=e.selector),e.path&&t.setAttribute("data-path",e.path),e.selector&&t.setAttribute("data-selector",e.selector),e.snippet&&t.setAttribute("data-snippet",e.snippet),!this._fullPageScreenshot)return t;const n=e.lhId&&this._fullPageScreenshot.nodes[e.lhId];if(!n||n.width===0||n.height===0)return t;const o={width:147,height:100},i=O.render(this._dom,this._fullPageScreenshot.screenshot,n,o);return i&&t.prepend(i),t}renderSourceLocation(e){if(!e.url)return null;const t=`${e.url}:${e.line+1}:${e.column}`;let n;e.original&&(n=`${e.original.file||"<unmapped>"}:${e.original.line+1}:${e.original.column}`);let o;if(e.urlProvider==="network"&&n)o=this._renderLink({url:e.url,text:n}),o.title=`maps to generated location ${t}`;else if(e.urlProvider==="network"&&!n)o=this.renderTextURL(e.url),this._dom.find(".lh-link",o).textContent+=`:${e.line+1}:${e.column}`;else if(e.urlProvider==="comment"&&n)o=this._renderText(`${n} (from source map)`),o.title=`${t} (from sourceURL)`;else if(e.urlProvider==="comment"&&!n)o=this._renderText(`${t} (from sourceURL)`);else return null;return o.classList.add("lh-source-location"),o.setAttribute("data-source-url",e.url),o.setAttribute("data-source-line",String(e.line)),o.setAttribute("data-source-column",String(e.column)),o}_renderFilmstrip(e){const t=this._dom.createElement("div","lh-filmstrip");for(const n of e.items){const o=this._dom.createChildOf(t,"div","lh-filmstrip__frame"),i=this._dom.createChildOf(o,"img","lh-filmstrip__thumbnail");i.src=n.data,i.alt="Screenshot"}return t}_renderCode(e){const t=this._dom.createElement("pre","lh-code");return t.textContent=e,t}}/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */const Q="\xA0",ie=1024,ct=ie*ie;class dt{constructor(e,t){e==="en-XA"&&(e="de"),this._numberDateLocale=e,this._numberFormatter=new Intl.NumberFormat(e),this._percentFormatter=new Intl.NumberFormat(e,{style:"percent"}),this._strings=t}get strings(){return this._strings}formatNumber(e,t=.1){const n=Math.round(e/t)*t;return this._numberFormatter.format(n)}formatPercent(e){return this._percentFormatter.format(e)}formatBytesToKiB(e,t=.1){return`${this._byteFormatterForGranularity(t).format(Math.round(e/1024/t)*t)}${Q}KiB`}formatBytesToMiB(e,t=.1){return`${this._byteFormatterForGranularity(t).format(Math.round(e/1024**2/t)*t)}${Q}MiB`}formatBytes(e,t=1){return`${this._byteFormatterForGranularity(t).format(Math.round(e/t)*t)}${Q}bytes`}formatBytesWithBestUnit(e,t=.1){return e>=ct?this.formatBytesToMiB(e,t):e>=ie?this.formatBytesToKiB(e,t):this.formatNumber(e,t)+"\xA0B"}_byteFormatterForGranularity(e){let t=0;return e<1&&(t=-Math.floor(Math.log10(e))),new Intl.NumberFormat(this._numberDateLocale,ge(ee({},this._numberFormatter.resolvedOptions()),{maximumFractionDigits:t,minimumFractionDigits:t}))}formatMilliseconds(e,t=10){const n=Math.round(e/t)*t;return n===0?`${this._numberFormatter.format(0)}${Q}ms`:`${this._numberFormatter.format(n)}${Q}ms`}formatSeconds(e,t=.1){const n=Math.round(e/1e3/t)*t;return`${this._numberFormatter.format(n)}${Q}s`}formatDateTime(e){const t={month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"numeric",timeZoneName:"short"};let n;try{n=new Intl.DateTimeFormat(this._numberDateLocale,t)}catch{t.timeZone="UTC",n=new Intl.DateTimeFormat(this._numberDateLocale,t)}return n.format(new Date(e))}formatDuration(e){let t=e/1e3;if(Math.round(t)===0)return"None";const n=[],o={d:60*60*24,h:60*60,m:60,s:1};return Object.keys(o).forEach(i=>{const a=o[i],l=Math.floor(t/a);l>0&&(t-=l*a,n.push(`${l}\xA0${i}`))}),n.join(" ")}}/**
 * @license
 * Copyright 2018 The Lighthouse Authors. All Rights Reserved.
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
 */class pt extends oe{_renderMetric(e){const t=this.dom.createComponent("metric"),n=this.dom.find(".lh-metric",t);n.id=e.result.id;const o=u.calculateRating(e.result.score,e.result.scoreDisplayMode);n.classList.add(`lh-metric--${o}`);const i=this.dom.find(".lh-metric__title",t);i.textContent=e.result.title;const a=this.dom.find(".lh-metric__value",t);a.textContent=e.result.displayValue||"";const l=this.dom.find(".lh-metric__description",t);if(l.appendChild(this.dom.convertMarkdownLinkSnippets(e.result.description)),e.result.scoreDisplayMode==="error"){l.textContent="",a.textContent="Error!";const s=this.dom.createChildOf(l,"span");s.textContent=e.result.errorMessage||"Report error: no metric information"}return n}_renderOpportunity(e,t){const n=this.dom.createComponent("opportunity"),o=this.populateAuditValues(e,n);if(o.id=e.result.id,!e.result.details||e.result.scoreDisplayMode==="error")return o;const i=e.result.details;if(i.type!=="opportunity")return o;const a=this.dom.find("span.lh-audit__display-text, div.lh-audit__display-text",o),l=`${i.overallSavingsMs/t*100}%`;if(this.dom.find("div.lh-sparkline__bar",o).style.width=l,a.textContent=u.i18n.formatSeconds(i.overallSavingsMs,.01),e.result.displayValue){const s=e.result.displayValue;this.dom.find("div.lh-load-opportunity__sparkline",o).title=s,a.title=s}return o}_getWastedMs(e){if(e.result.details&&e.result.details.type==="opportunity"){const t=e.result.details;if(typeof t.overallSavingsMs!="number")throw new Error("non-opportunity details passed to _getWastedMs");return t.overallSavingsMs}else return Number.MIN_VALUE}_getScoringCalculatorHref(e){const t=e.filter(d=>d.group==="metrics"),n=e.find(d=>d.id==="first-cpu-idle"),o=e.find(d=>d.id==="first-meaningful-paint");n&&t.push(n),o&&t.push(o);const i=d=>Math.round(d*100)/100,l=[...t.map(d=>{let h;return typeof d.result.numericValue=="number"?(h=d.id==="cumulative-layout-shift"?i(d.result.numericValue):Math.round(d.result.numericValue),h=h.toString()):h="null",[d.acronym||d.id,h]})];u.reportJson&&(l.push(["device",u.reportJson.configSettings.formFactor]),l.push(["version",u.reportJson.lighthouseVersion]));const s=new URLSearchParams(l),c=new URL("https://googlechrome.github.io/lighthouse/scorecalc/");return c.hash=s.toString(),c.href}_classifyPerformanceAudit(e){return e.group?null:e.result.details&&e.result.details.type==="opportunity"?"load-opportunity":"diagnostic"}render(e,t,n){const o=u.i18n.strings,i=this.dom.createElement("div","lh-category");i.id=e.id,i.appendChild(this.renderCategoryHeader(e,t,n));const a=e.auditRefs.filter(g=>g.group==="metrics");if(a.length){const[g,_]=this.renderAuditGroup(t.metrics),w=this.dom.createElement("input","lh-metrics-toggle__input"),C=`lh-metrics-toggle${u.getUniqueSuffix()}`;w.setAttribute("aria-label","Toggle the display of metric descriptions"),w.type="checkbox",w.id=C,g.prepend(w);const y=this.dom.find(".lh-audit-group__header",g),k=this.dom.createChildOf(y,"label","lh-metrics-toggle__label");k.htmlFor=C;const A=this.dom.createChildOf(k,"span","lh-metrics-toggle__labeltext--show"),S=this.dom.createChildOf(k,"span","lh-metrics-toggle__labeltext--hide");A.textContent=u.i18n.strings.expandView,S.textContent=u.i18n.strings.collapseView;const E=this.dom.createElement("div","lh-metrics-container");g.insertBefore(E,_),a.forEach(H=>{E.appendChild(this._renderMetric(H))});const z=this.dom.find(".lh-category-header__description",i),T=this.dom.createChildOf(z,"div","lh-metrics__disclaimer"),I=this.dom.convertMarkdownLinkSnippets(o.varianceDisclaimer);T.appendChild(I);const L=this.dom.createChildOf(T,"a","lh-calclink");L.target="_blank",L.textContent=o.calculatorLink,this.dom.safelySetHref(L,this._getScoringCalculatorHref(e.auditRefs)),g.classList.add("lh-audit-group--metrics"),i.appendChild(g)}const l=this.dom.createChildOf(i,"div","lh-filmstrip-container"),s=e.auditRefs.find(g=>g.id==="screenshot-thumbnails"),c=s==null?void 0:s.result;if(c==null?void 0:c.details){l.id=c.id;const g=this.detailsRenderer.render(c.details);g&&l.appendChild(g)}const d=e.auditRefs.filter(g=>this._classifyPerformanceAudit(g)==="load-opportunity").filter(g=>!u.showAsPassed(g.result)).sort((g,_)=>this._getWastedMs(_)-this._getWastedMs(g)),h=a.filter(g=>!!g.relevantAudits);if(h.length&&this.renderMetricAuditFilter(h,i),d.length){const g=2e3,_=d.map(E=>this._getWastedMs(E)),w=Math.max(..._),C=Math.max(Math.ceil(w/1e3)*1e3,g),[y,k]=this.renderAuditGroup(t["load-opportunities"]),A=this.dom.createComponent("opportunityHeader");this.dom.find(".lh-load-opportunity__col--one",A).textContent=o.opportunityResourceColumnLabel,this.dom.find(".lh-load-opportunity__col--two",A).textContent=o.opportunitySavingsColumnLabel;const S=this.dom.find(".lh-load-opportunity__header",A);y.insertBefore(S,k),d.forEach(E=>y.insertBefore(this._renderOpportunity(E,C),k)),y.classList.add("lh-audit-group--load-opportunities"),i.appendChild(y)}const p=e.auditRefs.filter(g=>this._classifyPerformanceAudit(g)==="diagnostic").filter(g=>!u.showAsPassed(g.result)).sort((g,_)=>{const w=g.result.scoreDisplayMode==="informative"?100:Number(g.result.score),C=_.result.scoreDisplayMode==="informative"?100:Number(_.result.score);return w-C});if(p.length){const[g,_]=this.renderAuditGroup(t.diagnostics);p.forEach(w=>g.insertBefore(this.renderAudit(w),_)),g.classList.add("lh-audit-group--diagnostics"),i.appendChild(g)}const m=e.auditRefs.filter(g=>this._classifyPerformanceAudit(g)&&u.showAsPassed(g.result));if(!m.length)return i;const f={auditRefs:m,groupDefinitions:t},b=this.renderClump("passed",f);i.appendChild(b);const v=[];if(["performance-budget","timing-budget"].forEach(g=>{const _=e.auditRefs.find(w=>w.id===g);if(_==null?void 0:_.result.details){const w=this.detailsRenderer.render(_.result.details);w&&(w.id=g,w.classList.add("lh-details","lh-details--budget","lh-audit"),v.push(w))}}),v.length>0){const[g,_]=this.renderAuditGroup(t.budgets);v.forEach(w=>g.insertBefore(w,_)),g.classList.add("lh-audit-group--budgets"),i.appendChild(g)}return i}renderMetricAuditFilter(e,t){var l;const n=this.dom.createElement("div","lh-metricfilter"),o=this.dom.createChildOf(n,"span","lh-metricfilter__text");o.textContent=u.i18n.strings.showRelevantAudits;const i=[{acronym:"All"},...e],a=u.getUniqueSuffix();for(const s of i){const c=`metric-${s.acronym}-${a}`,d=this.dom.createChildOf(n,"input","lh-metricfilter__radio");d.type="radio",d.name=`metricsfilter-${a}`,d.id=c;const h=this.dom.createChildOf(n,"label","lh-metricfilter__label");h.htmlFor=c,h.title=(l=s.result)==null?void 0:l.title,h.textContent=s.acronym||s.id,s.acronym==="All"&&(d.checked=!0,h.classList.add("lh-metricfilter__label--active")),t.append(n),d.addEventListener("input",p=>{for(const f of t.querySelectorAll("label.lh-metricfilter__label"))f.classList.toggle("lh-metricfilter__label--active",f.htmlFor===c);t.classList.toggle("lh-category--filtered",s.acronym!=="All");for(const f of t.querySelectorAll("div.lh-audit")){if(s.acronym==="All"){f.hidden=!1;continue}f.hidden=!0,s.relevantAudits&&s.relevantAudits.includes(f.id)&&(f.hidden=!1)}const m=t.querySelectorAll("div.lh-audit-group, details.lh-audit-group");for(const f of m){f.hidden=!1;const b=Array.from(f.querySelectorAll("div.lh-audit")),v=!!b.length&&b.every(g=>g.hidden);f.hidden=v}})}}}/**
 * @license
 * Copyright 2018 The Lighthouse Authors. All Rights Reserved.
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
 */class ae extends oe{render(e,t={}){const n=this.dom.createElement("div","lh-category");n.id=e.id,n.appendChild(this.renderCategoryHeader(e,t));const o=e.auditRefs,i=o.filter(c=>c.result.scoreDisplayMode!=="manual"),a=this._renderAudits(i,t);n.appendChild(a);const l=o.filter(c=>c.result.scoreDisplayMode==="manual"),s=this.renderClump("manual",{auditRefs:l,description:e.manualDescription});return n.appendChild(s),n}renderCategoryScore(e,t){if(e.score===null)return super.renderScoreGauge(e,t);const n=this.dom.createComponent("gaugePwa"),o=this.dom.find("a.lh-gauge--pwa__wrapper",n),i=n.querySelector("svg");if(!i)throw new Error("no SVG element found in PWA score gauge template");ae._makeSvgReferencesUnique(i);const a=this._getGroupIds(e.auditRefs),l=this._getPassingGroupIds(e.auditRefs);if(l.size===a.size)o.classList.add("lh-badged--all");else for(const s of l)o.classList.add(`lh-badged--${s}`);return this.dom.find(".lh-gauge__label",n).textContent=e.title,o.title=this._getGaugeTooltip(e.auditRefs,t),n}_getGroupIds(e){const t=e.map(n=>n.group).filter(n=>!!n);return new Set(t)}_getPassingGroupIds(e){const t=this._getGroupIds(e);for(const n of e)!u.showAsPassed(n.result)&&n.group&&t.delete(n.group);return t}_getGaugeTooltip(e,t){const n=this._getGroupIds(e),o=[];for(const i of n){const a=e.filter(d=>d.group===i),l=a.length,s=a.filter(d=>u.showAsPassed(d.result)).length,c=t[i].title;o.push(`${c}: ${s}/${l}`)}return o.join(", ")}_renderAudits(e,t){const n=this.renderUnexpandableClump(e,t),o=this._getPassingGroupIds(e);for(const i of o)this.dom.find(`.lh-audit-group--${i}`,n).classList.add("lh-badged");return n}static _makeSvgReferencesUnique(e){const t=e.querySelector("defs");if(!t)return;const n=u.getUniqueSuffix(),o=t.querySelectorAll("[id]");for(const i of o){const a=i.id,l=`${a}-${n}`;i.id=l;const s=e.querySelectorAll(`use[href="#${a}"]`);for(const d of s)d.setAttribute("href",`#${l}`);const c=e.querySelectorAll(`[fill="url(#${a})"]`);for(const d of c)d.setAttribute("fill",`url(#${l})`)}}}/**
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
 *
 * Dummy text for ensuring report robustness: <\/script> pre$`post %%LIGHTHOUSE_JSON%%
 * (this is handled by terser)
 */class ht{constructor(e){this._dom=e,this._opts={}}renderReport(e,t,n){if(!this._dom.rootEl&&t){console.warn("Please adopt the new report API in renderer/api.js.");const i=t.closest(".lh-root");i?this._dom.rootEl=i:(t.classList.add("lh-root","lh-vars"),this._dom.rootEl=t)}else this._dom.rootEl&&t&&(this._dom.rootEl=t);n&&(this._opts=n),this._dom.setLighthouseChannel(e.configSettings.channel||"unknown");const o=u.prepareReportResult(e);return this._dom.rootEl.textContent="",this._dom.rootEl.appendChild(this._renderReport(o)),this._dom.rootEl}_renderReportTopbar(e){const t=this._dom.createComponent("topbar"),n=this._dom.find("a.lh-topbar__url",t);return n.textContent=e.finalUrl,n.title=e.finalUrl,this._dom.safelySetHref(n,e.finalUrl),t}_renderReportHeader(){const e=this._dom.createComponent("heading"),t=this._dom.createComponent("scoresWrapper");return this._dom.find(".lh-scores-wrapper-placeholder",e).replaceWith(t),e}_renderReportFooter(e){const t=this._dom.createComponent("footer");return this._renderMetaBlock(e,t),this._dom.find(".lh-footer__version_issue",t).textContent=u.i18n.strings.footerIssue,this._dom.find(".lh-footer__version",t).textContent=e.lighthouseVersion,t}_renderMetaBlock(e,t){var h;const n=u.getEmulationDescriptions(e.configSettings||{}),o=e.userAgent.match(/(\w*Chrome\/[\d.]+)/),i=Array.isArray(o)?o[1].replace("/"," ").replace("Chrome","Chromium"):"Chromium",a=e.configSettings.channel,l=e.environment.benchmarkIndex.toFixed(0),s=(h=e.environment.credits)==null?void 0:h["axe-core"],c=[["date",`Captured at ${u.i18n.formatDateTime(e.fetchTime)}`],["devices",`${n.deviceEmulation} with Lighthouse ${e.lighthouseVersion}`,`${u.i18n.strings.runtimeSettingsBenchmark}: ${l}
${u.i18n.strings.runtimeSettingsCPUThrottling}: ${n.cpuThrottling}`+(s?`
${u.i18n.strings.runtimeSettingsAxeVersion}: ${s}`:"")],["samples-one",u.i18n.strings.runtimeSingleLoad,u.i18n.strings.runtimeSingleLoadTooltip],["stopwatch",u.i18n.strings.runtimeAnalysisWindow],["networkspeed",`${n.summary}`,`${u.i18n.strings.runtimeSettingsNetworkThrottling}: ${n.networkThrottling}`],["chrome",`Using ${i}`+(a?` with ${a}`:""),`${u.i18n.strings.runtimeSettingsUANetwork}: "${e.environment.networkUserAgent}"`]],d=this._dom.find(".lh-meta__items",t);for(const[p,m,f]of c){const b=this._dom.createChildOf(d,"li","lh-meta__item");if(b.textContent=m,f){b.classList.add("lh-tooltip-boundary");const v=this._dom.createChildOf(b,"div","lh-tooltip");v.textContent=f}b.classList.add("lh-report-icon",`lh-report-icon--${p}`)}}_renderReportWarnings(e){if(!e.runWarnings||e.runWarnings.length===0)return this._dom.createElement("div");const t=this._dom.createComponent("warningsToplevel"),n=this._dom.find(".lh-warnings__msg",t);n.textContent=u.i18n.strings.toplevelWarningsMessage;const o=this._dom.find("ul",t);for(const i of e.runWarnings)o.appendChild(this._dom.createElement("li")).appendChild(this._dom.convertMarkdownLinkSnippets(i));return t}_renderScoreGauges(e,t,n){var l,s;const o=[],i=[],a=[];for(const c of Object.values(e.categories)){const d=n[c.id]||t,h=d.renderCategoryScore(c,e.categoryGroups||{},{gatherMode:e.gatherMode}),p=this._dom.find("a.lh-gauge__wrapper, a.lh-fraction__wrapper",h);p&&(this._dom.safelySetHref(p,`#${c.id}`),p.addEventListener("click",m=>{if(!p.matches('[href^="#"]'))return;const f=p.getAttribute("href"),b=this._dom.rootEl;if(!f||!b)return;const v=this._dom.find(f,b);m.preventDefault(),v.scrollIntoView()}),(s=(l=this._opts).onPageAnchorRendered)==null||s.call(l,p)),u.isPluginCategory(c.id)?a.push(h):d.renderCategoryScore===t.renderCategoryScore?o.push(h):i.push(h)}return[...o,...i,...a]}_renderReport(e){var v;const t=new dt(e.configSettings.locale,ee(ee({},u.UIStrings),e.i18n.rendererFormattedStrings));u.i18n=t,u.reportJson=e;const n=((v=e.audits["full-page-screenshot"])==null?void 0:v.details)&&e.audits["full-page-screenshot"].details.type==="full-page-screenshot"?e.audits["full-page-screenshot"].details:void 0,o=new st(this._dom,{fullPageScreenshot:n}),i=new oe(this._dom,o),a={performance:new pt(this._dom,o),pwa:new ae(this._dom,o)},l=this._dom.createElement("div");l.appendChild(this._renderReportHeader());const s=this._dom.createElement("div","lh-container"),c=this._dom.createElement("div","lh-report");c.appendChild(this._renderReportWarnings(e));let d;Object.keys(e.categories).length===1?l.classList.add("lh-header--solo-category"):d=this._dom.createElement("div","lh-scores-header");const p=this._dom.createElement("div");if(p.classList.add("lh-scorescale-wrap"),p.append(this._dom.createComponent("scorescale")),d){const g=this._dom.find(".lh-scores-container",l);d.append(...this._renderScoreGauges(e,i,a)),g.appendChild(d),g.appendChild(p);const _=this._dom.createElement("div","lh-sticky-header");_.append(...this._renderScoreGauges(e,i,a)),s.appendChild(_)}const m=c.appendChild(this._dom.createElement("div","lh-categories")),f={gatherMode:e.gatherMode};for(const g of Object.values(e.categories)){const _=a[g.id]||i;_.dom.createChildOf(m,"div","lh-category-wrapper").appendChild(_.render(g,e.categoryGroups,f))}i.injectFinalScreenshot(m,e.audits,p);const b=this._dom.createFragment();return this._opts.omitGlobalStyles||b.append(this._dom.createComponent("styles")),this._opts.omitTopbar||b.appendChild(this._renderReportTopbar(e)),b.appendChild(s),s.appendChild(l),s.appendChild(c),c.appendChild(this._renderReportFooter(e)),n&&O.installFullPageScreenshot(this._dom.rootEl,n.screenshot),b}}/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */function le(r,e){const t=r.rootEl;typeof e=="undefined"?t.classList.toggle("lh-dark"):t.classList.toggle("lh-dark",e)}/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */const ut=typeof btoa!="undefined"?btoa:r=>Buffer.from(r).toString("base64"),gt=typeof atob!="undefined"?atob:r=>Buffer.from(r,"base64").toString();async function mt(r,e){let t=new TextEncoder().encode(r);if(e.gzip)if(typeof CompressionStream!="undefined"){const i=new CompressionStream("gzip"),a=i.writable.getWriter();a.write(t),a.close();const l=await new Response(i.readable).arrayBuffer();t=new Uint8Array(l)}else t=window.pako.gzip(r);let n="";const o=5e3;for(let i=0;i<t.length;i+=o)n+=String.fromCharCode(...t.subarray(i,i+o));return ut(n)}function ft(r,e){const t=gt(r),n=Uint8Array.from(t,o=>o.charCodeAt(0));return e.gzip?window.pako.ungzip(n,{to:"string"}):new TextDecoder().decode(n)}const bt={toBase64:mt,fromBase64:ft};/**
 * @license
 * Copyright 2021 The Lighthouse Authors. All Rights Reserved.
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
 */function se(){const r=window.location.host.endsWith(".vercel.app"),e=new URLSearchParams(window.location.search).has("dev");return r?`https://${window.location.host}/gh-pages`:e?"http://localhost:8000":"https://googlechrome.github.io/lighthouse"}function ce(r){const e=r.generatedTime,t=r.fetchTime||e;return`${r.lighthouseVersion}-${r.requestedUrl}-${t}`}function vt(r,e,t){const n=new URL(e).origin;window.addEventListener("message",function i(a){a.origin===n&&o&&a.data.opened&&(o.postMessage(r,n),window.removeEventListener("message",i))});const o=window.open(e,t)}async function xe(r,e,t){const n=new URL(e),o=Boolean(window.CompressionStream);n.hash=await bt.toBase64(JSON.stringify(r),{gzip:o}),o&&n.searchParams.set("gzip","1"),window.open(n.toString(),t)}async function _t(r){const e="viewer-"+ce(r),t=se()+"/viewer/";await xe({lhr:r},t,e)}async function wt(r){const e="viewer-"+ce(r),t=se()+"/viewer/";vt({lhr:r},t,e)}function yt(r){if(!r.audits["script-treemap-data"].details)throw new Error("no script treemap data found");const t={lhr:{requestedUrl:r.requestedUrl,finalUrl:r.finalUrl,audits:{"script-treemap-data":r.audits["script-treemap-data"]},configSettings:{locale:r.configSettings.locale}}},n=se()+"/treemap/",o="treemap-"+ce(r);xe(t,n,o)}/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */class xt{constructor(e){this._dom=e,this._toggleEl,this._menuEl,this.onDocumentKeyDown=this.onDocumentKeyDown.bind(this),this.onToggleClick=this.onToggleClick.bind(this),this.onToggleKeydown=this.onToggleKeydown.bind(this),this.onMenuFocusOut=this.onMenuFocusOut.bind(this),this.onMenuKeydown=this.onMenuKeydown.bind(this),this._getNextMenuItem=this._getNextMenuItem.bind(this),this._getNextSelectableNode=this._getNextSelectableNode.bind(this),this._getPreviousMenuItem=this._getPreviousMenuItem.bind(this)}setup(e){this._toggleEl=this._dom.find(".lh-topbar button.lh-tools__button",this._dom.rootEl),this._toggleEl.addEventListener("click",this.onToggleClick),this._toggleEl.addEventListener("keydown",this.onToggleKeydown),this._menuEl=this._dom.find(".lh-topbar div.lh-tools__dropdown",this._dom.rootEl),this._menuEl.addEventListener("keydown",this.onMenuKeydown),this._menuEl.addEventListener("click",e)}close(){this._toggleEl.classList.remove("lh-active"),this._toggleEl.setAttribute("aria-expanded","false"),this._menuEl.contains(this._dom.document().activeElement)&&this._toggleEl.focus(),this._menuEl.removeEventListener("focusout",this.onMenuFocusOut),this._dom.document().removeEventListener("keydown",this.onDocumentKeyDown)}open(e){this._toggleEl.classList.contains("lh-active")?e.focus():this._menuEl.addEventListener("transitionend",()=>{e.focus()},{once:!0}),this._toggleEl.classList.add("lh-active"),this._toggleEl.setAttribute("aria-expanded","true"),this._menuEl.addEventListener("focusout",this.onMenuFocusOut),this._dom.document().addEventListener("keydown",this.onDocumentKeyDown)}onToggleClick(e){e.preventDefault(),e.stopImmediatePropagation(),this._toggleEl.classList.contains("lh-active")?this.close():this.open(this._getNextMenuItem())}onToggleKeydown(e){switch(e.code){case"ArrowUp":e.preventDefault(),this.open(this._getPreviousMenuItem());break;case"ArrowDown":case"Enter":case" ":e.preventDefault(),this.open(this._getNextMenuItem());break}}onMenuKeydown(e){const t=e.target;switch(e.code){case"ArrowUp":e.preventDefault(),this._getPreviousMenuItem(t).focus();break;case"ArrowDown":e.preventDefault(),this._getNextMenuItem(t).focus();break;case"Home":e.preventDefault(),this._getNextMenuItem().focus();break;case"End":e.preventDefault(),this._getPreviousMenuItem().focus();break}}onDocumentKeyDown(e){e.keyCode===27&&this.close()}onMenuFocusOut(e){const t=e.relatedTarget;this._menuEl.contains(t)||this.close()}_getNextSelectableNode(e,t){const n=e.filter(i=>!(!(i instanceof HTMLElement)||i.hasAttribute("disabled")||window.getComputedStyle(i).display==="none"));let o=t?n.indexOf(t)+1:0;return o>=n.length&&(o=0),n[o]}_getNextMenuItem(e){const t=Array.from(this._menuEl.childNodes);return this._getNextSelectableNode(t,e)}_getPreviousMenuItem(e){const t=Array.from(this._menuEl.childNodes).reverse();return this._getNextSelectableNode(t,e)}}/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */class Et{constructor(e,t){this.lhr,this._reportUIFeatures=e,this._dom=t,this._dropDownMenu=new xt(this._dom),this._copyAttempt=!1,this.topbarEl,this.categoriesEl,this.stickyHeaderEl,this.highlightEl,this.onDropDownMenuClick=this.onDropDownMenuClick.bind(this),this.onKeyUp=this.onKeyUp.bind(this),this.onCopy=this.onCopy.bind(this),this.collapseAllDetails=this.collapseAllDetails.bind(this)}enable(e){this.lhr=e,this._dom.rootEl.addEventListener("keyup",this.onKeyUp),this._dom.document().addEventListener("copy",this.onCopy),this._dropDownMenu.setup(this.onDropDownMenuClick),this._setUpCollapseDetailsAfterPrinting(),this._dom.find(".lh-topbar__logo",this._dom.rootEl).addEventListener("click",()=>le(this._dom)),this._setupStickyHeader()}onDropDownMenuClick(e){e.preventDefault();const t=e.target;if(!(!t||!t.hasAttribute("data-action"))){switch(t.getAttribute("data-action")){case"copy":this.onCopyButtonClick();break;case"print-summary":this.collapseAllDetails(),this._print();break;case"print-expanded":this.expandAllDetails(),this._print();break;case"save-json":{const n=JSON.stringify(this.lhr,null,2);this._reportUIFeatures._saveFile(new Blob([n],{type:"application/json"}));break}case"save-html":{const n=this._reportUIFeatures.getReportHtml();try{this._reportUIFeatures._saveFile(new Blob([n],{type:"text/html"}))}catch(o){this._dom.fireEventOn("lh-log",this._dom.document(),{cmd:"error",msg:"Could not export as HTML. "+o.message})}break}case"open-viewer":{this._dom.isDevTools()?_t(this.lhr):wt(this.lhr);break}case"save-gist":{this._reportUIFeatures.saveAsGist();break}case"toggle-dark":{le(this._dom);break}}this._dropDownMenu.close()}}onCopy(e){this._copyAttempt&&e.clipboardData&&(e.preventDefault(),e.clipboardData.setData("text/plain",JSON.stringify(this.lhr,null,2)),this._dom.fireEventOn("lh-log",this._dom.document(),{cmd:"log",msg:"Report JSON copied to clipboard"})),this._copyAttempt=!1}onCopyButtonClick(){this._dom.fireEventOn("lh-analytics",this._dom.document(),{cmd:"send",fields:{hitType:"event",eventCategory:"report",eventAction:"copy"}});try{this._dom.document().queryCommandSupported("copy")&&(this._copyAttempt=!0,this._dom.document().execCommand("copy")||(this._copyAttempt=!1,this._dom.fireEventOn("lh-log",this._dom.document(),{cmd:"warn",msg:"Your browser does not support copy to clipboard."})))}catch(e){this._copyAttempt=!1,this._dom.fireEventOn("lh-log",this._dom.document(),{cmd:"log",msg:e.message})}}onKeyUp(e){(e.ctrlKey||e.metaKey)&&e.keyCode===80&&this._dropDownMenu.close()}expandAllDetails(){this._dom.findAll(".lh-categories details",this._dom.rootEl).map(t=>t.open=!0)}collapseAllDetails(){this._dom.findAll(".lh-categories details",this._dom.rootEl).map(t=>t.open=!1)}_print(){self.print()}resetUIState(){this._dropDownMenu.close()}_getScrollParent(e){const{overflowY:t}=window.getComputedStyle(e);return t!=="visible"&&t!=="hidden"?e:e.parentElement?this._getScrollParent(e.parentElement):document}_setUpCollapseDetailsAfterPrinting(){"onbeforeprint"in self?self.addEventListener("afterprint",this.collapseAllDetails):self.matchMedia("print").addListener(e=>{e.matches?this.expandAllDetails():this.collapseAllDetails()})}_setupStickyHeader(){this.topbarEl=this._dom.find("div.lh-topbar",this._dom.rootEl),this.categoriesEl=this._dom.find("div.lh-categories",this._dom.rootEl),window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>{try{this.stickyHeaderEl=this._dom.find("div.lh-sticky-header",this._dom.rootEl)}catch{return}this.highlightEl=this._dom.createChildOf(this.stickyHeaderEl,"div","lh-highlighter");const e=this._getScrollParent(this._dom.find(".lh-container",this._dom.rootEl));e.addEventListener("scroll",()=>this._updateStickyHeader());const t=e instanceof window.Document?document.documentElement:e;new window.ResizeObserver(()=>this._updateStickyHeader()).observe(t)}))}_updateStickyHeader(){if(!this.stickyHeaderEl)return;const e=this.topbarEl.getBoundingClientRect().bottom,t=this.categoriesEl.getBoundingClientRect().top,n=e>=t,i=Array.from(this._dom.rootEl.querySelectorAll(".lh-category")).filter(h=>h.getBoundingClientRect().top-window.innerHeight/2<0),a=i.length>0?i.length-1:0,l=this.stickyHeaderEl.querySelectorAll(".lh-gauge__wrapper"),s=l[a],c=l[0].getBoundingClientRect().left,d=s.getBoundingClientRect().left-c;this.highlightEl.style.transform=`translate(${d}px)`,this.stickyHeaderEl.classList.toggle("lh-sticky-header--visible",n)}}/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */function de(r,e){const t=e?new Date(e):new Date,n=t.toLocaleTimeString("en-US",{hour12:!1}),o=t.toLocaleDateString("en-US",{year:"numeric",month:"2-digit",day:"2-digit"}).split("/");o.unshift(o.pop());const i=o.join("-");return`${r}_${i}_${n}`.replace(/[/?<>\\:*|"]/g,"-")}function kt(r){const e=new URL(r.finalUrl).hostname;return de(e,r.fetchTime)}function At(r){const e=r.steps[0].lhr,t=r.name.replace(/\s/g,"-");return de(t,e.fetchTime)}var Ct={getLhrFilenamePrefix:kt,getFilenamePrefix:de,getFlowResultFilenamePrefix:At};/**
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
 */function St(r){return Array.from(r.tBodies[0].rows)}class zt{constructor(e,t={}){this.json,this._dom=e,this._opts=t,this._topbar=t.omitTopbar?null:new Et(this,e),this.onMediaQueryChange=this.onMediaQueryChange.bind(this)}initFeatures(e){this.json=e,this._topbar&&(this._topbar.enable(e),this._topbar.resetUIState()),this._setupMediaQueryListeners(),this._setupThirdPartyFilter(),this._setupElementScreenshotOverlay(this._dom.rootEl);let t=!1;if(!(this._dom.isDevTools()||this._opts.disableAutoDarkModeAndFireworks)&&window.matchMedia("(prefers-color-scheme: dark)").matches&&(t=!0),["performance","accessibility","best-practices","seo"].every(s=>{const c=e.categories[s];return c&&c.score===1})&&!this._opts.disableAutoDarkModeAndFireworks&&(t=!0,this._enableFireworks()),t&&le(this._dom,!0),e.categories.performance&&e.categories.performance.auditRefs.some(s=>Boolean(s.group==="metrics"&&e.audits[s.id].errorMessage))){const s=this._dom.find("input.lh-metrics-toggle__input",this._dom.rootEl);s.checked=!0}this.json.audits["script-treemap-data"]&&this.json.audits["script-treemap-data"].details&&this.addButton({text:u.i18n.strings.viewTreemapLabel,icon:"treemap",onClick:()=>yt(this.json)}),this._opts.getStandaloneReportHTML&&this._dom.find('a[data-action="save-html"]',this._dom.rootEl).classList.remove("lh-hidden");for(const s of this._dom.findAll("[data-i18n]",this._dom.rootEl)){const d=s.getAttribute("data-i18n");s.textContent=u.i18n.strings[d]}}addButton(e){const t=this._dom.rootEl.querySelector(".lh-audit-group--metrics");if(!t)return;let n=t.querySelector(".lh-buttons");n||(n=this._dom.createChildOf(t,"div","lh-buttons"));const o=["lh-button"];e.icon&&(o.push("lh-report-icon"),o.push(`lh-report-icon--${e.icon}`));const i=this._dom.createChildOf(n,"button",o.join(" "));return i.textContent=e.text,i.addEventListener("click",e.onClick),i}resetUIState(){this._topbar&&this._topbar.resetUIState()}getReportHtml(){if(!this._opts.getStandaloneReportHTML)throw new Error("`getStandaloneReportHTML` is not set");return this.resetUIState(),this._opts.getStandaloneReportHTML()}saveAsGist(){throw new Error("Cannot save as gist from base report")}_enableFireworks(){const e=this._dom.find(".lh-scores-container",this._dom.rootEl);e.classList.add("lh-score100"),e.addEventListener("click",t=>{e.classList.toggle("lh-fireworks-paused")})}_setupMediaQueryListeners(){const e=self.matchMedia("(max-width: 500px)");e.addListener(this.onMediaQueryChange),this.onMediaQueryChange(e)}_resetUIState(){this._topbar&&this._topbar.resetUIState()}onMediaQueryChange(e){this._dom.rootEl.classList.toggle("lh-narrow",e.matches)}_setupThirdPartyFilter(){const e=["uses-rel-preconnect","third-party-facades"],t=["legacy-javascript"];Array.from(this._dom.rootEl.querySelectorAll("table.lh-table")).filter(i=>i.querySelector("td.lh-table-column--url, td.lh-table-column--source-location")).filter(i=>{const a=i.closest(".lh-audit");if(!a)throw new Error(".lh-table not within audit");return!e.includes(a.id)}).forEach(i=>{const a=St(i),l=this._getThirdPartyRows(a,this.json.finalUrl),s=this._dom.createComponent("3pFilter"),c=this._dom.find("input",s);c.addEventListener("change",m=>{const f=m.target instanceof HTMLInputElement&&!m.target.checked;let b=!0,v=a[0];for(;v;){const g=f&&l.includes(v);do v.classList.toggle("lh-row--hidden",g),v.classList.toggle("lh-row--even",!g&&b),v.classList.toggle("lh-row--odd",!g&&!b),v=v.nextElementSibling;while(v&&v.classList.contains("lh-sub-item-row"));g||(b=!b)}}),this._dom.find(".lh-3p-filter-count",s).textContent=`${l.length}`,this._dom.find(".lh-3p-ui-string",s).textContent=u.i18n.strings.thirdPartyResourcesLabel;const d=l.length===a.length,h=!l.length;if((d||h)&&(this._dom.find("div.lh-3p-filter",s).hidden=!0),!i.parentNode)return;i.parentNode.insertBefore(s,i);const p=i.closest(".lh-audit");if(!p)throw new Error(".lh-table not within audit");t.includes(p.id)&&!d&&c.click()})}_setupElementScreenshotOverlay(e){const t=this.json.audits["full-page-screenshot"]&&this.json.audits["full-page-screenshot"].details&&this.json.audits["full-page-screenshot"].details.type==="full-page-screenshot"&&this.json.audits["full-page-screenshot"].details;!t||O.installOverlayFeature({dom:this._dom,rootEl:e,overlayContainerEl:e,fullPageScreenshot:t})}_getThirdPartyRows(e,t){const n=[],o=u.getRootDomain(t);for(const i of e){if(i.classList.contains("lh-sub-item-row"))continue;const a=i.querySelector("div.lh-text__url");if(!a)continue;const l=a.dataset.url;!l||!(u.getRootDomain(l)!==o)||n.push(i)}return n}_saveFile(e){const t=Ct.getLhrFilenamePrefix(this.json);this._dom.saveFile(e,t)}}/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */function Mt(r,e={}){const t=document.createElement("article");t.classList.add("lh-root","lh-vars");const n=new nt(t.ownerDocument,t);return new ht(n).renderReport(r,t,e),new zt(n,e).initFeatures(r),t}export{Mt as r};
