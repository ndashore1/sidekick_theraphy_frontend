<template>
  <div class="container">
    <div v-if="User">
      <p>Hi {{ User }}</p>
    </div>
    <div>
      <form @submit.prevent="createGoals">
        <div class="alert alert-primary" role="alert" v-if="goalAdded">{{ goalAdded }}</div>
        <div>
          <label for="name">Goals Name:</label>
          <input type="text" name="goal_name" v-model="form.name" />
        </div>
        <div>
          <label for="type">Goals Type:</label>
          <select name="goal_type" v-model="form.goal_type">
            <option value="stg">STG</option>
            <option value="ltg">LTG</option>
          </select>
        </div>
        <div>
          <label for="type">Select Plan of Care:</label>
          <select name="plan_of_cares" v-model="form.plan_of_cares">
            <option v-for="plan in Plans" :key="plan.id" :value="plan.id">
              {{ plan.title }}
            </option>
          </select>
        </div>
        <div>
          <label for="name">Add comma seperated notes:</label>
          <input type="text" name="goal_notes" v-model="form.notes" />
        </div>
        <button  class="btn btn-info" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
        notes: "",
      },
      goalAdded: "",
      Plans: "",
    };
  },
  created: function() {
    this.GetPlans();
  },
  computed: {
    ...mapGetters({ User: "StateUser"}),
  },
  methods: {
    async createGoals() {
      let notes_array = [];
      let note_result = {};      
      console.log(this.form.notes);
      notes_array = this.form.notes.split(",");
      notes_array.forEach(function(note) {
        note_result[ note.replace(/\s{2,}/g, '').trim() ]= {observation:'-+'}
      });
      var data = JSON.stringify({
        "goals": {
          "name": this.form.name,
          "goal_type": this.form.goal_type,
          "note": note_result
        }
      });

      var config = {
        method: 'post',
        url: 'https://sidekiq-therapy-api.herokuapp.com/api/v1/plan_of_cares/'+this.form.plan_of_cares+'/goals',
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken, 
          'Content-Type': 'application/json'
        },
        data : data
      };

      axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.goalAdded = response.data.responseMessage;
        console.log("goalAdded ======  "+this.goalAdded);
        this.form.name = '';
        this.form.goal_type = '';
        this.form.plan_of_cares = '';
        this.form.notes = '';
      })
      .catch(error => {
        console.log(error);
      });
    },

    async GetPlans() {
      var config = {
        method: 'get',
        url: 'https://sidekiq-therapy-api.herokuapp.com/api/v1/plan_of_cares',
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          console.log("========= "+response.data);
          this.Plans = response.data;
        })
      .catch(error => {
          console.log("error = "+error);
      });
    },
    async destroy(id, plan_of_care_id) {
      if(confirm("Are you sure")) {
        var config = {
          method: 'delete',
          url: 'https://sidekiq-therapy-api.herokuapp.com/api/v1/plan_of_cares/'+plan_of_care_id+'/goals/'+id,
          headers: { 
            'X-AUTH-TOKEN': this.$store.getters.StateUserToken
          }
        };
        axios(config)
        .then((response) => {
            this.goalAdded = response.data.responseMessage;
          })
        .catch(error => {
            console.log("Error Thrown "+error);
            this.goalAdded = 'Something went wrong';
        });
      }
        
    }
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
  /* box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06); */
  padding: 10px;
  /* border-radius: 30px; */
  border: 1px solid #e3e3e3;
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
