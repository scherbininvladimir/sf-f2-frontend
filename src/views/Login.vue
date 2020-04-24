<template>
 <div>
   <form class="login" @submit.prevent="onSubmit">
     <h1>Sign in</h1>
     <label>User name</label>
     <input required v-model="username" type="text" placeholder="Snoopy"/>
     <label>Password</label>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr/>
     <button type="submit">Login</button>
   </form>
 </div>
</template>

<script>
import axios from 'axios';

const AUTH_URL = 'http://localhost:8080/api/token/';

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
      axios.post(AUTH_URL, requestData, config)
        .then((response) => {
          this.$cookies.set('jwt_token', response.data.access);
          this.$cookies.set('jwt_refresh_token', response.data.refresh);
          if (response.data.is_staff) {
            this.$router.push('Qmanager');
          } else {
            this.$router.push('QQ');
          }
        });
    },
  },
};
</script>
