<template>
  <div class="Qmanager">
    <ul id="nav">
      <li>
        <router-link to="/qmanager/questions">Вопросы</router-link> |
        <router-link to="/qmanager/questionnaires">Опросники</router-link> |
        <router-link to="/qmanager/">Отчеты</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Qmanager',
};
</script>
