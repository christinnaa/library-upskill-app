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
      }, 1500);
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
  background-color: #7679ff;
  width: 0px;
  height: 0px;
  border-radius: 50%;
  margin: 0 8px;
  transform: translate3d(0);
  animation: bounce 0.6s infinite alternate;
}

.loader>span:nth-child(2) {
  background-color: #a9aaf7;
  animation-delay: 0.2s;
}

.loader>span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  to {
    width: 16px;
    height: 16px;
    transform: translate3d(0, -16px, 0);
  }
}
</style>
