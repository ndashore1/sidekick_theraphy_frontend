import axios from "axios";

const state = {
  user: null,
  userid: null,
  userToken: null,
  goals: null,
  plans: null,
  userType: null,
};

const getters = {
  isAuthenticated: (state) => !!state.user,
  StateGoals: (state) => state.goals,
  StateUser: (state) => state.user,
  StateUserid: (state) => state.userid,
  StatePlans: (state) => state.plans,
  StateUserToken: (state) => state.userToken,
  StateuserType: (state) => state.userType,
};

const actions = {
  async Register({dispatch}, form) {
    await axios.post('register', form)
    let UserForm = new FormData()
    UserForm.append('username', form.username)
    UserForm.append('password', form.password)
    await dispatch('LogIn', UserForm)
  },

  async LogIn({commit}, user) {
    await axios.post(
      `/api/v1/sessions?user[email]=${user.get('email')}&user[password]=${user.get('password')}`
      )
      .then((response) => { 
        if (response.status === 201) {
          console.log(response);
          commit("setUser", user.get('email'));
          commit("setUserToken", response.data.data.token);
          commit("setUserType", response.data.data.user_type);
          commit("setUserid", response.data.data.id);
        }
      });
  },
  async GetGoals({ commit }, token) {
    await axios.get(
      `/api/v1/plan_of_cares/${token.get('plan_of_cares')}/goals`,
      {
        headers: {
          "X-AUTH-TOKEN": `${token.get('token')}`,
        },
      }
    )
    .then((response) => { 
      if (response && response.status === 200) {
        commit("setGoals", response.data.data.goals);
        console.log(response.data.data.goals);
      }
    });
  },

  LogOut({ commit }) {
    let user = null;
    let userToken = null;
    let userType = null;
    let userid = null;
    commit("logout", user);
    commit("removeToken", userToken);
    commit("removeUserType", userType);
    commit("removeUserid", userid);
  },
};

const mutations = {
  setUser(state, username) {
    state.user = username;
  },

  setUserToken(state, token) {
    state.userToken = token;
  },
  
  setUserid(state, id) {
    state.userid = id;
  },

  setUserType(state, user_type) {
    state.userType = user_type;
  },

  setGoals(state, goals) {
    state.goals = goals;
  },

  setPlans(state, plans) {
    state.plans = plans;
  },

  logout(state, user) {
    state.user = user;
  },

  removeToken(state, userToken) {
    state.userToken = userToken;
  },

  removeUserType(state, userType) {
    state.userType = userType;
  },

  removeUserid(state, userid) {
    state.userid = userid;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
