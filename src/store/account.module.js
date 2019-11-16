import axios from "axios";
const authUrl = "https://unpaywall-jump-api.herokuapp.com/login"
const accountUrl = "https://unpaywall-jump-api.herokuapp.com/account "

import {api} from "../api"

export const account = {
    state: {
        selected: null,
    },
    mutations: {
        setSelected(state, myAccount){state.selected = myAccount},
        setToken(state, token){
            localStorage.setItem("token", token)
        },
        logout(state){
            state.selected = null
            localStorage.removeItem("token")
        },
    },
    actions: {
        async login({commit, dispatch, getters}, userCreds) {
            const resp = await  api.post("login", userCreds)
            commit("setToken", resp.data.access_token)
            return await dispatch("fetchUser")

        },

        async fetchUser({commit, getters}) {
            const resp = await api.get("account")
            commit("setSelected", resp.data)
        },

        async loginDemo({dispatch}){
            const userCreds = {
                username: "demo",
                password: "demo"
            }
            return await dispatch("login", userCreds)
        },




    },
    getters: {
        token(state){
            return localStorage.getItem("token")
        },
        selectedAccount(state){return state.selected},
        isLoggedIn(state){return state.selected },
        authHeaders(state){
            const token =  localStorage.getItem("token")
            return {
                Authorization: `Bearer ${token}`
            }
        }
    }
}