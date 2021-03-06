import appConfigs from "../appConfigs";


const config = {
    Elsevier: {
        name: "Elsevier",
        id: "Elsevier",
        logo: "https://i.imgur.com/Qt1sOqp.png",
    },
    SpringerNature: {
        name: "Springer Nature",
        id: "SpringerNature",
        logo: "https://i.imgur.com/MLtg71P.png",
    },
    Wiley: {
        name: "Wiley",
        id: "Wiley",
        logo: "https://i.imgur.com/FFfCHXI.png",
    },
}


const publisherLogoFromName = function(name){
        let myPublisherIdReal
        if (/elsevier/i.test(name)) myPublisherIdReal = "elsevier"
        else if (/springer/i.test(name)) myPublisherIdReal = "springer_nature"
        else if (/wiley/i.test(name)) myPublisherIdReal = "wiley"

        if (config[myPublisherIdReal]) {
            return config[myPublisherIdReal].logo
        }
        else {
            return "https://i.imgur.com/PN3ya57.png"
        }
}

const publisherLogoFromId = function(id){
    if (config[id]) {
            return config[id].logo
        }
        else {
            return "https://i.imgur.com/PN3ya57.png"
        }
}

const publisherJournalColumns = [
    {
        id: "issnl",
        name: "ISSN",
        descr: "The journal's canonical ISSN (ISSN-L)",
        displayAs: "text"
    },
    {
        id: "name",
        name: "Title",
        descr: "The journal's title",
        displayAs: "text"
    },
    {
        id: "price",
        name: "Price",
        descr: "Your a-la-carte subscription cost for the journal. Default: public list price.",
        displayAs: "currency"
    },
    {
        id: "paStart",
        name: "PA end",
        descr: "You don't have perpetual access to articles published before this date. Default: none.",
        displayAs: "date"
    },
    {
        id: "paEnd",
        name: "PA start",
        descr: "You don't have perpetual access to articles published after this date. Default: none",
        displayAs: "date"
    },
    {
        id: "omittedBecause",
        name: "Omitted because",
        descr: "If the journal is omitted from forecast scenarios, here's why",
        displayAs: "listOfStrings"
    },
]

const makePublisherJournalRow = function(publisherJournal) {
    return publisherJournalColumns.map(col => {
        return {
            ...
            col,
            value: publisherJournal[col.id]
        }
    })
}




const makePublisherJournal = function(apiJournal){

    const omittedBecause = []
    if (apiJournal.attributes.changed_publisher) {
        omittedBecause.push("New publisher")
    }
    if (apiJournal.attributes.is_oa) {
        omittedBecause.push("Fully OA")
    }
    if (apiJournal.attributes.not_published_2019) {
        omittedBecause.push("Ceased publication")
    }
    if (apiJournal.error) {
        omittedBecause.push("Input error")
    }

    const isInactive = apiJournal.attributes.not_published_2019
    const isMoved = apiJournal.attributes.changed_publisher
    const isOa = apiJournal.attributes.is_oa


    const dataSources = apiJournal.data_sources.map(source => {
        source.id = _.camelCase(source.id)
        return source
    })

    const dataSourcesDict = {}
    apiJournal.data_sources.forEach(source => {
        dataSourcesDict[_.camelCase(source.id)] = source
    })

    const isMissingDataFor = dataSources.map(source => {
        return (!source.source) ?  source.id : null
    }).filter(Boolean)

    const isValid = ([
        dataSourcesDict.counter.source,
        !apiJournal.error,
        !isInactive,
        !isMoved,
        !isOa,
    ]).every(x => x)

    const price = dataSourcesDict.price.value
    const counter = dataSourcesDict.counter.value
    const perpetualAccessStart = dataSourcesDict.perpetualAccess.value[0]
    const perpetualAccessEnd = dataSourcesDict.perpetualAccess.value[1]





    return {
        issnl: apiJournal.issn_l,
        name: apiJournal.name,
        dataSources,
        dataSourcesDict,
        isMissingDataFor,

        isValid,

        omittedBecause,
        isInactive,
        isMoved,
        isOa,
        isError: !!apiJournal.error,
        isForecastable: !omittedBecause.length,
        error: apiJournal.error,

        price,
        counter,
        perpetualAccessStart,
        perpetualAccessEnd,
    }

}


export  {
    publisherLogoFromId,
    publisherJournalColumns,
    makePublisherJournal,
    makePublisherJournalRow,
}