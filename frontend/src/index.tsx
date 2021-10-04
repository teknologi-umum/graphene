import { render } from 'solid-js/web';
import '@fontsource/rubik/400.css';
import '@fontsource/rubik/500.css';
import '@fontsource/rubik/700.css';
import App from './App';
import './global.css';

render(() => <App />, document.getElementById('root') as HTMLElement);
