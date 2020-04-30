  <template>
    <div>
        <h1>{{ this.questionnaire.title }}</h1>
        <div v-if="isDone">
          <h2>Ваши ответы сохранены!</h2>
          <a href="/Quser">Перейти в личный кабинет</a>
        </div>
        <div v-else>
          <div v-if="this.questionInQuestionnaire.id">
            <p>{{ this.questionInQuestionnaire.question.content }}</p>
            <ul v-if="isOneAnswer">
              <li v-for="(item, index) in this.questionInQuestionnaire.question.response_options"
                v-bind:key="item.id">
                <input type="radio" :id="index" :value="item.option" v-model="answer">
                <label :for="index">{{ item.option }}</label>
              </li>

            </ul>
            <ul v-else>
              <li v-for="(item, index) in this.questionInQuestionnaire.question.response_options"
              v-bind:key="item.id">
                <input type="checkbox" :id="index" :value="item.option" v-model="answer">
                <label :for="index">{{ item.option }}</label>
              </li>
            </ul>
            <p>Answer: {{ answer }}</p>
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
  methods: {
    ButtonClick() {
      const jwt = this.$cookies.get('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      if (this.questionInQuestionnaire.id) {
        console.log('Обновляем в базе ответ', this.answer);
        // Обновить ответ в базе
        const requestData = {
          user: this.user.id,
          questionnaire_content: this.questionInQuestionnaire.id,
          answer: this.answer,
        };
        axios.put(`${BASE_API_URL}result/update/${this.questionInQuestionnaire.id}`, requestData, config);
      }
      this.questionInQuestionnaire = this.questions.shift();
      this.answer = [];
      if (!this.questionInQuestionnaire) {
        this.isDone = true;
      } else {
        this.isOneAnswer = false;
        if (this.questionInQuestionnaire.question.question_type === 'O') {
          this.isOneAnswer = true;
        }
        axios.get(`${BASE_API_URL}result/get/${this.questionInQuestionnaire.id}`, config).then((response) => {
          this.answer = response.data.answer;
        }).catch((error) => {
          if (error.response.status === 404) {
            const requestData = {
              user: this.user.id,
              questionnaire_content: this.questionInQuestionnaire.id,
              answer: this.answer,
            };
            axios.post(`${BASE_API_URL}/result/create/`, requestData, config);
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
        this.questions = response.data.questions;
      });
    },
  },
  data() {
    return {
      questionnaire: {},
      questions: [],
      questionInQuestionnaire: {},
      answer: [],
      isDone: false,
      isOneAnswer: false,
      user: JSON.parse(localStorage.user),
    };
  },
  mounted() {
    this.getData();
  },
};
</script>


<style>
li {
  list-style: none;
}
</style>
