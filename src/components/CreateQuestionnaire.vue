<template>
    <div>
      <b-form @submit="onSubmit" @reset="onReset">

        <b-form-row>

          <b-form-group
            id="input-group-1"
            label="Название опросника: "
            label-for="input-1"
            class="col-12"
          >
            <b-form-input
              id="input-1"
              v-model="questionnaire.title"
              type="text"
              required
              placeholder="Введите название опросника"
            ></b-form-input>
          </b-form-group>

        </b-form-row>
        <b-form-row>

          <b-form-group label="Дата начала опроса">
            <b-form-datepicker
              v-model="questionnaire.start_date"
              class="mb-2"
            >
            </b-form-datepicker>
          </b-form-group>

          <b-form-group label="Дата окончания опроса">
            <b-form-datepicker
              v-model="questionnaire.end_date"
              class="mb-2"
            >
            </b-form-datepicker>
          </b-form-group>

        </b-form-row>
        <b-form-row>

          <b-form-group label="Сотрудники, которым назначен опросник">
            <b-form-select
              v-model="questionnaire.target_users"
              :options="selectUserOptions"
              multiple
              :select-size="10"
            >
            </b-form-select>
          </b-form-group>

        </b-form-row>
        <b-form-row>

          <b-form-group label="Описание" class="col-12">
            <textarea
              v-model="questionnaire.description"
              class="col-12"
              placeholder="Введите описание опросника"
            >
            </textarea>
          </b-form-group>

        </b-form-row>
        <b-form-row>

          <b-form-group
            label="Разрешать пользователям менять ответы в сохраненных опросниках"
            class="col-6"
          >
            <b-form-checkbox
              :id="'input-5-' + questionnaire.id"
              v-model="questionnaire.allow_answer_modify"
            >

          </b-form-checkbox>
          </b-form-group>

          <b-form-group
            class="col-6"
            label="Время на прохождение опросника в секундах (0 - нет ограничений): "
          >
            <b-form-input
              v-model="questionnaire.time_to_answer"
              type="number"
              required
            ></b-form-input>
          </b-form-group>

        </b-form-row>
        <b-form-row
          v-for="q in questionnaire.questions"
          :key="q.id"
          class="d-flex align-items-end"
        >

          <b-form-group label="Вопрос" class="col-5">
            <b-form-select
              v-model="q.question"
              :options="selectQuestionOptions"
            >
            </b-form-select>
          </b-form-group>

          <b-form-group
            label="Ограничение времени на ответ."
            class="col-3"
          >
            <b-form-input
              v-model="q.time_to_answer"
              type="number"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Вес ответа в опроснике" class="col-3">
            <b-form-input
              v-model="q.answer_weight"
              type="number"
            ></b-form-input>
          </b-form-group>

          <b-form-group class="col-1">
            <b-button
              v-on:click="$emit('deleteQuestion', q.question);"
              variant="danger"
            >
              Х
            </b-button>
          </b-form-group>


        </b-form-row>
        <b-form-row>

          <b-col>
            <b-button
              v-on:click="$emit('addQuestion')"
            >
                Добавить вопрос
            </b-button>
          </b-col>
          <b-col>
            <b-button type="submit" variant="primary">Сохранить</b-button>
            <b-button type="reset" variant="danger">Отмена</b-button>
          </b-col>

        </b-form-row>

      </b-form>

    </div>
</template>

<script>
export default {
  props: ['questionnaire', 'questions', 'users'],
  data() {
    return {
      selectQuestionOptions: [],
      selectUserOptions: [],
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$emit('saveQuestionnaire');
    },
    onReset(evt) {
      evt.preventDefault();
      this.$emit('cancel');
    },
    getData() {
      this.selectQuestionOptions = this.questions.map(
        (element) => {
          const option = {
            value: {
              id: element.id,
              title: element.title,
            },
            text: element.title,
          };
          return option;
        },
      );
      this.selectUserOptions = this.users.map(
        (element) => {
          const option = {
            value: element.id,
            text: `${element.first_name} ${element.last_name}`,
          };
          return option;
        },
      );
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
