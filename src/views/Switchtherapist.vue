<template>
  <div class="container">
    <div v-if="User">
      <p>Hi {{ User }}</p>
    </div>
    <div>
      <form @submit.prevent="handleSubmit">
        <div class="alert alert-primary" role="alert" v-if="goalAdded">{{ goalAdded }}</div>
        <div>
          <label for="name">Plan Care Of Id:</label>
          <select name="goal_type" v-model="form.plan_of_cares" v-on:change="getPlanDetails($event)">
            <option v-for="plan in Plans" :key="plan.id" :value="plan.id">
              {{ plan.title }}
            </option>
          </select>
        </div>
        <div>
          <label for="type">Old therapist:</label>
          <select name="goal_type" v-model="form.old_therapist" disabled>
            <option v-for="therapist in therapistlist" :key="therapist.id" :value="therapist.id">
              {{ therapist.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="type">New Therapist:</label>
          <select name="goal_type" v-model="form.new_therapist">
            <option v-for="therapist in therapistlist" :key="therapist.id" :value="therapist.id">
              {{ therapist.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="name">Comment:</label>
          <input type="text" name="goal_name" v-model="form.comments" />
        </div>
        
        <button  class="btn btn-info" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  name: "Goals",
  components: {},
  data() {
    return {
      form: {
        name: "",
        goal_type: "",
        plan_of_cares: "",
        old_therapist: "",
        new_therapist: "",
      },
      goalAdded: "",
      therapistlist: "",
      Plans: "",
    };
  },
  created: function() {    
    this.GetTherapist();
    this.GetPlans();
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  methods: {
    ...mapActions(["GetGoals", "GetTherapist"]),
    async handleSubmit() {
      var data = new FormData();
      data.append('patient_history[comments]', this.form.comments);
      data.append('patient_history[plan_of_care_id]', this.form.plan_of_cares);
      data.append('patient_history[old_therapists_id]', this.form.old_therapist);
      data.append('patient_history[new_therapists_id]', this.form.new_therapist);
      var config = {
        method: 'post',
        url: axios.defaults.baseURL+'api/v1/users/2/patient_histories',
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken,
        },
        data : data
      };
      axios(config)
      .then((response) => {
        console.log("==++== "+response.data);
        this.goalAdded = response.data.responseMessage;
        console.log("============ "+this.goalAdded);
      })
      .catch(error => {
        console.log("error= "+error);
        this.goalAdded = 'Something went wrong';
      });           
    },
    async GetTherapist() {
      var config = {
        method: 'get',
        url: axios.defaults.baseURL+'api/v1/users',
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
          this.goalAdded = 'Something went wrong';
      });
    },
    async getPlanDetails(event) {
      var config = {
        method: 'get',
        url: axios.defaults.baseURL+'api/v1/plan_of_cares/'+event.target.value,
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };

      axios(config)
      .then( (response) => {
        console.log(response.data);
        if(response.data.new_therapists) {
          //alert('in');
          this.form.old_therapist = response.data.new_therapists.id;
          //this.form.old_therapist = 6;
          console.log("==="+response.data.new_therapists.id);
        }
        //console.log(response.data.id);
        console.log(response.data.new_therapists.id);
      })
      .catch( (error) => {
        console.log(error);
      });
    },
    async GetPlans() {
      var config = {
        method: 'get',
        url: axios.defaults.baseURL+'api/v1/plan_of_cares',
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          console.log("========= "+response);
          this.Plans = response.data;
        })
      .catch(error => {
          console.log("error = "+error);
      });
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

textarea {
  width: 75%;
  resize: vertical;
  padding: 15px;
  border-radius: 15px;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  height: 150px;
  margin: 15px;
}

ul {
  list-style: none;
}

#post-div {
  border: 3px solid #000;
  width: 500px;
  margin: auto;
  margin-bottom: 5px;
}
</style>
