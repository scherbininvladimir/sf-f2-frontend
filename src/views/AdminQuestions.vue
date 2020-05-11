<template>
  <div>
    <h2>Редактор вопросов</h2>
    <CreateQuestion
      v-if="isEditView"
      v-on:saveQuestion="SaveQuestion"
      v-on:cancel="cancel"
      v-on:addResponse="addResponse"
      v-on:deleteResponse="deleteResponse"
      v-bind:question="question">
    </CreateQuestion>
    <div v-else>
        <li v-for="q in questions" :key="q.id">
          <b-button variant="link" v-on:click="edit(q.id)">{{ q.title }}</b-button>
          <b-button size="sm" variant="danger" v-on:click="deleteQuestion(q.id)">x</b-button>
        </li>
      <b-button variant="primary" v-on:click="newQuestion">Новый вопрос</b-button>
    </div>
  </div>
</template>
<script>
import CreateQuestion from '@/components/CreateQuestion.vue';
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/';

export default {
  components: {
    CreateQuestion,
  },
  data() {
    return {
      isEditView: false,
      questions: [],
      question: {},
    };
  },
  methods: {
    getData() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.get(`${BASE_API_URL}admin/questions/`, config).then((response) => {
        this.questions = response.data;
      });
    },
    edit(qid) {
      this.question = this.questions.find((e) => e.id === qid);
      this.isEditView = true;
    },
    cancel() {
      this.question = {};
      this.isEditView = false;
    },
    newQuestion() {
      this.question = { response: [] };
      this.isEditView = true;
    },
    SaveQuestion() {
      this.isEditView = false;
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      if (this.question.id) {
        axios.put(`${BASE_API_URL}admin/questions/${this.question.id}`, this.question, config).then(() => this.getData()).catch((error) => {
          console.log(error.response.data);
        });
      } else {
        axios.post(`${BASE_API_URL}admin/questions/`, this.question, config).then(() => this.getData()).catch((error) => {
          console.log(error.response.data);
        });
      }
    },
    addResponse() {
      if (this.question.id) {
        this.question.response.push({ question: this.question.id });
      } else {
        this.question.response.push({ question: -1 });
      }
    },
    deleteResponse(response) {
      this.question.response = this.question.response.filter((element) => !(element === response));
    },
    deleteQuestion(qid) {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.delete(`${BASE_API_URL}admin/questions/${qid}`, config).then(() => this.getData()).catch((error) => {
        console.log(error.response.data);
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
