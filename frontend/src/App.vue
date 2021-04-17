<template>
  <div id="app">
    <Menu />
    <Progress />
  </div>
</template>

<script>
import Progress from "./components/Progress";
import Menu from "./components/Menu";

export default {
  name: "App",
  components: {
    Progress,
    Menu,
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  margin-top: 60px;
}
</style>
