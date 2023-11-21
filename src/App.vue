<template>
  <div id="app">
    <AppLoader />
    <router-view />
  </div>
</template>

<script>
import AppLoader from "@/components/AppLoader.vue";

export default {
  components: {
    AppLoader,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lobster+Two&family=Poppins:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;

  ::-webkit-scrollbar {
    width: 0.45rem;
    height: 0.45rem;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(190, 190, 190);
    border-radius: 20px;
    &:active {
      background: rgb(173, 173, 173);
    }
  }

  &::before,
  &::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

html,
body,
#app,
.wrapper {
  // background: #F5F5F9;
  background: #f3f5fa;
  height: 100%;
}

a,
.router-link {
  text-decoration: none;
  color: black;

  &:hover {
    color: black !important;
  }
}

main {
  margin-left: 90px;
  padding: 20px;
}

.wrapper {
  overflow-x: hidden;
}

.table__container {
  background: white;
}

.b-table-row-selected {
  background-color: #f7f7f7 !important;
}

.nav__header {
  height: 70px;
}

input {
  outline: none;
}

a {
  &:active {
    background-color: none;
  }
}

@media (min-width: 1024px) {
  main {
    padding: 20px 8%;
  }
}

.inactive {
  display: flex;
  justify-content: space-between;

  span {
    text-transform: capitalize;
    display: flex;
    align-items: center;
  }
}

.badge{
  font-weight: 500 !important;
}
</style>
