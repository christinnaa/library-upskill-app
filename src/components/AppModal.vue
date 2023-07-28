<template>
  <b-modal
    :id="modalId"
    :size="modalSize"
    ref="modal"
    centered
    no-stacking
    :hide-footer="hideFooter"
    :hide-header="hideHeader"
  >
    <template #modal-title>
      <slot name="modal-header"></slot>
    </template>
    <div>
      <slot name="modal-body"> </slot>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "AppModal",
  props: ["modalId", "hideFooter", "hideHeader", "modalSize", "submitMethod"],
  methods: {
    showModal() {
      this.$refs["modal"].show();
    },
    hideModal() {
      this.$refs["modal"].hide();
    },
  },
};
</script>
