<template>
    <div class="publisher">
        <v-card v-if="publisherApcIsLoading" class="d-flex align-center justify-center" style="height: 200px;">
            <div>
                <v-progress-circular size="20" class="mr-4" indeterminate></v-progress-circular>
                APC data loading...
            </div>
        </v-card>

        <v-card class="mb-4" v-if="!publisherApcIsLoading">
            <v-card-text>
                <div class="stat">
                    <span class="k">Total APC cost last year is </span>
                    <span class="v">{{ publisherApcCost | currency }}</span>
                    <span class="k"> (estimated). </span>
                    This includes all journals published by {{publisherName}} where authors from your institution have paid APCs for gold or hybrid open access.
                </div>
                <div>
                </div>
            </v-card-text>

            <v-card-title class="d-flex">
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="6">
                        <v-text-field
                                hide-details
                                outlined
                                dense
                                label="Search journals"
                                v-model="search"
                                append-icon="mdi-magnify"
                                full-width
                        />
                    </v-col>
                </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card flat>
                <v-data-table
                        :headers="tableHeaders"
                        :items="tableRows"
                        :items-per-page="100"
                        :search="search"
                        :footer-props="{disableItemsPerPage:true}"
                        :must-sort="true"
                        :fixed-header="true"

                >
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>
                                <v-row class="" style="width:400px;">

                                    <v-col style="flex-grow:222;">
                                        <div>{{item.title}}</div>

                                    </v-col>
                                </v-row>
                            </td>

                            <td v-for="(v,k) in item"
                                v-if="!['issnl', 'title', 'subject',].includes(k)"
                                :key="item.issnl + k">
                                        <span v-if="getColDisplayType(k)==='number'">
                                            {{ v.toLocaleString()}}
                                        </span>
                                <span v-if="getColDisplayType(k)==='percent'">
                                            {{ v | round }}%
                                        </span>
                                <span v-if="getColDisplayType(k)==='currency'">
                                            {{ v | currency({fractionCount:2}) }}
                                        </span>
                                <span v-if="getColDisplayType(k)==='currency_int'">
                                            {{ v | currency }}
                                        </span>
                                <span v-if="getColDisplayType(k)==='text'">
                                            {{ v }}
                                        </span>
                                <span v-if="getColDisplayType(k)==='float1'">
                                            {{ v.toFixed(1) }}
                                        </span>


                            </td>

                        </tr>

                    </template>


                </v-data-table>

            </v-card>


        </v-card>

    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "PublisherApc",
        components: {
        },
        data() {
            return {
                search: "",
            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",

                // apc stuff
                "publisherApcIsLoading",
                "publisherApcPapersCount",
                "publisherApcAuthorsFractionalCount",
                "publisherApcCost",
                "publisherApcJournals",
                "publisherApcHeaders",

            ]),
            tableRows() {
                return this.$store.getters.publisherApcJournals.map(j => {
                    let ret = j.table_row
                    ret.title = j.meta.title
                    ret.subject = j.meta.subject
                    ret.issnl = j.meta.issn_l
                    return ret
                })
            },
            tableHeaders() {
                const metaHeaders = [
                    {text: "Title", value: "title"},
                ]
                return [...metaHeaders, ...this.publisherApcHeaders]
            },
        },
        methods: {
            ...mapMutations([
            ]),
            ...mapActions([
            ]),
            getColDisplayType(colName) {
                const myHeader = this.publisherApcHeaders.find(h => h.value === colName)
                if (myHeader) {
                    return myHeader.display
                } else {
                    return "number"
                }
            },
        },

        created() {
        },
        async mounted() {
            console.log("mounting ApcTab")
            this.$store.commit("clearApcData")
            await this.$store.dispatch("fetchPublisherApcData", this.$route.params.publisherId)
            console.log("ApcTab done fetching publisherApcData")



        },
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        border-top: none !important;
    }

</style>