import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material-darker.css';
import 'codemirror/lib/codemirror.css';
import './style.css';

const target = document.getElementById('editor');
const editor = CodeMirror.fromTextArea(target, {
  mode: 'javascript',
  theme: 'material-darker',
  scrollbarStyle: null,
  lineNumbers: true,
});

editor.refresh();
