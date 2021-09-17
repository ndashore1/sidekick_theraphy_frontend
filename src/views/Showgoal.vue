<template>
  <div class="container">
    <div v-if="User">
      <p>Hi {{ User }}</p>
    </div>
    <div id="goal-div">
        <table class="table table-bordered" border="1">
            <tr>
                <td>Title</td>
                <td>User Id</td>
                <td>Goal Type</td>
                <td>Plan of Care Id</td>
                <td>Note</td>
            </tr>
            <tr v-if="goal_detail">
                <td>{{ goal_detail.name }}</td>
                <td>{{ goal_detail.user_id }}</td>
                <td>{{ goal_detail.goal_type }}</td>
                <td>{{ goal_detail.plan_of_care.id }}</td>
                <td>
                  <div v-for="singlenote, notename in goal_detail.note" :key="singlenote.noteName">
                    {{ notename }}
                    <span v-for="details in singlenote.observation" :key="details"> 
                      <button v-for="single in details.split('')" :key="single" class="" style="margin-right: 5px;">{{single}}</button>                      
                    </span> 
                    <p>Errors: {{singlenote.errors}}</p>                   
                  </div>
                </td>
            </tr>
        </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "Showgoal",
  components: {},
  data() {
    return {
      goal_detail: "",
    };
  },
  created: function() {
    const token = new FormData();
    token.append("token",  this.$store.getters.StateUserToken);
    this.ShowGoal();
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  methods: {
    async ShowGoal() {
      var config = {
        method: 'get',
        url: axios.defaults.baseURL+'api/v1/plan_of_cares/'+this.$route.query.plan_id+'/goals/'+this.$route.query.id,
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          console.log("========= "+response.data);
          this.goal_detail = response.data;
        })
      .catch(error => {
          console.log(""+error);
          //this.planAdded = 'Something went wrong';
      });
    },
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
</style>
