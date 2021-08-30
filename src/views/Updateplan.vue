<template>
  <div class="container">
    <div v-if="User">
      <p>Hi {{ User }}</p>
    </div>
    <div id="goal-div">
        <form @submit.prevent="UpdatePlan">
          <div class="alert alert-primary" role="alert" v-if="planAdded">{{ planAdded }}</div>
          <div>
            <label for="name">Update Plan Name:</label>
            <input type="text" name="goal_name" v-model="form.name" />
          </div>
          <div v-if="show_therapist === 'show'">
            <label for="therapist_id">Select Therapist:</label>
            <select name="therapist_id" v-model="form.therapist_id">
              <option v-for="therapist in therapistlist" :key="therapist.id" :value="therapist.id">
                {{ therapist.name }}
              </option>
            </select>
          </div>
          <button type="submit">Update</button>
        </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "Updateplan",
  components: {},
  data() {
    return {
        form: {
            name: "",
            therapist_id: "",
        },
        show_therapist: "",
        plan_of_care: "",
        therapistlist: "",
        planAdded: "",
    };
  },
  created: function() {
    //
    this.ShowPlan();
    this.GetTherapist();
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  methods: {
    async ShowPlan() {
      var config = {
        method: 'get',
        url: 'https://sidekiq-therapy-api.herokuapp.com/api/v1/plan_of_cares/'+this.$route.query.id,
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          console.log("plan details= "+response.data);
          this.plan_of_care = response.data;
          this.Goalslist = response.data.goals;
          this.form.name = response.data.title;
          if(response.data.new_therapists) {
            this.show_therapist = 'hide';
          } else {
            this.show_therapist = 'show';
          }
        })
      .catch(error => {
          //this.show_therapist = 'hide';
          console.log(""+error);
          this.planAdded = 'Something went wrong';
      });
    },
    async GetTherapist() {
      var config = {
        method: 'get',
        url: 'https://sidekiq-therapy-api.herokuapp.com/api/v1/users',
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          //console.log(response);
          this.therapistlist = response.data; 
          console.log(this.therapistlist)                ;
        })
      .catch(error => {
          console.log("Error Thrown "+error);
      });
    },
    async UpdatePlan() {
      var config = {
        method: 'patch',
        url: 'https://sidekiq-therapy-api.herokuapp.com/api/v1/plan_of_cares/'+this.$route.query.id+'?plan_of_care[title]='+this.form.name+'&plan_of_care[therapists_id]='+this.form.therapist_id,
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          this.planAdded = response.data.responseMessage;
          this.form.name = '';
          this.ShowPlan();        
        })
      .catch(error => {
          console.log(""+error);
          this.planAdded = 'Something went wrong';
      });
    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}

#post-div {
  border: 3px solid #000;
  width: 500px;
  margin: auto;
  margin-bottom: 5px;
}
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
  margin: 10px;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

input, select {
  width: 60%;
  margin: 15px;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  padding: 10px;
  border-radius: 30px;
}
</style>
