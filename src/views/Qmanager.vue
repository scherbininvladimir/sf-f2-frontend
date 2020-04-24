<template>
  <div class="Qmanager">
    <h1>Управление опросниками</h1>
    <h2>Список опросов</h2>
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
    getQuestions() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.get(`${BASE_API_URL}questions/`, config).then((response) => {
        this.questions = response.data;
      });
    },
  },
  data() {
    return {
      bla: [],
      questions: {},
    };
  },
  mounted() {
    this.getQuestions();
  },
};
</script>
