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
import { BaseCodeSnippet } from './base-code-snippet.js';
import 'prismjs/prism.js';
import 'prismjs/components/prism-java.min.js';
/**
 * `java-spring-http-snippet`
 *
 * A snippet for requests made in Java using the spring functions
 *
 * ### Styling
 *
 * See `http-code-snippets` for styling documentation.
 *
 * @customElement
 * @polymer
 * @demo demo/java-spring.html Java Spring demo
 * @demo demo/java.html Java demo
 * @memberof ApiElements
 * @extends BaseCodeSnippet
 */
class JavaSpringHttpSnippet extends BaseCodeSnippet {
  get lang() {
    return 'java';
  }
  /**
   * Computes code for Java (Spring).
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
    let result = `RestTemplate rest = new RestTemplate();\n`;
    result += 'HttpHeaders headers = new HttpHeaders();\n';
    result += this._genHeadersPart(headers);
    result += this._genPayloadPart(payload);
    result += '\n';
    result += 'HttpEntity<String> requestEntity = new HttpEntity<String>(body, headers);\n';
    result += 'ResponseEntity<String> responseEntity = rest.exchange(';
    result += `"${url}", HttpMethod.${method}, requestEntity, String.class);\n`;
    result += 'HttpStatus httpStatus = responseEntity.getStatusCode();\n';
    result += 'int status = httpStatus.value();\n';
    result += 'String response = responseEntity.getBody();\n';
    result += 'System.out.println("Response status: " + status);\n';
    result += 'System.out.println(response);';
    return result;
  }

  _genHeadersPart(headers) {
    let result = '';
    if (headers && headers.length) {
      headers.forEach((h) => {
        result += `headers.add("${h.name}", "${h.value}");\n`;
      });
    }
    return result;
  }

  _genPayloadPart(payload) {
    let result = '';
    if (payload) {
      result += '\nStringBuilder sb = new StringBuilder();\n';
      const list = this._payloadToList(payload);
      list.forEach((line) => {
        result += `sb.append("${line}\\n");\n`;
      });
      result += 'String body = sb.toString();\n';
    } else {
      result += 'String body = "";\n';
    }
    return result;
  }

  _payloadToList(payload) {
    return payload.split('\n').map((item) => item.replace(/"/g, '\\"'));
  }
}
window.customElements.define('java-spring-http-snippet', JavaSpringHttpSnippet);
