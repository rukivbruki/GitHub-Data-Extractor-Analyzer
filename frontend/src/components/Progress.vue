<template>
  <div id="progress" class="progress">
    <p v-bind:class="{ 'progress-msg': isActive }">{{ msg }}</p>
    <a-progress :percent="Math.round(percent)" />
    <table v-if="!loading">
      <colgroup>
        <col span="2" style="background: Khaki" />
        <col style="background-color: LightCyan" />
      </colgroup>
      <tr>
        <th>№</th>
        <th>Искомые данные</th>
        <th>Значение</th>
      </tr>
      <tr>
        <td>1</td>
        <td>Найдено репозиториев</td>
        <td>{{ totalRepos }}</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Кол-во изученных репозиториев</td>
        <td>{{ amountNames }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import api from "../../api";

export default {
  name: "Progress",
  data() {
    return {
      isActive: true,
      percent: 0,
      totalRepos: 0,
      amountNames: 0,
    };
  },
  computed: {
    loading: function () {
      return this.percent !== 100;
    },
    msg: function () {
      return this.loading ? "Загружаю данные" : "Данные загружены";
    },
  },
  beforeUpdate() {
    this.isActive = !this.isActive;
  },
  mounted() {
    this.$root.$on("increase", () => {
      this.pingData();
    });
  },
  methods: {
    pingData: function () {
      let timerId = setInterval(
        () =>
          api
            .get("/api/crawler/data")
            .then((res) => {
              const { names, progress, totalRepos } = res.data;
              this.percent = (progress / names.length) * 100;
              return { names, totalRepos };
            })
            .then(({ names, totalRepos }) => {
              this.amountNames = names.length;
              this.totalRepos = totalRepos;
            })
            .then(this.percent === 100 ? clearInterval(timerId) : null)
            .catch(function (error) {
              console.log(error);
            }),
        500
      );
    },
  },
};
</script>
<style>
#progress {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  width: 600px;
  text-align: center;
  margin: 20px auto auto;
}

p {
  margin-bottom: 5px;
  color: grey;
}

.progress-msg {
  color: chocolate;
}

table {
  margin: 20px auto auto;
  width: 400px;
}

th,
td {
  border: 1px solid grey;
}
</style>
