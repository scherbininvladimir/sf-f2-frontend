  <template>
    <div>
        <h1>{{ this.questionnaire.title }}</h1>
        <div v-if="isDone">
          <h2>Спасибо за Ваши ответы!</h2>
          <a href="/Quser">Перейти в личный кабинет</a>
        </div>
        <div v-else>
          <div v-if="showQuestion">
            <p v-if="questionInQuestionnaire.time_to_answer">
              Время ответа на вопрос: {{ questionTimeLeft }}
            </p>
            <p v-if="questionInQuestionnaire.questionnaire.time_to_answer">
              Время ответа на опросник:
              {{ questionnaireTimeLeft }}
            </p>
            <p>{{ this.questionInQuestionnaire.question.content }}</p>
            <div v-if="this.questionInQuestionnaire.question.picture">
              <b-img
                :src="this.questionInQuestionnaire.question.picture"
                fluid alt="Картинка">
              </b-img>
            </div>
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
            <button v-on:click="save">
              Сохранить и перейти к следующему
            </button>
            <button v-on:click="next">
              Не сохранять и перейти к следующему
            </button>
          </div>
          <div v-else>
            <div v-if="questionInQuestionnaire.id">
              <p>Время вышло</p>
              <button v-on:click="next">Продолжить</button>
            </div>
            <button v-else v-on:click="start">Начать</button>
          </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['qid'],
  data() {
    return {
      questionnaireContent: [],
      questionnaire: {},
      questionInQuestionnaire: {},
      answer: [],
      isDone: false,
      showQuestion: false,
      questionTimeLeft: -1,
      questionnaireTimeLeft: -1,
      user: JSON.parse(localStorage.user),
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    start() {
      this.next();
      this.questionnaireTimeLeft = this.questionnaire.time_to_answer
        ? this.questionnaire.time_to_answer : -1;
      this.countDown();
    },
    next() {
      this.questionInQuestionnaire = this.questionnaireContent.shift();
      this.answer = [];
      this.showQuestion = true;
      if (this.questionInQuestionnaire) {
        this.questionTimeLeft = this.questionInQuestionnaire.time_to_answer
          ? this.questionTimeLeft = this.questionInQuestionnaire.time_to_answer : -1;
        const jwt = localStorage.getItem('jwt_token');
        const config = {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        };
        axios.get(`${this.$BASE_API_URL}result/get/${this.questionInQuestionnaire.id}`, config).then((response) => {
          if (response.data.questionnaire_content) {
            if (response.data.answer) this.answer = response.data.answer;
          } else {
            const requestData = {
              user: this.user.id,
              questionnaire_content: this.questionInQuestionnaire.id,
              answer: this.answer,
            };
            axios.post(`${this.$BASE_API_URL}/result/create/`, requestData, config);
          }
          if (!this.questionTimeLeft && !this.questionnaireTimeLeft) this.countDown();
        }).catch((error) => {
          alert(`${error.response.status} Ошибка соединения с сервером`);
        });
      } else {
        this.isDone = true;
      }
    },
    save() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      const requestData = {
        user: this.user.id,
        questionnaire_content: this.questionInQuestionnaire.id,
        answer: this.answer,
      };
      axios.put(`${this.$BASE_API_URL}result/update/${this.questionInQuestionnaire.id}`, requestData, config)
        .catch((error) => {
          let message = '';
          if (error.response.data.answer) {
            message = error.response.data.answer;
          } else {
            message = 'Ответ не сохранен. Нет соединения с сервером.';
          }
          alert(message);
        });
      this.next();
    },
    timeOut() {
      this.countDown();
      this.next();
    },
    getData() {
      const jwt = localStorage.getItem('jwt_token');
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
      axios.get(`${this.$BASE_API_URL}questionnaires/${this.qid}`, config).then((response) => {
        this.questionnaireContent = response.data;
        this.questionnaire = response.data.map((element) => element.questionnaire).find(() => true);
      });
    },
    countDown() {
      setTimeout(() => {
        this.questionTimeLeft -= 1;
        this.questionnaireTimeLeft -= 1;
        this.countDown();
        if (!this.questionTimeLeft) this.showQuestion = false;
        if (!this.questionnaireTimeLeft) this.isDone = true;
      }, 1000);
    },
  },
};
</script>

<style>
li {
  list-style: none;
}
</style>
