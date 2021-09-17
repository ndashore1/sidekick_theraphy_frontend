<template>
  <div class="container">
    <div v-if="User">
      <p>Hi {{ User }}</p>
    </div>
    <div>
      <form @submit.prevent="handleSubmit">
        <div v-if="loginType === 'patient'">
          <div class="alert alert-primary" role="alert" v-if="planAdded">{{ planAdded }}</div>
          <div>
            <label for="name">Plan Name:</label>
            <input type="text" name="goal_name" v-model="form.name" />
          </div>
          <div>
            <label for="therapist_id">Select Therapist:</label>
            <!-- <input type="text" name="therapist_id" v-model="form.therapist_id" /> -->
            <select name="therapist_id" v-model="form.therapist_id">
              <option v-for="therapist in therapistlist" :key="therapist.id" :value="therapist.id">
                {{ therapist.name }}
              </option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
    <div class="plan" v-if="Plans">
      <p>All Plan of Care</p>
      <table class="table table-bordered">
        <tr>
          <th>Name</th>
          <th>View</th>
          <th v-if="loginType === 'patient'">Update</th>
          <th v-if="loginType === 'patient'">Destroy</th>
        </tr> 
        <tr v-for="plan in Plans" :key="plan.id">
          <td>{{ plan.title }}</td>
          <td><button><a :href="'/show-plan?id=' + plan.id">Show</a></button></td>
          <td v-if="loginType === 'patient'"><button><a :href="'/update-plan?id=' + plan.id">Update</a></button></td>
          <td v-if="loginType === 'patient'"><button v-on:click="destroy(plan.id)">Destroy</button></td>
        </tr>
      </table>
    </div>
    <div v-else>Oh no!!! We have no Plans</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "Plans",
  components: {},
  data() {
    return {
      form: {
        name: "",
        therapist_id: "",
      },
      planAdded: "",
      therapistlist: "",
      Plans: "",
    };
  },
  created: function() {
    const token = new FormData();
    token.append("token",  this.$store.getters.StateUserToken);
    this.GetPlans();
    this.GetTherapist();
    //console.log("baseURL = "+axios.defaults.baseURL);
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
    
    loginType: function() {
      return this.$store.getters.StateuserType;
    }
  },
  methods: {
    //...mapActions(["GetPlan"]),
    async handleSubmit() {
      var config = {
        method: 'post',
        url: axios.defaults.baseURL+'api/v1/plan_of_cares?plan_of_care[title]='+this.form.name+'&plan_of_care[therapists_id]='+this.form.therapist_id,
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          this.planAdded = response.data.responseMessage;
          this.form.name = '';
          const token = new FormData();
          token.append("token",  this.$store.getters.StateUserToken);
          this.GetPlans(token);        
        })
      .catch(error => {
          console.log(""+error);
          this.planAdded = 'Something went wrong';
      });
    },
    async destroy(id) {
      if(confirm("Are you sure")) {
        var config = {
          method: 'delete',
          url: axios.defaults.baseURL+'api/v1/plan_of_cares/'+id,
          headers: { 
            'X-AUTH-TOKEN': this.$store.getters.StateUserToken
          }
        };
        axios(config)
        .then((response) => {
            this.planAdded = response.data.responseMessage;
            const token = new FormData();
            token.append("token",  this.$store.getters.StateUserToken);
            this.GetPlans(token);        
          })
        .catch(error => {
            console.log("Error Thrown "+error);
            this.planAdded = 'Something went wrong';
        });
      }
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
          console.log("therapist==="+this.therapistlist)                ;
        })
      .catch(error => {
          console.log("Error Thrown "+error);
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

#plan-div {
  border: 3px solid #000;
  width: 500px;
  margin: auto;
  margin-bottom: 5px;
}
</style>
