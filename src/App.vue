<template>
  <RouterView />
</template>

<style lang="scss">
@import 'scss/main.scss';

#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 20rem;
}

// css popup
.va-modal h1,
.item {
  padding: 0 5px;
}

.va-modal .buttons {
  margin-top: 10px;
}
.va-modal .buttons .flex {
  flex-direction: row;
  justify-content: end;
}

.va-modal .buttons .flex .va-button {
  max-width: 100px;
  margin: 0 5px;
}

// css textarea
.va-textarea {
  width: 100%;
}
</style>
