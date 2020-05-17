<template>
 <div>
   <form class="login" @submit.prevent="onSubmit">
     <h1>Вход</h1>
     <label>Имя пользователя </label>
     <input required v-model="username" type="text" placeholder="Логин"/>
     <br>
     <label>Пароль </label>
     <input required v-model="password" type="password" placeholder="Пароль"/>
     <br>
     <button type="submit">Login</button>
   </form>
 </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
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
      const config = {
        headers: {
          'X-CSRFToken': this.$cookies.get('csrftoken'),
        },
      };
      axios.post(`${this.$BASE_API_URL}token/`, requestData, config)
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
        });
    },
  },
};
</script>
