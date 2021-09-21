import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { getHighlightedCode } from '../src/logic/getHighlightedCode';

test('should be able to get highlighted code, duh!', async () => {
  const output = await getHighlightedCode('console.log("hello world");', 'javascript', 'github-dark');
  assert.equal(output, {
    highlightedCode:
      '<pre class="shiki" style="background-color: #0d1117"><code><span class="line"><span style="color: #C9D1D9">console.</span><span style="color: #D2A8FF">log</span><span style="color: #C9D1D9">(</span><span style="color: #A5D6FF">&quot;hello world&quot;</span><span style="color: #C9D1D9">);</span></span></code></pre>',
    windowBackground: '#0d1117',
    titleColor: '#c9d1d9',
  });
});

test('with other options', async () => {
  const output = await getHighlightedCode('println("sup world")', 'julia', 'light-plus');
  assert.equal(output, {
    highlightedCode:
      '<pre class="shiki" style="background-color: #FFFFFF"><code><span class="line"><span style="color: #795E26">println</span><span style="color: #000000">(</span><span style="color: #A31515">&quot;sup world&quot;</span><span style="color: #000000">)</span></span></code></pre>',
    windowBackground: '#FFFFFF',
    titleColor: '#000000',
  });
});

test.run();
