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
import { BaseCodeSnippet } from '../BaseCodeSnippet.js';
import 'prismjs/prism.js';
import 'prismjs/components/prism-java.min.js';

/** @typedef {import('../BaseCodeSnippet').CodeHeader} CodeHeader */

/**
 * `java-spring-http-snippet`
 *
 * A snippet for requests made in Java using the spring functions
 */
export class JavaSpringHttpSnippetElement extends BaseCodeSnippet {
  get lang() {
    return 'java';
  }

  /**
   * Computes code for Java (Spring).
   * @param {string} url
   * @param {string} method
   * @param {CodeHeader[]} headers
   * @param {string} payload
   * @return {string} Complete code for given arguments
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

  /**
   * @param {CodeHeader[]} headers 
   * @returns {string}
   */
  _genHeadersPart(headers) {
    let result = '';
    if (headers && headers.length) {
      headers.forEach((h) => {
        result += `headers.add("${h.name}", "${h.value}");\n`;
      });
    }
    return result;
  }

  /**
   * @param {string} payload 
   * @returns {string}
   */
  _genPayloadPart(payload) {
    let result = '';
    if (payload) {
      result += '\nStringBuilder sb = new StringBuilder();\n';
      const list = this._payloadToList(payload);
      const len = list.length;
      list.forEach((line, i) => {
        if (i + 1 !== len) {
          // eslint-disable-next-line no-param-reassign
          line += '\\n';
        }
        result += `sb.append("${line}");\n`;
      });
      result += 'String body = sb.toString();\n';
    } else {
      result += 'String body = "";\n';
    }
    return result;
  }

  /**
   * @param {string} payload 
   * @returns {string[]}
   */
  _payloadToList(payload) {
    return payload.split('\n').map((item) => item.replace(/"/g, '\\"'));
  }
}
