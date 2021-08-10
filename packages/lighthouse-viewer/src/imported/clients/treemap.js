/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* global window */

// TODO(esmodules): delete when treemap app is esm.

import {I18n} from '../renderer/i18n.js';
import {Logger} from '../renderer/logger.js';
import {TextEncoding} from '../renderer/text-encoding.js';

// @ts-expect-error
window.I18n = I18n;
// @ts-expect-error
window.Logger = Logger;
// @ts-expect-error
window.TextEncoding = TextEncoding;
