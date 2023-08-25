<template>
  <div class="dropdown">
    <button
      class="btn dropdown-toggle d-flex align-items-center"
      type="button"
      data-toggle="dropdown"
      aria-expanded="false"
    >
      <slot name="text"></slot>
    </button>
    <div class="dropdown-menu">
      <slot name="links"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppDropdown",
};
</script>

<style lang="scss" scoped>
.dropdown-toggle {
  &::after {
    display: none;
  }

  border: 0;
}
</style>
