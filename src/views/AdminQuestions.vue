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
      isEditView: false,
      questions: [],
      question: {},
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
      axios.get(`${this.$BASE_API_URL}admin/questions/`, config).then((response) => {
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
      this.question = { answers_number: 'O', question_type: 'T', response: [{ answer_weight: 0 }] };
      this.isEditView = true;
    },
    SaveQuestion() {
      this.isEditView = false;
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      if (this.question.id) {
        axios.put(`${this.$BASE_API_URL}admin/questions/${this.question.id}`, this.question, config).then(() => {
          const formData = new FormData();
          formData.append('file', this.question.picture_file);
          axios.put(`${this.$BASE_API_URL}admin/question_image/${this.question.picture_file.name}/${this.question.id}`, formData, {
            headers: {
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'multipart/form-data',
            },
          }).then(() => this.getData()).catch((error) => console.log(error.response.data));
          this.getData();
        }).catch((error) => {
          console.log(error.response.data);
        });
      } else {
        axios.post(`${this.$BASE_API_URL}admin/questions/`, this.question, config).then(() => this.getData()).catch((error) => {
          console.log(error.response.data);
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
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.delete(`${this.$BASE_API_URL}admin/questions/${qid}`, config).then(() => this.getData()).catch((error) => {
        console.log(error.response.data);
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
