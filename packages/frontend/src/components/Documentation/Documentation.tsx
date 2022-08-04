import { For } from 'solid-js';
import { OptionItem } from '~/components/OptionItem';
import { options } from './data';
import './Documentation.scss';

export function Documentation() {
  return (
    <div class="Documentation">
      <h2 class="title" id="documentation">
        <a href="#documentation">Documentation for Graphene API</a>
      </h2>
      <section class="description">
        <p>
          Simply send a HTTP POST request to&nbsp;
          <span>
            <code>https://teknologi-umum-graphene.fly.dev/api</code>
          </span>
          &nbsp; with a payload body as specified below.
        </p>
        <p>
          If no <code>Content-Type</code> header was given, the API by default would parse it as JSON. If you don't feel
          like doing JSON, we support URL encoded,
          <a href="https://yaml.org/">YAML</a>, <a href="https://toml.io/en/">TOML</a>, and{' '}
          <a href="https://gura.netlify.app/">Gura</a>. Valid <code>Content-Type</code> values are:
        </p>
        <ul>
          <li>
            JSON: <code>application/json</code>
          </li>
          <li>
            URL encoded: <code>application/x-www-form-urlencoded</code>
          </li>
          <li>
            YAML: <code>application/x-yaml</code> or <code>text/yaml</code>
          </li>
          <li>
            TOML: <code>application/toml</code> or <code>text/x-toml</code>
          </li>
          <li>
            Gura: <code>application/gura</code> or <code>text/gura</code>
          </li>
        </ul>
      </section>
      <section class="items">
        <For each={options}>
          {({ title, desc, defaultValue, required, validValues }) => (
            <OptionItem
              title={title}
              desc={desc}
              defaultValue={defaultValue}
              required={required}
              validValues={validValues}
            />
          )}
        </For>
      </section>
      <section class="example">
        <h2 class="example-title" id="example">
          <a href="#example">Example Request Body</a>
        </h2>
        <pre>
          <code>
            {`{
  "code": "import foo from './bar';",
  "theme": "dark-plus",
  "format": "jpeg",
  "lang": "javascript",
  "upscale": 3,
  "lang": "javascript",
  "font": "jetbrains mono",
  "lineNumber": false,
  "border": {
    "thickness": 20,
    "colour": "#efefef"
  }
}`}
          </code>
        </pre>
      </section>
    </div>
  );
}
