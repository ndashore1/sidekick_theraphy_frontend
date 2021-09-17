<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <span v-if="isLoggedIn">
      <!-- <router-link v-if="loginType === 'therapists'" to="/goals">Goals</router-link> | -->
      <router-link v-if="loginType === 'therapists'"  to="/goals">Goals</router-link><span v-if="loginType === 'therapists'"> | </span>
      <router-link to="/plan-of-care">Plan Of Care</router-link> |
      <router-link v-if="loginType === 'patient'" to="/switch-therapist">Switch Therapist</router-link><span v-if="loginType === 'patient'"> | </span>
      <a @click="logout">Logout</a>
    </span>
    <span v-else> 
      <!-- <router-link to="/register">Register</router-link> | -->
      <router-link to="/login">Login</router-link>
    </span>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "NavBar",
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isAuthenticated;
    },

    loginType: function() {
      return this.$store.getters.StateuserType;
    }
  },
  methods: {
    async logout() {
      var config = {
        method: 'delete',
        url: '/api/v1/sessions/sign_out',
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
        console.log(response);
          this.$store.dispatch("LogOut");
          this.$router.push("/login");
        })
      .catch(error => {
          console.log("Error Thrown "+error);
      });
    },
  },
};
</script>

<style>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

a:hover {
  cursor: pointer;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
