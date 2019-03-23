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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import './http-code-snippets-style.js';
const URI_CACHE = {};
/**
 * `base-code-snippet`
 *
 * A class to be used to extend other code snippets elements.
 *
 * Each child class has to have `lang` property to be used to recognize the
 * syntax. If syntax is different than the default PrismJs set then it has to
 * be imported into the DOM.
 *
 * Each child class must implement `_processCommand()` function which results
 * to a code to highlight. It takes 4 attributes (in order): url, method,
 * headers, and payload.
 * Mind that all atguments are optional.
 *
 * If the child class implements it's own template, it should contain
 * `<code></code>` inside the template where the highlighted value is
 * added.
 *
 * Parent element, presumably `http-code-snippets`, or main document
 * must include `prism-element/prism-highlighter.html` in it's DOM.
 *
 * ### Styling
 *
 * See `http-code-snippets` for styling documentation.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 */
export class BaseCodeSnippet extends PolymerElement {
  static get template() {
    return html`<style include="http-code-snippets-style"></style>
    <button class="copy-button" title="Copy to clipboard" on-click="_copyToClipboard">Copy</button>
    <code class="code language-snippet"></code>`;
  }

  static get is() {
    return 'base-code-snippet';
  }

  static get properties() {
    return {
      /**
       * Request URL
       */
      url: String,
      /**
       * HTTP method
       */
      method: String,
      /**
       * Parsed HTTP headers.
       * Each item contains `name` and `value` properties.
       * @type {Array<Object>}
       */
      headers: Array,
      /**
       * HTTP body (the message)
       */
      payload: String
    };
  }

  static get observers() {
    return [
      '_valuesChanged(url, method, headers, payload)'
    ];
  }

  get _code() {
    return this.shadowRoot.querySelector('code');
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.__valuesDebouncer) {
      this._valuesChanged(this.url, this.method, this.headers, this.payload);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearValueTimeout();
  }
  /**
   * Clears timeout from the debouncer if set.
   */
  _clearValueTimeout() {
    if (this.__valuesDebouncer) {
      clearTimeout(this.__valuesDebouncer);
      this.__valuesDebouncer = undefined;
    }
  }
  /**
   * Computes code value with debouncer set to 25 ms.
   * @param {String} url
   * @param {String} method
   * @param {Array<Object>|undefined} headers
   * @param {String|undefined} payload
   */
  _valuesChanged(url, method, headers, payload) {
    this._clearValueTimeout();
    this.__valuesDebouncer = setTimeout(() => {
      this.__valuesDebouncer = undefined;
      this._processCommand(url, method, headers, payload);
    }, 25);
  }
  /**
   * Processes command by calling, respectively, `_computeCommand()` and
   * `_highlight()`. The result is added to the `<code>` block in the template.
   * @param {String} url
   * @param {String} method
   * @param {Array<Object>|undefined} headers
   * @param {String|undefined} payload
   */
  _processCommand(url, method, headers, payload) {
    let code = this._computeCommand(url, method, headers, payload);
    if (!code) {
      code = '';
    } else {
      code = this._highlight(code, this.lang);
    }
    this._code.innerHTML = code;
  }

  _computeCommand() {}

  _highlight(code, lang) {
    const e = new CustomEvent('syntax-highlight', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        code,
        lang
      }
    });
    this.dispatchEvent(e);
    return e.detail.code;
  }
  /**
   * Reads the host, port and path from the url.
   * This function uses URI library to parse the URL so you have to
   * include this library from bower_components if the element want to use it.
   *
   * @param {String} url
   * @return {Object}
   */
  urlDetails(url) {
    if (URI_CACHE[url]) {
      return URI_CACHE[url];
    }
    url = url || this.url;
    const result = {
      path: '',
      port: '',
      hostValue: ''
    };
    if (!url) {
      return result;
    }
    let uri;
    try {
      uri = new URL(url);
    } catch (e) {
      if (url[0] === '/') {
        result.path = url;
        result.post = 80;
      }
      return result;
    }
    let host = uri.hostname;
    if (host) {
      host = decodeURIComponent(host);
    }
    let port = uri.port;
    if (!port) {
      if (uri.protocol === 'https:') {
        port = 443;
      } else {
        port = 80;
      }
    }
    result.port = port;
    result.hostValue = host;
    const query = uri.search;
    let path = uri.pathname;
    if (!path) {
      path = '/';
    } else {
      path = decodeURIComponent(path);
    }
    if (query) {
      path += query;
    }
    result.path = path;
    URI_CACHE[url] = result;
    return result;
  }

  _copyToClipboard() {
    let code = this._code;
    if (!code) {
      return;
    }
    if (this._beforeCopy(code.innerText)) {
      return;
    }
    // From https://github.com/google/material-design-lite/blob/master/docs/_assets/snippets.js
    const snipRange = document.createRange();
    snipRange.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(snipRange);
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Copy error', err);
    }
    selection.removeAllRanges();
  }
  /**
   * Sends the `content-copy` event.
   * If the event is canceled then the logic from this element won't be
   * executed. Useful if current platform doesn't support `execCommand('copy')`
   * and has other way to manage clipboard.
   *
   * @param {String} value The value to dispatch with the event.
   * @return {Boolean} True if handler executed copy function.
   */
  _beforeCopy(value) {
    const ev = new CustomEvent('content-copy', {
      detail: {
        value
      },
      bubbles: true,
      cancelable: true,
      composed: true
    });
    this.dispatchEvent(ev);
    return ev.defaultPrevented;
  }
}
window.customElements.define(BaseCodeSnippet.is, BaseCodeSnippet);
