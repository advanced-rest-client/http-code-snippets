/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {BaseCodeSnippet} from './base-code-snippet.js';
/**
 * `fetch-js-http-snippet`
 *
 * A snippet for requests made in JavaScript using Fetch API.
 *
 * ### Styling
 *
 * See `http-code-snippets` for styling documentation.
 *
 * @customElement
 * @polymer
 * @demo demo/fetch-js.html Fetch (JavaScript) demo
 * @memberof ApiElements
 * @extends BaseCodeSnippet
 */
class FetchJsHttpSnippet extends BaseCodeSnippet {
  static get is() {
    return 'fetch-js-http-snippet';
  }

  get lang() {
    return 'javascript';
  }

  /**
   * Computes code for JavaScript (Fetch API).
   * @param {String} url
   * @param {String} method
   * @param {Array<Object>|undefined} headers
   * @param {String} payload
   * @return {String} Complete code for given arguments
   */
  _computeCommand(url, method, headers, payload) {
    if (!url || !method) {
      return '';
    }
    const hasHeaders = !!(headers && headers instanceof Array && headers.length);
    const hasPayload = !!payload;
    const hasInit = hasHeaders || hasPayload || !!(method && method !== 'GET');
    let result = '';

    if (hasInit) {
      if (hasHeaders) {
        result += this._createHeaders(headers);
      }
      if (hasPayload) {
        result += this._createPayload(payload);
      }
      result += 'const init = {\n';
      result += `\tmethod: '${method}'`;
      if (hasHeaders) {
        result += `,\n\theaders`;
      }
      if (hasPayload) {
        result += `,\n\tbody`;
      }
      result += '\n';
      result += '}\n\n';
    }

    result += `fetch('${url}'`;
    if (hasInit) {
      result += ', init';
    }
    result += ')\n';
    result += '.then((response) => {\n';
    result += '\treturn response.text(); // or .json() or .blob() ...\n';
    result += '})\n';
    result += '.then((text) => {\n';
    result += '\t// text is the response body\n';
    result += '})\n';
    result += '.catch((e) => {\n';
    result += '\t// error in e.message\n';
    result += '});\n';
    return result;
  }

  _createHeaders(headers) {
    let result = 'const headers = new Headers();\n';
    for (let i = 0, len = headers.length; i < len; i++) {
      const h = headers[i];
      result += `headers.append('${h.name}', '${h.value}');\n`;
    }
    result += '\n';
    return result;
  }

  _createPayload(payload) {
    return `const body = \`${payload}\`;\n\n`;
  }
}
window.customElements.define(FetchJsHttpSnippet.is, FetchJsHttpSnippet);
