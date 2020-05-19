<template>
  <div>
   <b-alert v-model="showErrorAlert" variant="danger" dismissible>
    {{ Message }}
   </b-alert>
    <div v-if="!isDetail">
      <h2>Общая информация</h2>
      <table class="table table-bordered table-sm">
        <tr>
          <th>Название опросника</th>
          <th>Начало сбора данных</th>
          <th>Окончание сбора данных</th>
          <th>Результаты</th>
        </tr>
        <tr v-for="r in status" :key="r.id">
          <td>{{r.title}}</td>
          <td>{{r.start_date}}</td>
          <td>{{r.end_date}}</td>
          <td>
            <ul>
              <li
                v-for="user in r.users_scores.detail_stat"
                :key="user.id">
                  <b-button variant="link" v-on:click="togleView(user.user_id, r.id)">
                    {{ user.last_name }}&nbsp;({{ user.scores }})
                  </b-button>
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="isDetail">
      <h2>Опросник: {{detailStatus.q_title}}</h2>
      <h2>Сотрудник: {{detailStatus.user_last_name}}</h2>
      <b-button variant="link" v-on:click="togleView()">
        Назад
      </b-button>
      <table class="table table-bordered table-sm">
        <th>Вопрос</th>
        <th>Варианты ответа</th>
        <th>Ответ пользователя</th>
        <th>Вес ответа</th>
        <th>Вес вопроса в опроснике</th>
        <tr v-for="r in detailStatus.results" :key="r.id">
          <td>{{r.questionnaire_content.question.title}}</td>
          <td>
            <ul>
              <li v-for="q in r.questionnaire_content.question.response" :key="q.id">
                {{ q.response_option }}
                <span
                  v-if="r.questionnaire_content.question.question_type == 'T' && q.isCorrect"
                >
                  &#x2713;
                </span>
                <span
                  v-if="r.questionnaire_content.question.question_type == 'Q'"
                >
                  ({{q.answer_weight}})
                </span>
              </li>
            </ul>
          </td>
          <td>{{r.answer}}</td>
          <td>{{r.score}}</td>
          <td>{{r.questionnaire_content.answer_weight}}</td>
        </tr>
      </table>
      <b-button variant="link" v-on:click="togleView()">
        Назад
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Status',
  data() {
    return {
      showErrorAlert: false,
      Message: '',
      isDetail: false,
      detailStatus: {
        results: [],
        user_last_name: '',
        q_title: '',
      },
      status: [],
      user: JSON.parse(localStorage.user),
    };
  },
  mounted() {
    const jwt = localStorage.getItem('jwt_token');
    axios.defaults.baseURL = this.$BASE_API_URL;
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    this.getData();
  },
  methods: {
    togleView(uid, qid) {
      if (!uid && !qid) {
        this.isDetail = false;
      } else {
        this.isDetail = true;
        axios.get(`admin/stat/${uid}/${qid}`).then((response) => {
          this.detailStatus.results = response.data;
          this.detailStatus.user_last_name = response.data.find(
            (element) => element.user.last_name,
          ).user.last_name;
          this.detailStatus.q_title = response.data.find(
            (element) => element.questionnaire_content.questionnaire.title,
          ).questionnaire_content.questionnaire.title;
        }).catch((error) => {
          this.showErrorAlert = true;
          this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
        });
      }
    },
    getData() {
      axios.get('admin/stat/').then((response) => {
        this.status = response.data;
      }).catch((error) => {
        this.showErrorAlert = true;
        this.Message = `Ошибка соединения с сервером: ${error.response.data}`;
      });
    },
  },
};
</script>
