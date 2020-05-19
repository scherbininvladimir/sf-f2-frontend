<template>
  <div>
    <b-alert v-model="showErrorAlert" variant="danger" dismissible>
      {{ Message }}
    </b-alert>
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
          <a v-on:click="deleteQuestion(q.id)" class="deleteButton" href="#">&#x2718;</a>
        </li>
      <b-button variant="primary" v-on:click="newQuestion">Новый вопрос</b-button>
    </div>
  </div>
</template>
<script>
import CreateQuestion from '@/components/CreateQuestion.vue';
import axios from 'axios';

export default {
  components: {
    CreateQuestion,
  },
  data() {
    return {
      showErrorAlert: false,
      Message: '',
      isEditView: false,
      questions: [],
      question: {},
    };
  },
  methods: {
    getData() {
      axios.get('admin/questions/').then((response) => {
        this.questions = response.data;
      }).catch((error) => {
        this.showErrorAlert = true;
        this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
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
      this.question = { answers_number: 'O', question_type: 'T', response: [{ answer_weight: 0 }] };
      this.isEditView = true;
    },
    SaveQuestion() {
      this.isEditView = false;
      if (this.question.id) {
        axios.put(`admin/questions/${this.question.id}`, this.question).then(() => {
          const formData = new FormData();
          formData.append('file', this.question.picture_file);
          axios.defaults.headers.put['Content-Type'] = 'multipart/form-data';
          axios.put(
            `admin/question_image/image-${this.question.id}/${this.question.id}`,
            formData,
          ).then(() => this.getData()).catch((error) => {
            this.showErrorAlert = true;
            this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
          });
          this.getData();
        }).catch((error) => {
          this.showErrorAlert = true;
          this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
        });
      } else {
        axios.post(`${this.$BASE_API_URL}admin/questions/`, this.question).then(() => this.getData()).catch((error) => {
          this.showErrorAlert = true;
          this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
        });
      }
    },
    addResponse() {
      if (this.question.id) {
        this.question.response.push({ question: this.question.id, answer_weight: 0 });
      } else {
        this.question.response.push({ answer_weight: 0 });
      }
    },
    deleteResponse(response) {
      this.question.response = this.question.response.filter((element) => !(element === response));
    },
    deleteQuestion(qid) {
      axios.delete(`admin/questions/${qid}`).then(() => this.getData()).catch((error) => {
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
