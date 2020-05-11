<template>
  <div id="app" class="container">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/quser">Личный кабинет пользователя</router-link> |
      <span v-if="isStaff">
        <router-link  to="/qmanager">Управление опросами</router-link> |
      </span>
      <a href="http://127.0.0.1:8000/admin">Django admin</a>
      <span v-if="isLogin">
        Здравствуйте, {{ first_name }}! <a href="" v-on:click="logout">Выход</a>
      </span>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isStaff: false,
      isLogin: false,
      first_name: '',
    };
  },
  watch: {
    // call again the method if the route changes
    $route: 'getData',
  },
  methods: {
    getData() {
      if (localStorage.user) {
        this.isLogin = true;
        const user = JSON.parse(localStorage.user);
        this.first_name = user.first_name;
        this.isStaff = user.is_staff;
      }
    },
    logout() {
      this.$cookies.remove('jwt_token');
      this.$cookies.remove('jwt_refresh_token');
      this.$router.push({ path: '/' });
      localStorage.removeItem('user');
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
