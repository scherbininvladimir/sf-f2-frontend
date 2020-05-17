<template>
  <div id="app" class="container">
    <div id="nav">
      <router-link to="/">Главная</router-link> |
      <router-link to="/quser">Личный кабинет пользователя</router-link> |
      <span v-if="isStaff">
        <router-link  to="/qmanager">Управление опросами</router-link> |
      </span>
      <span v-if="isLogin">
        <a href="" v-on:click="logout">Выход</a>
      </span>
    </div>
    <p v-if="isLogin">Здравствуйте, {{ first_name }}!</p>
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
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_refresh_token');
      localStorage.removeItem('user');
      this.$router.push({ path: '/' });
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

a {
  font-weight: bold;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
}

.deleteButton {
  color: red;
  text-decoration: none;
}

.deleteButton:hover {
  text-decoration: none;
  color: red;
}
</style>
