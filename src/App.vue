<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/quser">Личный кабинет пользователя</router-link> |
      <router-link to="/qmanager">Управление опросами</router-link> |
      <a href="http://127.0.0.1:8000/admin">Django admin</a> |
      <a href="" v-on:click="logout">Выйти</a>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  methods: {
    logout() {
      this.$cookies.remove('jwt_token');
      this.$router.push({ path: '/' });
    },
    test() {
      this.$router.push({ path: '/' });
    },
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
