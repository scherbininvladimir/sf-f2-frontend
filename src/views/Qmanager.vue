<template>
  <div class="Qmanager">
    <p>Здравствуйте, {{ first_name }}!</p>
    <h1>Управление опросниками</h1>
    <h2>Список опросников</h2>
    <table>
      <tr>
        <th>Название</th>
        <th>Дата начала</th>
        <th>Дата окончания</th>
      </tr>
    </table>
    <h2>Создание нового опроса</h2>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/';

export default {
  name: 'Qmanager',
  components: {
  },
  methods: {
    getData() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.get(`${BASE_API_URL}questionnaires/`, config).then((response) => {
        console.log(response);
      });
    },
  },
  data() {
    return {
      first_name: localStorage.first_name,
      last_name: localStorage.last_name,
      bla: [],
      questions: {},
    };
  },
  mounted() {
    this.getData();
  },
};
</script>
