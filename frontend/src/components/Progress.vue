<template>
  <div id="progress">
    <p>{{ msg }}</p>
    <a-progress :percent="percent" />
    <table v-if="!loading">
      <colgroup>
        <col span="2" style="background: Khaki" />
        <col style="background-color: LightCyan" />
      </colgroup>
      <tr>
        <th>№ п/п</th>
        <th>Наименование</th>
        <th>Цена, руб.</th>
      </tr>
      <tr>
        <td>1</td>
        <td>Карандаш цветной</td>
        <td>20,00</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Линейка 20 см</td>
        <td>30,00</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  name: "Progress",
  data() {
    return {
      percent: 0,
    };
  },
  computed: {
    bolean: function () {
      return this.percent !== 100;
    },
    loading: function () {
      return this.bolean;
    },
    msg: function () {
      return this.bolean ? "Загружаю данные" : "Данные загружены";
    },
  },
  created() {
    if (this.loading) {
      this.incrementProgress();
    }
  },
  beforeUpdate() {
    if (this.loading) {
      this.incrementProgress();
    }
  },
  methods: {
    incrementProgress() {
      setTimeout(() => {
        let percent = this.percent + 10;
        this.percent = percent;
      }, 300);
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
table {
  margin: 20px auto auto;
  width: 400px;
}
th,
td {
  border: 1px solid grey;
}
</style>
