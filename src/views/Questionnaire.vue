  <template>
    <div>
        <h1>{{ this.questionnaire.title }}</h1>
        <div v-if="isDone">
          <h2>Ваши ответы сохранены!</h2>
          <a href="/Quser">Перейти в личный кабинет</a>
        </div>
        <div v-else>
          <div v-if="showQuestion">
            <p>{{ this.questionInQuestionnaire.question.content }}</p>
            <ul v-if="questionInQuestionnaire.question.answers_number === 'O'">
              <li v-for="(item) in this.questionInQuestionnaire.question.response"
                v-bind:key="item.id">
                <input type="radio" :id="item.id" :value="item.response_option" v-model="answer">
                <label :for="item.id">{{ item.response_option }}</label>
              </li>
            </ul>
            <ul v-else>
              <li v-for="(item) in this.questionInQuestionnaire.question.response"
              v-bind:key="item.id">
                <input type="checkbox" :id="item.id" :value="item.response_option" v-model="answer">
                <label :for="item.id">{{ item.response_option }}</label>
              </li>
            </ul>
          </div>
          <button v-if="questionInQuestionnaire.id"
            v-on:click="ButtonClick">Сохранить ответ
          </button>
          <button v-else v-on:click="ButtonClick">Начать</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/';

export default {
  props: ['qid'],
  data() {
    return {
      questionnaire: {},
      questionInQuestionnaire: {},
      answer: [],
      isDone: false,
      showQuestion: false,
      user: JSON.parse(localStorage.user),
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    ButtonClick() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      if (this.showQuestion) {
        const requestData = {
          user: this.user.id,
          questionnaire_content: this.questionInQuestionnaire.id,
          answer: this.answer,
        };
        // TODO отлавливать ошибки и сообщать пользователю, что его ответ не записан
        axios.put(`${BASE_API_URL}result/update/${this.questionInQuestionnaire.id}`, requestData, config);
      }
      this.questionInQuestionnaire = this.questionnaire.questions.shift();
      this.answer = [];
      if (!this.questionInQuestionnaire) {
        this.isDone = true;
        this.getData();
      } else {
        axios.get(`${BASE_API_URL}result/get/${this.questionInQuestionnaire.id}`, config).then((response) => {
          if (
            this.questionnaire.allow_answer_modify
              || !(response.data.answer
              && (response.data.answer.length || !response.data.answer === ''))
          ) {
            if (response.data.answer) this.answer = response.data.answer;
            this.showQuestion = true;
          } else {
            this.showQuestion = false;
            this.ButtonClick();
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            const requestData = {
              user: this.user.id,
              questionnaire_content: this.questionInQuestionnaire.id,
              answer: this.answer,
            };
            axios.post(`${BASE_API_URL}/result/create/`, requestData, config);
            this.showQuestion = true;
          }
        });
      }
    },
    getData() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.get(`${BASE_API_URL}questionnaires/${this.qid}`, config).then((response) => {
        this.questionnaire = response.data;
      });
    },
  },
};
</script>


<style>
li {
  list-style: none;
}
</style>
