<template>
  <div class="Quser">
    <p>Привет, {{ user.first_name }}!</p>
    <h2>Назначенные Вам опросники:</h2>
     <table>
       <tr>
         <th>Название</th>
         <th>Дата начала опроса</th>
         <th>Дата окончания опроса</th>
         <th>Статус</th>
         <th></th>
         <th></th>
       </tr>
       <tr v-for="(questionnaire, id) in OpenQuestionnaires" :key="id">
         <td>{{ questionnaire.title }}</td>
         <td>{{ questionnaire.start_date }}</td>
         <td>{{ questionnaire.end_date }}</td>
         <td>
           Отвечено на {{ questionnaire.stat.questionsWithAnswers }}
           вопросов из {{ questionnaire.stat.questionsInQestionnaire }}
         </td>
         <td v-if="questionnaire.link"><a :href="questionnaire.link">Перейти к вопросам</a></td>
       </tr>
     </table>
    <h2>Завершенные опросники</h2>
         <table>
       <tr>
         <th>Название</th>
         <th>Дата начала опроса</th>
         <th>Дата окончания опроса</th>
         <th>Статус</th>
       </tr>
       <tr v-for="(questionnaire, id) in ClosedQuestionnaires" :key="id">
         <td>{{ questionnaire.title }}</td>
         <td>{{ questionnaire.start_date }}</td>
         <td>{{ questionnaire.end_date }}</td>
        <td>
           Отвечено на {{ questionnaire.stat.questionsWithAnswers }}
           вопросов из {{ questionnaire.stat.questionsInQestionnaire }}
         </td>
       </tr>
     </table>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/';

export default {
  name: 'Quser',
  mounted() {
    this.getData();
  },
  data() {
    return {
      questionnaireList: [],
      OpenQuestionnaires: [],
      ClosedQuestionnaires: [],
      user: JSON.parse(localStorage.user),
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
      axios.get(`${BASE_API_URL}questionnaires/`, config).then((response) => {
        this.questionnaireList = response.data.map((questionnaire) => {
          const q = questionnaire;
          q.isOpen = false;
          if ((Date.now() <= (Date.parse(questionnaire.end_date) + 1000 * 60 * 60 * 24))) {
            q.isOpen = true;
          }
          q.stat = {
            questionsInQestionnaire: q.questions.length,
            questionsWithAnswers: 0,
          };
          axios.get(`${BASE_API_URL}results/${q.id}`, config).then((answersRespnse) => {
            q.questions.map((questionInQueestionnaire) => {
              const obj = questionInQueestionnaire;
              obj.isAnswerred = false;
              if (answersRespnse.data.filter(
                (answer) => answer.questionnaire_content === questionInQueestionnaire.id,
              ).length) obj.isAnswerred = true;
              return obj;
            });
            q.stat.questionsWithAnswers = q.questions.filter((obj) => obj.isAnswerred).length;
            if (q.isOpen) {
              if (
                Date.parse(q.start_date) < Date.now()
                && (
                  q.stat.questionsWithAnswers < q.stat.questionsInQestionnaire
                  || q.allow_answer_modify
                )
              ) {
                q.link = `/questionnaire/${q.id}`;
              } else {
                q.link = '';
              }
            }
            if (q.isOpen) {
              this.OpenQuestionnaires.push(q);
            } else {
              this.ClosedQuestionnaires.push(q);
            }
          });
          return q;
        });
      });
    },
  },
};
</script>
