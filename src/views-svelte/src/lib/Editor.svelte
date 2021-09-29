<style>
.main {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.125rem #e2e8f0 solid;
  border-radius: 0.5rem;
  background-color: #ffffff;
}

.main__editor {
  border-right: 0.125rem #e2e8f0 solid;
}

.editor__options {
  display: flex;
  gap: 0.75rem;
  border-bottom: 0.125rem #e2e8f0 solid;
  padding: 0.75rem;
}

.editor__input {
  width: 100%;
  border: none;
  outline: none;
  padding: 0.75rem;
  font-size: 1rem;
  color: #2d3748;
}

.main__preview {
  padding: 1rem;
}

.main__preview > h3 {
  text-align: center;
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  color: #2d3748;
}
</style>

<main class="main">
  <div class="main__editor">
    <div class="editor__options">
      <Options items={languages} selected={selectedLang} icon={LangIcon} />
      <Options items={themes} selected={selectedTheme} icon={PaletteIcon} />
      <Options items={themes} selected={selectedTheme} icon={PaletteIcon} />
    </div>
    <textarea
      class="editor__input"
      rows="20"
      placeholder="Paste your code here..."
    />
  </div>
  <div class="main__preview">
    <h3 class="preview__image">Your image will appear here</h3>
  </div>
</main>

<script>
import LangIcon from './LangIcon.svelte';
import PaletteIcon from './PaletteIcon.svelte';
import Options from './Options.svelte';
import { VALID_LANGUAGES, VALID_THEMES } from './constant.js';

const languages = ['Auto Detect'].concat(VALID_LANGUAGES);
let selectedLang = languages[0];

const themes = VALID_THEMES.reduce((acc, curr) => {
  const lang = curr.split('-').join(' ');
  return acc.concat(lang);
}, []);
let selectedTheme = 'Github Dark';
</script>
