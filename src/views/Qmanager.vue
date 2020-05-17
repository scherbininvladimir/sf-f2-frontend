<template>
  <div class="Qmanager">
    <ul id="nav">
      <li>
        <router-link to="/qmanager/questions">Вопросы</router-link> |
        <router-link to="/qmanager/questionnaires">Опросники</router-link> |
        <router-link to="/qmanager/">Отчеты</router-link> |
        <a href="http://95.165.133.240/admin">Django admin</a>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Qmanager',
  data() {
    return {
      user: JSON.parse(localStorage.user),
    };
  },
  methods: {
    SaveQuestion() {
      console.log('Сохраняю вопрос', this.question);
    },
  },
};
</script>
