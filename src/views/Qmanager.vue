<template>
  <div class="Qmanager">
    <p>Здравствуйте, {{ user.first_name }}!</p>
    <Status />
  </div>
</template>

<script>
import Status from '@/components/Status.vue';

export default {
  name: 'Qmanager',
  components: {
    Status,
  },
  data() {
    return {
      user: JSON.parse(localStorage.user),
    };
  },
};
</script>
