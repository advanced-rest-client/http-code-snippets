/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   java-http-snippets.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../paper-tabs/paper-tabs.d.ts" />
/// <reference path="../paper-tabs/paper-tab.d.ts" />
/// <reference path="../iron-pages/iron-pages.d.ts" />
/// <reference path="java-platform-http-snippet.d.ts" />
/// <reference path="java-spring-http-snippet.d.ts" />

declare namespace ApiElements {

  /**
   * `javascript-http-snippet`
   *
   * A set of code snippets for Java requests.
   *
   * ## Styling
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--http-code-snippets` | Mixin applied to this elment | `{}`
   */
  class JavatHttpSnippets extends
    ArcBehaviors.CodeSnippetsMixin(
    Polymer.Element) {
    selectedFramework: number|null|undefined;
  }
}

interface HTMLElementTagNameMap {
  "java-http-snippets": ApiElements.JavatHttpSnippets;
}
