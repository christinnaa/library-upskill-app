<template>
  <transition>
    <div v-if="show" class="loader">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AppLoader",
  data() {
    return {
      show: true,
    };
  },
  created() {
    this.showToggle();
  },
  methods: {
    showToggle() {
      setTimeout(() => {
        this.show = false;
      }, 800);
    },
  },
};
</script>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f5fa;
  height: 100vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 10000;
}

.loader>span {
  display: inline-block;
  background-color: #81B29A;
  width: 0px;
  height: 0px;
  border-radius: 50%;
  margin: 0 8px;
  transform: translate3d(0);
  animation: bounce 0.4s infinite alternate;
}

.loader>span:nth-child(2) {
  background-color: #a4c3b2;
  animation-delay: 0.18s;
}

.loader>span:nth-child(3) {
  background-color: #cce3de;
  animation-delay: 0.2s;
}

@keyframes bounce {
  to {
    width: 16px;
    height: 16px;
    transform: translate3d(0, -16px, 0);
  }
}
</style>
