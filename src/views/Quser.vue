<template>
  <div class="Quser">
    <b-alert v-model="showErrorAlert" variant="danger" dismissible>
      {{ Message }}
    </b-alert>
    <h2>Назначенные Вам опросники:</h2>
     <table class="table table-bordered table-sm">
       <tr>
         <th>Название</th>
         <th>Дата начала опроса</th>
         <th>Дата окончания опроса</th>
         <th>Статус (отвечено/всего вопросов)</th>
         <th></th>
       </tr>
       <tr v-for="(questionnaire, id) in OpenQuestionnaires" :key="id">
         <td>{{ questionnaire.title }}</td>
         <td>{{ questionnaire.start_date }}</td>
         <td>{{ questionnaire.end_date }}</td>
         <td>
           {{ questionnaire.number_of_answerred_questions }} /
           {{ questionnaire.number_of_questions }}
         </td>
         <td v-if="questionnaire.link"><a :href="questionnaire.link">Перейти к вопросам</a></td>
       </tr>
     </table>
    <h2>Завершенные опросники</h2>
      <table class="table table-bordered table-sm">
       <tr>
         <th>Название</th>
         <th>Дата начала опроса</th>
         <th>Дата окончания опроса</th>
         <th>Статус (отвечено/всего вопросов)</th>
         <th>Информация по опоросам</th>
       </tr>
       <tr v-for="(questionnaire, id) in ClosedQuestionnaires" :key="id">
         <td>{{ questionnaire.title }}</td>
         <td>{{ questionnaire.start_date }}</td>
         <td>{{ questionnaire.end_date }}</td>
        <td>
           {{ questionnaire.number_of_answerred_questions }} /
            {{ questionnaire.number_of_questions }}
         </td>
         <td>
           Вы набрали: {{questionnaire.users_scores.your_score}}.
           Другие сотрудники {{questionnaire.users_scores.generalized_stat}}
          </td>
       </tr>
     </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Quser',
  mounted() {
    this.getData();
  },
  data() {
    return {
      showErrorAlert: false,
      Message: '',
      OpenQuestionnaires: [],
      ClosedQuestionnaires: [],
      statusInfo: [],
    };
  },
  methods: {
    getData() {
      const jwt = localStorage.getItem('jwt_token');
      axios.defaults.baseURL = this.$BASE_API_URL;
      axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
      axios.get('questionnaires/').then((response) => {
        const Questionnaires = response.data.map((questionnaire) => {
          const r = questionnaire;
          r.link = '';
          if (r.isOpen
          && (r.allow_answer_modify
          || r.number_of_questions > r.number_of_answerred_questions)
          && (r.allow_answer_modify || !r.users_scores.your_score)) {
            r.link = `/questionnaire/${r.id}`;
          }
          return r;
        });
        this.OpenQuestionnaires = Questionnaires.filter((element) => element.isOpen);
        this.ClosedQuestionnaires = Questionnaires.filter((element) => !element.isOpen);
      }).catch((error) => {
        this.Message = error.response.data;
        this.showErrorAlert = true;
      });
    },
  },
};
</script>
