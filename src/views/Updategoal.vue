<template>
  <div class="container">
    <div v-if="User">
      <p>Hi {{ User }}</p>
    </div>
    <div id="goal-div">
        <form @submit.prevent="UpdateGoal">
          <div class="alert alert-primary" role="alert" v-if="goalAdded">{{ goalAdded }}</div>
          <div>
            <label for="name">Update Goal Name:</label>
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
          <!-- <div>
            <label for="name">Add comma seperated notes:</label>
            <input type="text" name="goal_note" v-model="form.note" />
          </div> -->
          
          <div>
            <label for="name">Add notes</label>
            <table>
              <tr>
                <td>Word</td>
                <td>Action</td>
                <td>Result</td>
                <td>Add Error if any</td>
                <td>Delete Note</td>
              </tr>
              <tr v-for="(find, index) in form.note_list" :key="find.Id">
                <td>
                  <input name="note_list" v-model="form.note_list[index]" class="note-list">
                </td>
                <td>
                  <button @click="handleInput(index, '+')">+</button>
                  <button @click="handleInput(index, '-')">-</button>
                </td>
                <td>
                  <input name="note_list_oberver" v-model="form.note_list_oberver[index].observation">
                </td>
                <td>
                  <input name="added_note_error" v-model="form.added_note_error[index].errors">
                </td>
                
                <td><button @click="deleteFind(index)">Delete Note</button></td>
              </tr>
            </table>            
            <br>
            
          </div>
          <button @click="addFind">
            Add Note
          </button>
          <button type="submit">Update</button>
        </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  name: "Updategoal",
  components: {},
  data() {
    return {
        form: {
            name: "",
            goal_type: "",
            plan_of_cares: "",
            note: "",
            note_list: [],
            note_list_oberver: [],
            added_note_error: [],
            error: [],
        },
        finds: [],
        plan_of_care: "",
        goal_detail: "",
        Plans: "",
        goalAdded: "",
    };
  },
  created: function() {
    //
    this.ShowGoal();
    this.GetPlans();
  },
  computed: {
    ...mapGetters({ User: "StateUser" }),
  },
  methods: {
    handleInput: function(index, value) {
      this.form.note_list_oberver[index].observation += value;      
    },
    addFind: function () {
      this.form.note_list.push({ value: '' });
      this.form.note_list_oberver.push({ value: '+-' });
    },
    deleteFind: function (index) {
      //console.log(index);
      //console.log(this.form.note_list);
      this.form.note_list.splice(index, 1);
      this.form.note_list_oberver.splice(index, 1);
    },

    async UpdateGoal() {
      let notes_array = [];
      let note_result = {};  
      let observation = '';    
      console.log(this.form.note_list);
      notes_array = this.form.note_list;
      notes_array.forEach((note, index) => {
        console.log("index = "+index);
        if(this.form.note_list_oberver[index]){
          observation = this.form.note_list_oberver[index].observation;
        }
        else{
          observation = '';
        }
        
        note_result[ note.replace(/\s{2,}/g, '').trim() ]= {observation:''+observation, errors: this.form.added_note_error[index]}
        //note: {"sun" => {observation: "-+"},  seed: {observation: "+", errors: "swim, kick, catch, throw"}}


      });
      //note_list_oberver
      var data = JSON.stringify({
        "goals": {
          "name": this.form.name,
          "goal_type": this.form.goal_type,
          "note": note_result
        }
      });
      console.log(note_result);
      console.log(data);

      var config = {
        method: 'patch',
        url: 'https://sidekiq-therapy-api.herokuapp.com/api/v1/plan_of_cares/'+this.form.plan_of_cares+'/goals/'+this.$route.query.id,
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
      })
      .catch(error => {
        console.log(error);
      });

    },

    async ShowGoal() {
      var config = {
        method: 'get',
        url: 'https://sidekiq-therapy-api.herokuapp.com/api/v1/plan_of_cares/'+this.$route.query.plan_id+'/goals/'+this.$route.query.id,
        headers: { 
          'X-AUTH-TOKEN': this.$store.getters.StateUserToken
        }
      };
      axios(config)
      .then((response) => {
          console.log(JSON.stringify(response.data));
          this.goal_detail = response.data;
          this.form.name =response.data.name;
          this.form.goal_type =response.data.goal_type;
          this.form.plan_of_cares =response.data.plan_of_care.id;
          let notes={};
          notes = response.data.note;
          this.form.note = Object.keys(notes).toString();
          this.form.note_list = Object.keys(notes);
          this.form.note_list_oberver = Object.values(notes);
          this.form.added_note_error = Object.values(notes);
          //note_list added_note_error
        })
      .catch(error => {
          console.log(""+error);
          //this.planAdded = 'Something went wrong';
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
          console.log(response.data);
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

.note-list {
  width: 300px;
  float: left;
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
