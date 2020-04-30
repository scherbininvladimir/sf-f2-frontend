<template>
  <div class="Quser">
    <p>Привет, {{ user.first_name }}!</p>
    <h2>Назначенные Вам опросники:</h2>
     <table>
       <tr>
         <th>Название</th>
         <th>Дата начала опроса</th>
         <th>Дата окончания опроса</th>
         <th></th>
       </tr>
       <tr v-for="(questionnaire, id) in OpenQuestionnaires" :key="id">
         <td>{{ questionnaire.title }}</td>
         <td>{{ questionnaire.start_date }}</td>
         <td>{{ questionnaire.end_date }}</td>
         <td>{{ questionnaire.isActive }}</td>
         <td>{{ questionnaire.isDone }}</td>
         <td><a :href="questionnaire.link">Начать</a></td>
       </tr>
     </table>
    <h2>Завершенные опросники</h2>
         <table>
       <tr>
         <th>Название</th>
         <th>Дата начала опроса</th>
         <th>Дата окончания опроса</th>
       </tr>
       <tr v-for="(questionnair, id) in ClosedQuestionnaires" :key="id">
         <td>{{ questionnair.title }}</td>
         <td>{{ questionnair.start_date }}</td>
         <td>{{ questionnair.end_date }}</td>
       </tr>
     </table>

  </div>
</template>

<script>
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080/api/';

export default {
  name: 'Quser',
  components: {
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
        this.OpenQuestionnaires = response.data.filter((questionnaire) => {
          const UserInTargetUsers = questionnaire.target_users.find((el) => {
            if (el === parseInt(this.user.id, 10)) {
              return el;
            }
            return false;
          });
          if (
            UserInTargetUsers
            && (Date.now() <= (Date.parse(questionnaire.end_date) + 1000 * 60 * 60 * 24))
          ) {
            return true;
          }
          return false;
        }).map((questionnaire) => {
          const q = questionnaire;
          if (Date.parse(q.start_date) < Date.now()) {
            q.link = `/questionnaire/${q.id}`;
          } else {
            q.link = false;
          }
          return q;
        });
        this.ClosedQuestionnaires = response.data.filter((questionnaire) => {
          const UserInTargetUsers = questionnaire.target_users.find((el) => {
            if (el === parseInt(this.user.id, 10)) {
              return el;
            }
            return false;
          });
          if (
            UserInTargetUsers
            && Date.parse(questionnaire.end_date) + 1000 * 60 * 60 * 24 < Date.now()
          ) {
            return true;
          }
          return false;
        });
      });
    },
  },
  data() {
    return {
      user: JSON.parse(localStorage.user),
      OpenQuestionnaires: [],
      ClosedQuestionnaires: [],
    };
  },
  mounted() {
    this.getData();
  },
};
</script>
