import Header from './components/Header/header';
import Editor from './components/Editor/editor';
import Documentation from './components/Documentation/documentation';
import { JSXElement } from 'solid-js';

export default function App(): JSXElement {
  return (
    <>
      <Header />
      <Editor />
      <Documentation />
    </>
  );
}
