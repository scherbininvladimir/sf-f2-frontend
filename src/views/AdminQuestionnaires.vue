<template>
  <div>
    <h2>Редактор опросников</h2>
    <CreateQuestionnaire
      v-if="isEditView"
      v-on:cancel="cancel"
      v-on:saveQuestionnaire="saveQuestionnaire"
      v-on:addQuestion="addQuestion"
      v-on:deleteQuestion="deleteQuestion"
      v-bind:questionnaire="questionnaire"
      v-bind:questions="questions"
    >
    </CreateQuestionnaire>
    <div v-else>
      <li v-for="q in questionnaires" :key="q.id">
        <b-button variant="link" v-on:click="edit(q.id)">{{ q.title }}</b-button>
        <b-button size="sm" variant="danger" v-on:click="deleteQuestionnaire(q.id)">x</b-button>
      </li>
      <b-button variant="primary" v-on:click="newQuestionnaire">Новый опросник</b-button>
    </div>
  </div>
</template>

<script>
import CreateQuestionnaire from '@/components/CreateQuestionnaire.vue';
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/';

export default {
  components: {
    CreateQuestionnaire,
  },
  data() {
    return {
      isEditView: false,
      questionnaires: [],
      questions: [],
      questionnaire: {},
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
      axios.get(`${BASE_API_URL}admin/questionnaires/`, config).then((response) => {
        this.questionnaires = response.data;
      });
      axios.get(`${BASE_API_URL}admin/questions/`, config).then((response) => {
        this.questions = response.data;
      });
    },
    edit(qid) {
      this.questionnaire = this.questionnaires.find((e) => e.id === qid);
      this.isEditView = true;
    },
    newQuestionnaire() {
      this.questionnaire = {
        time_to_answer: 0,
        allow_answer_modify: false,
        questions: [],
      };
      this.isEditView = true;
    },
    saveQuestionnaire() {
      this.getData();
      this.isEditView = false;
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      if (this.questionnaire.id) {
        axios.put(`${BASE_API_URL}admin/questionnaires/${this.questionnaire.id}`, this.questionnaire, config).then(
          () => this.getData(),
        ).catch((error) => { alert(error); });
      } else {
        axios.post(`${BASE_API_URL}admin/questionnaires/`, this.questionnaire, config).then(
          () => this.getData(),
        ).catch((error) => { alert(error); });
      }
    },
    cancel() {
      this.getData();
      this.questionnaire = {};
      this.isEditView = false;
    },
    addQuestion() {
      this.questionnaire.questions.push(
        { question: { id: 0 }, answer_weight: 1, time_to_answer: 0 },
      );
    },
    deleteQuestion(question) {
      this.questionnaire.questions = this.questionnaire.questions.filter(
        (element) => !(element.question.id === question.id),
      );
    },
    deleteQuestionnaire(qid) {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.delete(`${BASE_API_URL}admin/questionnaires/${qid}`, config).then(() => this.getData()).catch((error) => {
        console.log(error.response.data);
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
