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
        <td>{{ numberNames }}</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Затраченное время</td>
        <td>{{ totalTime }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import apiServe from "../api/ApiServe";

export default {
  name: "Progress",
  data() {
    return {
      isActive: true,
      percent: 0,
      totalRepos: 0,
      numberNames: 0,
      totalTime: 0,
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
          apiServe
            .getData("crawler")
            .then((res) => {
              console.log(res);
              const { names, progress, totalRepos, totalTime } = res.data;
              this.percent = (progress / names.length) * 100;
              return { names, totalRepos, totalTime };
            })
            .then(({ names, totalRepos, totalTime }) => {
              this.numberNames = names.length;
              this.totalRepos = totalRepos;
              this.totalTime = totalTime;
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
