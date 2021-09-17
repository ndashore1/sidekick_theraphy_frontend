<template>
  <div class="container">
    <div v-if="User">
      <p>Hi {{ User }}</p>
    </div>
    <div id="goal-div" class="row">
      <div class="col-md-12">
        <div v-if="goalAdded">{{ goalAdded }}</div>
        <p>Plan Details<i class="fas fa-edit"></i></p>
        <table class="table table-bordered ">
            <tr>
                <th>Title</th>
                <th>Therapist Name</th>
                <th>Created At</th>
            </tr>
            <tr v-if="plan_of_care">
                <td>{{ plan_of_care.title }}</td>
                <td v-if="plan_of_care.new_therapists">{{ plan_of_care.new_therapists.name }}</td>
                <td v-else>Therapist Not assigned</td>
                <td>{{ plan_of_care.created_at }}</td>
            </tr>
            <tr v-else><td></td></tr>
        </table>
      </div>
      <div class="col-md-12">
        <p>Goals that are associated to above listed Plan of care.</p>
        <div class="goals" v-if="Goalslist">
          <table class="table table-bordered">
            <tr>
              <th>Name</th>
              <th>Goal Type</th>
              <th>Is Completed</th>
              <!-- <th>Note</th> -->
              <th>View</th>
              <th>Update</th>
              <th>Destroy</th>
            </tr> 
            <tr v-for="goal in Goalslist" :key="goal.id">
              <td>{{ goal.name }}</td>
              <td>{{ goal.goal_type }}</td>
              <td>{{ goal.is_completed }}</td>
              <!-- <td>
                <div v-for="singlenote, notename in goal.note" :key="singlenote.noteName">
                  <p>{{ notename }} {{ singlenote }}</p>
                </div>
              </td> -->
              <td v-if="plan_of_care"><button class="btn btn-info"><a :href="'/show-goal?id=' + goal.id + '&plan_id=' +plan_of_care.id ">View</a></button></td>
              <td v-if="plan_of_care"><button class="btn btn-info"><a :href="'/update-goal?id=' + goal.id + '&plan_id=' +plan_of_care.id ">Update</a></button>  </td>
              <td v-if="plan_of_care"><button class="btn btn-info" v-on:click="destroy(goal.id, plan_of_care.id)">Destroy</button></td>
            </tr>
          </table>        
        </div>
        <div v-else>Oh no!!! We have no Goals</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  name: "Showplan",
  components: {},
  data() {
    return {
      plan_of_care: "",
      Goalslist: {},
      goalAdded: "",
    };
  },
  created: function() {
    this.ShowPlan();
    //this.GetGoals();
  },
  computed: {
    ...mapGetters({ User: "StateUser"}),
  },
  methods: {
    ...mapActions(["ShowPlan"]),
    async ShowPlan() {
      var config = {
        method: 'get',
        url: axios.defaults.baseURL+'api/v1/plan_of_cares/'+this.$route.query.id,
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          console.log(response.data);
          this.plan_of_care = response.data;
          this.Goalslist = response.data.goals;
        })
      .catch(error => {
          console.log(""+error);
          this.planAdded = 'Something went wrong';
      });
    },
    async destroy(id, plan_of_care_id) {
      if(confirm("Are you sure")) {
        var config = {
          method: 'delete',
          url: axios.defaults.baseURL+'api/v1/plan_of_cares/'+plan_of_care_id+'/goals/'+id,
          headers: { 
            'X-AUTH-TOKEN': this.$store.getters.StateUserToken
          }
        };
        axios(config)
        .then((response) => {
            this.goalAdded = response.data.responseMessage;
            const token = new FormData();
            token.append("token",  this.$store.getters.StateUserToken);
            token.append("plan_of_cares",  this.$route.query.id);
            this.ShowPlan(token);        
          })
        .catch(error => {
            console.log("Error Thrown "+error);
            this.goalAdded = 'Something went wrong';
        });
      }        
    },
    // async GetGoals(){
    //   var config = {
    //     method: 'get',
    //     url: axios.defaults.baseURL+'api/v1/plan_of_cares/'+this.$route.query.id+'/goals',
    //     headers: { 
    //       'X-AUTH-TOKEN': this.$store.getters.StateUserToken
    //     }
    //   };
    //   axios(config)
    //   .then((response) => {        
    //     console.log(JSON.stringify(response.data));
    //     this.Goalslist = response.data;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });      
    // }
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}

table{
    text-align: center;
    margin: 0 auto;
}
#post-div {
  border: 3px solid #000;
  width: 500px;
  margin: auto;
  margin-bottom: 5px;
}
.col-md-12
{
  margin-bottom: 20px;
}
</style>
