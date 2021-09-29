<style>
.options {
  display: flex;
  position: relative;
  border: 0.125rem #e2e8f0 solid;
  box-sizing: border-box;
  border-radius: 0.5rem;
  max-width: 14rem;
}

.options__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-right: 0.125rem #e2e8f0 solid;
  color: #2d3748;
}

.options__input-wrapper {
  flex: 1;
}

.options__input {
  color: #2d3748;
  padding: 0.25rem 0.5rem;
  height: 2.5rem;
  width: 100%;
  font-size: 1rem;
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  outline: none;
  border: none;
  border-radius: 0.5rem;
}

:global(.arrow) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.75rem;
  color: #2d3748;
  transition: all ease-out 0.2s;
}

.options__input:focus ~ :global(.arrow) {
  transform: translateY(-50%) rotateZ(180deg);
}

.options__candidates {
  position: absolute;
  display: block;
  top: 3rem;
  left: 2.375rem;
  right: -0.125rem;
  background-color: #ffffff;
  z-index: 2;
  max-height: 12rem;
  overflow-y: auto;
  border: 0.125rem #e2e8f0 solid;
  border-radius: 0.5rem;
}

.options__candidates::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
}

.options__candidates::-webkit-scrollbar {
  background-color: #ffffff;
  width: 0.25rem;
}

.candidate {
  text-transform: capitalize;
  display: flex;
  align-items: center;
  height: 2.5rem;
  background-color: #ffffff;
  font-family: 'Rubik', sans-serif;
  padding: 0 1rem;
  cursor: pointer;
}

.candidate:hover {
  background-color: #edf2f7;
}
</style>

<div class="options">
  <div class="options__icon">
    <svelte:component this={icon} />
  </div>
  <div class="options__input-wrapper">
    <input
      class="options__input"
      type="text"
      on:input={filterCandidate}
      on:focus={() => (isCandidateVisible = true)}
      on:blur={() => (isCandidateVisible = false)}
      placeholder={inputValue}
    />
    <ArrowIcon className="arrow" />
    {#if isCandidateVisible}
      <ul class="options__candidates">
        {#each filteredItems as item}
          <li class="candidate">{item}</li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<script>
import ArrowIcon from './ArrowIcon.svelte';
export let items, selected, icon;

$: inputValue = '' || selected;

// so we don't mutate the original items;
let filteredItems = items;

let isCandidateVisible = false;

function filterCandidate(e) {
  const query = e.currentTarget.value;
  filteredItems = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );
}
</script>
