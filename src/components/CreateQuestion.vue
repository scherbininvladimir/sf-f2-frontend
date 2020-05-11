<template>
    <div>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-row>
          <b-form-group
            id="input-group-1"
            label="Название вопроса: "
            label-for="input-1"
            class="col-12"
          >
            <b-form-input
              id="input-1"
              v-model="question.title"
              type="text"
              required
              placeholder="Введите название вопроса"
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group
            id="input-group-2"
            label="Содержание вопроса"
            label-for="input-2"
            class="col-12"
          >
            <b-form-input
              id="input-2"
              v-model="question.content"
              required
              placeholder="Введите содержание вопроса"
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-row>
          <b-form-group id="input-group-3" label="Количество вариантов ответов:">
            <b-form-radio
              v-model="question.answers_number"
              value="O"
              class="col-auto"
            >
              Один ответ из нескольких вариантов
            </b-form-radio>
            <b-form-radio
              v-model="question.answers_number"
              value="M"
              class="col-auto"
            >
              Несколько ответов
            </b-form-radio>
          </b-form-group>
          <b-form-group id="input-group-4" label="Тип вопроса:">
            <b-form-radio
              v-model="question.question_type"
              value="Q">Опросник
            </b-form-radio>
            <b-form-radio
              v-model="question.question_type"
              value="T">Тест
            </b-form-radio>
          </b-form-group>
        </b-form-row>

        <b-form-row v-for="a in question.response" :key="a.id">
          <b-col>
              <b-form-input
                v-model="a.response_option"
                type="text"
                required
                placeholder="Введите вариант ответа"
              >
              </b-form-input>
          </b-col>
          <b-col v-if="question.question_type === 'T'">
            <b-form-checkbox
              :id="'input-5-' + a.id"
              v-model="a.isCorrect">
                Правильный ответ
            </b-form-checkbox>
          </b-col>

          <b-col v-if="question.question_type === 'Q'">
            <b-form-group
              :id="'input-group-5-'+a.id"
              label="Вес ответа"
              label-cols="auto"
            >
              <b-form-input
                v-model="a.answer_weight"
                type="number"
                placeholder="Введите вес ответа"
              >
              </b-form-input>
            </b-form-group>
          </b-col>

          <b-col>
              <b-button v-on:click="$emit('deleteResponse', a);" variant="danger">Х</b-button>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col>
            <b-button
              v-on:click="$emit('addResponse')"
            >
                Добавить вариант ответа
            </b-button>
          </b-col>
          <b-col>
            <b-button type="submit" variant="primary">Сохранить</b-button>
            <b-button type="reset" variant="danger">Отмена</b-button>
          </b-col>
        </b-form-row>
        <!-- <b-row>
          <b-form-group> -->
          <!-- </b-form-group>
        </b-row> -->
      </b-form>


    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ question }}</pre>
    </b-card>
    </div>
</template>

<script>
export default {
  props: ['question'],
  data() {
    return {
      form: {
        tilte: '',
        content: '',
        answers_number: '',
        food: null,
        checked: [],
      },
      foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$emit('saveQuestion');
    },
    onReset(evt) {
      evt.preventDefault();
      this.$emit('cancel');
    },
  },
};
</script>
