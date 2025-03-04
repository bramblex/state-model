<script setup lang="ts">
import { StateModel, useModel } from "@bramblex/state-model/vue";

defineProps<{ msg: string }>();

const model = new StateModel({ count: 0 });

const { count } = useModel(model);
count.value = 10;
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button
      type="button"
      @click="model.update((state) => ({ count: state.count + 1 }))"
    >
      count is {{ count }}
    </button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
