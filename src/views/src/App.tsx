import type { JSXElement } from 'solid-js';
import Documentation from './components/Documentation/documentation';
import Editor from './components/Editor/editor';
import Header from './components/Header/header';

export default function App(): JSXElement {
  return (
    <>
      <Header />
      <Editor />
      <Documentation />
    </>
  );
}
