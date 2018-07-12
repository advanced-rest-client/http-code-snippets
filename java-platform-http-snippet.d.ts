/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   java-platform-http-snippet.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="code-snippets-mixin.d.ts" />
/// <reference path="http-code-snippets-style.d.ts" />

declare namespace ApiElements {

  /**
   * `java-platform-http-snippet`
   *
   * A snippet for requests made in Java using the platform functions
   *
   * ## Styling
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--http-code-snippets` | Mixin applied to this elment | `{}`
   */
  class JavaPlatformHttpSnippet extends
    ArcBehaviors.CodeSnippetsMixin(
    Polymer.Element) {
    _payloadToList(payload: any): any;
  }
}

interface HTMLElementTagNameMap {
  "java-platform-http-snippet": ApiElements.JavaPlatformHttpSnippet;
}
