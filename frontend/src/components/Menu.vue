<template>
  <div id="menu">
    <FormulateForm @submit="submitHandler">
      <FormulateInput
        label="В каком городе будем искать?"
        name="city"
        help="Введите латиницей город для поиска"
        validation="^required|matches:/[a-z]/"
        :validation-messages="{
          required: 'Введите название города',
          matches: 'Введите название города латиницей',
        }"
      />
      <FormulateInput
        type="select"
        label="По какой библиотеке осуществляем поиск?"
        name="lib"
        :options="[
          { value: 'react', label: 'React.js' },
          { value: 'vue', label: 'Vue.js' },
          { value: 'node', label: 'Node.js', id: 'name-initial' },
        ]"
      />
      <FormulateInput
        type="number"
        name="count"
        label="Сколько пользователей обойдем?"
        help="Чтобы найти всех пользователей поставьте 0"
        placeholder="Sample number placeholder"
        validation="required|number"
        error-behavior="live"
        :validation-messages="{
          required: 'Введите число',
        }"
        v-model="value"
      />

      <FormulateInput type="submit" label="Начать поиск" />
    </FormulateForm>
  </div>
</template>

<script>
import apiServe from "../api/ApiServe";

export default {
  name: "Menu",
  data() {
    return {
      value: 0,
    };
  },
  methods: {
    submitHandler(data) {
      apiServe.startService("crawler", data);
      this.$root.$emit("increase");
    },
  },
};
</script>
<style lang="scss">
#menu {
  width: 400px;
  margin: auto;
}
</style>
