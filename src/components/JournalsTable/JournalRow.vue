<template>
    <tr
            :class="{isSubscribed}"
            @click.exact="openSingleJournal"
            @click.ctrl="toggleCustomSubscribed"
            @click.meta="toggleCustomSubscribed"
    >
        <td class="title-column d-flex">
            <div class="icon">
                <v-icon dark small v-if="isSubscribed">mdi-cart</v-icon>
                <v-icon color="#ddd" small v-if="!isSubscribed">mdi-cart-outline</v-icon>
            </div>
            <div class="ml-2">{{journal.title}}</div>
        </td>

        <td
                v-for="header in headers"
                :key="journal.issn_l + header.value"
        >
            <span v-if="header.display==='number'">
                {{ journal[header.value].toLocaleString()}}
            </span>
            <span v-if="header.display==='percent'">
                {{ journal[header.value] | round }}%
            </span>
            <span v-if="header.display==='currency'">
                <template v-if="typeof journal[header.value] === 'number'">
                    {{ journal[header.value] | currency({fractionCount:2}) }}
                </template>
                <template v-if="typeof journal[header.value] !== 'number'">
                    &mdash;
                </template>
            </span>
            <span v-if="header.display==='currency_int'">
                {{ journal[header.value] | currency }}
            </span>
            <span v-if="header.display==='text'">
                {{ journal[header.value] }}
            </span>
            <span v-if="header.display==='boolean'">
                {{ journal[header.value] }}
            </span>
            <span v-if="header.display==='float1'">
                {{ journal[header.value].toFixed(1) }}
            </span>
        </td>

        <td class="spacer">&nbsp;</td>


    </tr>
</template>

<script>
    export default {
        props: ["journal", "headers"],
        name: "JournalRow",
        methods: {
            subscribe() {
                console.log("subscribe!")
                this.$store.dispatch("subscribeCustom", this.journal.issn_l)
            },
            unsubscribe() {
                console.log("unsubscribe!")
                this.$store.dispatch("unsubscribeCustom", this.journal.issn_l)
            },
            openSingleJournal() {
                console.log("@click on openSingleJournal()")
                this.$store.commit('setZoomIssnl', this.journal.issn_l)
            },
            toggleCustomSubscribed() {
                console.log("custom subscribe!")
                if (this.journal.subscribed) {
                    this.$store.dispatch("unsubscribeCustom", this.journal.issn_l)
                } else {
                    this.$store.dispatch("subscribeCustom", this.journal.issn_l)
                }
            },
        },
        computed: {
            isSubscribed() {
                return this.journal.subscribed || this.journal.customSubscribed
            },
        }
    }
</script>

<style scoped lang="scss">
    tr.isSubscribed {
        background: dodgerblue;
        color: #fff;

        &:hover {
            background: darken(dodgerblue, 10%);
        }
    }

    td {
        padding: 5px 10px;
        text-align: right;

        &.title-column {
            text-align: left;
        }
    }

</style>