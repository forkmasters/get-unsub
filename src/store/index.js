import Vue from 'vue'
import Vuex from 'vuex'

import {account} from "./account.store.js"
import {pkg} from "./pkg.store.js"
import {scenario} from "./scenario.store"
import {scenarioEditDialogs} from "../components/ScenarioEditDialogs/scenarioEditDialogsStore";
import {institution} from "./institution.store";
import {user} from "./user.store";
import configs from "../appConfigs"


Vue.use(Vuex)

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');




// looks useful: https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex

export default new Vuex.Store({
    state: {
        notSupportedMsgOpen: false,
        snackbarMsg: "",
        snackbarIsOpen: false,
        snackbarColor: "success",

        editMode: false,

        configsOpen: false,

        startupTutorialOpen: false,

        loading: 0,

        showColInfo: false,
        colInfo: null,

        infoKey: null,


    },
    modules: {
        scenarioEditDialogs,
        // institution,
        // user,
        account,
        pkg,
        scenario,
    },


    mutations: {
        startLoading(state){
            // state.loading = true
        },
        finishLoading(state){
            // state.loading = false
        },

        showColInfo(state, name){
            state.colInfo = configs.journalCols.find(c => {
                return c.value === name
            })
            state.showColInfo = true
        },
        clearColInfo(state){
            state.colInfo = false
            state.colInfo = null
        },








        // UI stuff
        closeNotSupportedMsg(state) {
            state.notSupportedMsgOpen = false
        },
        openNotSupportedMsg(state) {
            state.notSupportedMsgOpen = true
        },
        snackbar(state, msg, color="success"){
            state.snackbarMsg = msg
            state.snackbarIsOpen = true
        },
        closeSnackbar(state){
            state.snackbarMsg = ""
            state.snackbarIsOpen = false
        },
        clearStartupTutorial(state){
            state.startupTutorialOpen = false
            localStorage.setItem("startupTutorialFinished", "true")
        },
        openStartupTutorial(state){
            if (!localStorage.getItem("startupTutorialFinished")){
                state.startupTutorialOpen = true
            }
        },


        // config stuff
        setConfigsOpen(state){
            if(state.editMode){
                console.log("edit mode bro")
                state.snackbarIsOpen = true
                state.snackbarMsg = "You can't change configs when you're Edit Mode"
                state.snackbarColor = "info"
                return
            }
            state.configsOpen = true
        },
        clearConfigsOpen(state){
            state.configsOpen = false
        },
        toggleConfigsOpen(state){
            console.log("toggle configs open")

            if (state.configsOpen){
                state.configsOpen = false
            }
            else { // configs are closed
                if(state.editMode){
                    state.editMode = false

                    // console.log("edit mode bro")
                    // state.snackbarIsOpen = true
                    // state.snackbarMsg = "You can't change configs when you're Edit Mode"
                    // state.snackbarColor = "info"
                    // return
                }
                state.configsOpen = true

            }

        },



        // edit mode
        setEditMode(state){
            state.editMode = true
            state.configsOpen = false
        },
        clearEditMode(state){
            state.editMode = false
        },
    },
    actions: {
        async loginDemo({dispatch, state, commit}){
            console.log("loginDemo()")
            const userCreds = {
                username: "demo",
                password: "demo"
            }
            await dispatch("login", userCreds)
            const firstPkgId = state.account.selected.packages[0].id

            await dispatch("fetchPkg", firstPkgId)
            const firstScenarioId = state.pkg.selected.scenarios[0].id

            await dispatch("fetchScenario", firstScenarioId)
            commit("openStartupTutorial")
            return `/a/${firstPkgId}/${firstScenarioId}`
        },
    },

    getters: {
        loading(state){return state.loading > 0},
        colInfo(state){return state.colInfo},
        infoKey(state){return state.infoKey},






    }
})




































