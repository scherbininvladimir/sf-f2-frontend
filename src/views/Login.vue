<template>
 <div>
   <b-alert v-model="showErrorAlert" variant="danger" dismissible>
    {{ Message }}
   </b-alert>
    <h1>Вход в систему</h1>
    <b-form @submit.prevent="onSubmit">
      <b-form-row class="d-flex justify-content-center align-items-center">

        <b-form-group label="Имя пользователя:">
          <b-input required v-model="username" type="text" placeholder="Логин"/>
        </b-form-group>

      </b-form-row>
      <b-form-row class="d-flex justify-content-center align-items-center">

        <b-form-group label="Пароль:">
          <b-input required v-model="password" type="password" placeholder="Пароль"/>
        </b-form-group>

      </b-form-row>
      <b-form-row class="d-flex justify-content-center align-items-center">

        <b-button variant="primary" type="submit">Войти</b-button>

      </b-form-row>
    </b-form>
 </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      showErrorAlert: false,
      Message: '',
      username: '',
      password: '',
    };
  },
  methods: {
    onSubmit() {
      const requestData = {
        username: this.username,
        password: this.password,
      };
      axios.post('token/', requestData)
        .then((response) => {
          localStorage.setItem('jwt_token', response.data.access);
          localStorage.setItem('jwt_refresh_token', response.data.refresh);
          const userData = {
            id: response.data.user_id,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            is_staff: response.data.is_staff,
          };
          localStorage.user = JSON.stringify(userData);
          if (response.data.is_staff) {
            this.$router.push('Qmanager');
          } else {
            this.$router.push('Quser');
          }
        }).catch((error) => {
          this.Message = error.response.data;
          this.showErrorAlert = true;
        });
    },
  },
  mounted() {
    axios.defaults.baseURL = this.$BASE_API_URL;
    axios.defaults.headers.post['Content-CSRFToken'] = this.$cookies.get('csrftoken');
  },
};
</script>
