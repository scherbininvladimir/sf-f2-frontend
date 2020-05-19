<template>
  <div>
   <b-alert v-model="showErrorAlert" variant="danger" dismissible>
    {{ Message }}
   </b-alert>
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
      showErrorAlert: false,
      Message: '',
      isEditView: false,
      questionnaires: [],
      questions: [],
      users: [],
      questionnaire: {},
    };
  },
  methods: {
    getData() {
      axios.get('admin/questionnaires/').then((response) => {
        this.questionnaires = response.data;
      }).catch((error) => {
        this.showErrorAlert = true;
        this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
      });
      axios.get('admin/questions/').then((response) => {
        this.questions = response.data;
      }).catch((error) => {
        this.showErrorAlert = true;
        this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
      });
      axios.get('admin/users/').then((response) => {
        this.users = response.data;
      }).catch((error) => {
        this.showErrorAlert = true;
        this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
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
      if (this.questionnaire.id) {
        axios.put(`admin/questionnaires/${this.questionnaire.id}`, this.questionnaire).then(
          () => this.getData(),
        ).catch((error) => {
          this.showErrorAlert = true;
          this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
        });
      } else {
        axios.post('admin/questionnaires/', this.questionnaire).then(
          () => this.getData(),
        ).catch((error) => {
          this.showErrorAlert = true;
          this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
        });
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
      axios.delete(`admin/questionnaires/${qid}`).then(() => this.getData()).catch((error) => {
        this.showErrorAlert = true;
        this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
      });
    },
  },
  mounted() {
    const jwt = localStorage.getItem('jwt_token');
    axios.defaults.baseURL = this.$BASE_API_URL;
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    this.getData();
  },
};
</script>
