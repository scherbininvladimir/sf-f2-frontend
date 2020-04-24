<template>
  <div class="QQ">
    <h1>Список вопросов </h1>

  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/';

export default {
  name: 'QQ',
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
