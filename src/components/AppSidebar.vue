<template>
  <nav class="sidebar">
    <ul>
      <li class="sidebar__item sidebar__logo">
        <div class="sidebar__link">
          <b-icon icon="book-half" font-scale="2"></b-icon>
          <div class="sidebar__text">Lou Geh Library</div>
        </div>
      </li>
      <slot></slot>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AppSidebar",
  components: {},
};
</script>

<style lang="scss">
.sidebar {
  width: 90px;
  height: 100vh;
  position: fixed;
  background: white;
  overflow-x: hidden;
  border-right: solid px #eee;
  z-index: 1000;
  transition: width 500ms ease;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__item {
    width: 100%;
  }

  &__item svg,
  &__item &__text {
    color: #697a8d;
  }

  &__item:first-child {
    border-bottom: solid 1px #eee;
  }

  &__item:first-child svg {
    color: var(--primary);
  }

  &__item:first-child &__text {
    color: #566a7f;
  }

  &__link {
    display: flex;
    align-items: center;
    height: 70px;
    text-decoration: none;
  }

  &__text {
    display: none;
    white-space: nowrap;
    margin-left: -10px;
  }

  &__logo &__text {
    font-size: 18px;
    line-height: 18px;
    font-weight: 700;
    letter-spacing: 0.2px;
    /* text-transform: uppercase; */
  }

  svg {
    min-width: 32px;
    margin: 0 28px;
  }

  // &:hover {
  //   width: 250px;
  // }

  // &:hover &__text {
  //   display: inline;
  // }

  &__link:hover {
    background: #f8f8fa;
  }

  .router-link-active,
  .router-link-active:hover {
    background: lighten(#696cff, 26);
  }

  .router-link-active {

    svg,
    .sidebar__text {
      color: var(--primary)
    }
  }
}

/* .active svg,
.active &__text {
    color;
} */
</style>
