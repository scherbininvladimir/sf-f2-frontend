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
      v-bind:users="users"
    >
    </CreateQuestionnaire>
    <div v-else>
      <li v-for="q in questionnaires" :key="q.id">
        <b-button variant="link" v-on:click="edit(q.id)">{{ q.title }}</b-button>
        <a v-on:click="deleteQuestionnaire(q.id)" class="deleteButton" href="#">&#x2718;</a>
      </li>
      <b-button variant="primary" v-on:click="newQuestionnaire">Новый опросник</b-button>
    </div>
  </div>
</template>

<script>
import CreateQuestionnaire from '@/components/CreateQuestionnaire.vue';
import axios from 'axios';

export default {
  components: {
    CreateQuestionnaire,
  },
  data() {
    return {
      isEditView: false,
      questionnaires: [],
      questions: [],
      users: [],
      questionnaire: {},
    };
  },
  methods: {
    getData() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.get(`${this.$BASE_API_URL}admin/questionnaires/`, config).then((response) => {
        this.questionnaires = response.data;
      });
      axios.get(`${this.$BASE_API_URL}admin/questions/`, config).then((response) => {
        this.questions = response.data;
      });
      axios.get(`${this.$BASE_API_URL}admin/users/`, config).then((response) => {
        this.users = response.data;
      });
    },
    edit(qid) {
      this.questionnaire = this.questionnaires.find((e) => e.id === qid);
      this.isEditView = true;
    },
    newQuestionnaire() {
      const today = new Date().toISOString().slice(0, 10);
      this.questionnaire = {
        start_date: today,
        end_date: today,
        time_to_answer: 0,
        allow_answer_modify: false,
        questions: [],
        target_users: [],
      };
      this.isEditView = true;
    },
    saveQuestionnaire() {
      this.getData();
      this.isEditView = false;
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      if (this.questionnaire.id) {
        axios.put(`${this.$BASE_API_URL}admin/questionnaires/${this.questionnaire.id}`, this.questionnaire, config).then(
          () => this.getData(),
        ).catch((error) => { console.log(error.response.data); });
      } else {
        axios.post(`${this.$BASE_API_URL}admin/questionnaires/`, this.questionnaire, config).then(
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
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.delete(`${this.$BASE_API_URL}admin/questionnaires/${qid}`, config).then(() => this.getData()).catch((error) => {
        console.log(error.response.data);
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
