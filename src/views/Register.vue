<template>
  <div class="register">
    <div>
      <form @submit.prevent="submit">
        <div>
          <label for="user_name">Name:</label>
          <input type="text" name="user_name" v-model="form.user_name" />
        </div>
        <div>
          <label for="user_email">Email:</label>
          <input type="email" name="user_email" v-model="form.user_email" />
        </div>
        <div>
          <label for="user_type">User Type:</label>
          <select name="user_type" v-model="form.user_type">
            <option value="therapists">Therapists</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        <div>
          <label for="user_age">Age:</label>
          <input type="number" name="user_age" v-model="form.user_age" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" name="password" v-model="form.password" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
    <p v-if="showError" id="error">Username already exists</p>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Register",
  components: {},
  data() {
    return {
      form: {
        user_name: "",
        user_email: "",
        user_age: "",
        user_type: "",
        password: "",
        re_password: "",
      },
      showError: false
    };
  },
  methods: {
    ...mapActions(["Register"]),
    async submit() {
      try {
        await this.Register(this.form);
        this.$router.push("/posts");
        this.showError = false
      } catch (error) {
        this.showError = true
      }
    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}

label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 30px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

input, select {
  margin: 5px;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  padding: 10px;
  border-radius: 30px;
  width: 300px;
}
#error {
  color: red;
}
</style>
