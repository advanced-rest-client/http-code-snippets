import { fixture, assert, aTimeout } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '@polymer/prism-element/prism-highlighter.js';
import '../base-code-snippet.js';

{
  const n = document.createElement('prism-highlighter');
  document.body.appendChild(n);
}


describe('<base-code-snippet>', function() {
  async function basicFixture() {
    return (await fixture(`<base-code-snippet
      headers='[{"Content-Type": "application/json"}]'
      method="GET"
      url="http://domain.com"></base-code-snippet>`));
  }

  describe('urlDetails()', () => {
    it('Computes URL details', async () => {
      const element = await basicFixture();
      const result = element.urlDetails('https://domain.com/path?a=b');
      assert.equal(result.path, '/path?a=b');
      assert.equal(result.port, 443);
      assert.equal(result.hostValue, 'domain.com');
    });

    it('Adds code to the DOM', async () => {
      const element = await basicFixture();
      element._computeCommand = function() {
        return 'test-command';
      };
      await aTimeout();
      const code = element.shadowRoot.querySelector('code').innerText.trim();
      assert.equal(code, 'test-command');
    });
  });

  describe('_highlight()', () => {
    it('Element eventually dispatches syntax-highlight event', (done) => {
      basicFixture()
      .then((element) => {
        element._computeCommand = function() {
          return 'test-command';
        };
        element.addEventListener('syntax-highlight', function f(e) {
          element.removeEventListener('syntax-highlight', f);
          assert.isTrue(e.cancelable, 'Event is cancelable');
          assert.typeOf(e.detail.code, 'string', 'Code property is set');
          done();
        });
      });
    });

    it('Dispatches syntax-highlight event', async () => {
      const element = await basicFixture();
      element._computeCommand = function() {
        return 'test-command';
      };
      const spy = sinon.spy();
      element.addEventListener('syntax-highlight', spy);
      element._highlight('test', 'c');
      assert.isTrue(spy.called);
    });
  });

  describe('_copyToClipboard()', () => {
    let element;

    beforeEach( async () => {
      element = await basicFixture();
      element._code.textContent = 'test-code';
    });

    it('Dispatches content-copy event', () => {
      const spy = sinon.spy();
      element.addEventListener('content-copy', spy);
      element._copyToClipboard();
      assert.isTrue(spy.calledOnce);
      assert.equal(spy.args[0][0].detail.value, 'test-code');
    });

    it('Calls execCommand() when event is not handled', () => {
      const spy = sinon.spy(document, 'execCommand');
      element._copyToClipboard();
      document.execCommand.restore();
      assert.isTrue(spy.calledOnce);
    });

    it('Won\'t call execCommand() when event is handled', () => {
      const spy = sinon.spy(document, 'execCommand');
      element.addEventListener('content-copy', function f(e) {
        element.removeEventListener('content-copy', f);
        e.preventDefault();
      });
      element._copyToClipboard();
      document.execCommand.restore();
      assert.isFalse(spy.calledOnce);
    });
  });
});
