var Resources = {
    // state variables
    resourceData: [],
    activeType: '',
    activeSort: '',
    startIndex: 0,
    endIndex: 0,
    cardsPerPage: 5,
    resultsCount: 0,
    pagesToDisplay: 0,
    currentPage: 0,

    // DOM element variables (denoted by '$')
    $cardsContainer: null,
    $noResults: null,
    $resourceCount: null,
    $searchInput: null,
    $typeInput: null,
    $sortInput: null,
    $clearBtn: null,
    $pagination: null,

    loadJSON() {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // if successful, store JSON in resourceData array
                Resources.resourceData = JSON.parse(this.responseText)
                // set up DOM
                Resources.displayPage()
            }
        }
        xmlhttp.open("GET", "../js/data.json", true)
        xmlhttp.send()
    },
    displayPage() {
        // initialize DOM element variables
        this.$cardsContainer = document.querySelector('#cards-container')
        this.$noResults = document.querySelector('#no-results')
        this.$resourceCount = document.querySelector('#resource-count')
        this.$searchInput = document.querySelector('#search-input')
        this.$typeInput = document.querySelector('#type-input')
        this.$sortInput = document.querySelector('#sort-input')
        this.$clearBtn = document.querySelector('#clear-btn')
        this.$pagination = document.querySelector('#pagination')

        // initialize state variables as default DOM variable values
        this.activeType = this.$typeInput.value
        this.activeSort = this.$sortInput.value

        this.endIndex = this.resourceData.length - 1

        // render resource cards with JSON data 
        this.renderCards(this.resourceData, this.startIndex, this.endIndex)

        this.renderPagination()

        // create inital resource count message with total number of resources
        this.$resourceCount.textContent = `Displaying ${this.resourceData.length} resources`

        // establish listeners for interactive DOM elements
        this.setListeners()
        
        // set up resource type & sort type variables
        this.updateType()
        this.updateSort()
    },

    renderPagination() {
        this.pagesToDisplay = Math.floor(this.resourceData.length / this.cardsPerPage) + 1

        console.log(this.pagesToDisplay)

        if (this.pagesToDisplay < 1) {
            this.$pagination.classList.add('d-none')
        }
        else {
            this.$pagination.classList.remove('d-none')
        }

        for (let i = 0; i < this.pagesToDisplay; i++) {
            let $paginationTab = document.createElement("li")
            $paginationTab.classList.add('page-item')

            $paginationTab.innerHTML = `
                <a class="page-link" href="#">${i+1}</a></li>
            `
            console.log($paginationTab)

            let $paginationNextBtn = document.querySelector('#pagination-next-btn')
            this.$pagination.insertBefore($paginationTab, $paginationNextBtn)
        }

        this.currentPage = 1
        
    },

    renderCards(lst, startIndex, endIndex) {

        // console.log(startIndex, endIndex);
        // if (endIndex <= this.cardsPerPage) {
        //     console.log("hello")
        //     this.$pagination.classList.add("d-none")
        // }

        // reset results count
        this.resultsCount = 0
        let cardIndex = 0

        lst.forEach(el => {
            this.resultsCount++

            // add divs for card and card content to the DOM
            let $cardItem = document.createElement("div")
            let $cardBody = document.createElement("div")
            
            // set data-name attribute (resource name) & Bootstrap classes
            $cardItem.className = 'card my-2';
            $cardItem.setAttribute('data-name', el.name)
            $cardBody.className = 'card-body';
    
            // create string to build card's HTML content
            let cardContent = `
                <h5 class="card-title"><a href="${el.link}" target="_blank">${el.name} (${el.type})</a></h5>
            `

            // create string for payment rate information
            let rateInfo = '<p class="card-text">'

            // determine relevant payment rate information based on resource type
            switch (el.type) {
                case 'publication':
                    rateInfo += el.minRate ? `<strong>$${el.minRate} &ndash; </strong>` : ''
                    rateInfo += el.maxRate ? `<strong>$${el.maxRate}</strong>` : ''
                    break;
    
                case 'publisher':
                    rateInfo += el.royaltyRate ? `<strong>$${el.royaltyRate}</strong>` : ''
                    break;
            
                case 'agency':
                    rateInfo += el.hourlyMinRate ? `<strong>$${el.hourlyMinRate}/hr &ndash; </strong>` : ''
                    rateInfo += el.hourlyMaxRate ? `<strong>$${el.hourlyMaxRate}/hr</strong>` : ''
                    break;
            
                default:
                    break;
            }
            
            // add payment rate information to resource card
            rateInfo += '</p>'
            cardContent += rateInfo + '<div class="w-100">'
            
            // create labels for each resource topic
            let cardTopics = ''
            if (el.topics) {
                el.topics.forEach(topic => {
                    cardTopics += `<span class="card-topic" onclick="Resources.handleSearch('${topic}')">${topic}</span>`
                }); 
            }
    
            // add group of resource topics to the card
            cardContent += '</div>'
            cardContent += `<div class="w-100">${cardTopics}</div>`
    
            // add all card content HTML to the card
            $cardBody.innerHTML = cardContent
    
            // append card body to parent card div
            $cardItem.appendChild($cardBody)

            // append card to container div
            this.$cardsContainer.appendChild($cardItem)

            cardIndex++
            if (cardIndex > this.endIndex || cardIndex < this.startIndex ) {
                cardIndex == 0
            }


        });

    },
    setListeners() {
        // handle search each time a key is pressed
        this.$searchInput.addEventListener("keyup", () => {
            this.handleSearch(this.$searchInput.value)
        });

        // re-sort the array each time the sort select is changed
        this.$sortInput.addEventListener("change", () => {
            this.updateSort()
            this.handleSearch(this.$searchInput.value)
        });

        // update resource type when type select is changed
        this.$typeInput.addEventListener("change", () => {
            console.log("type is changed")
            this.updateType()
        });

        // clear search field when clear button is clicked
        this.$clearBtn.addEventListener("click", () => {
            this.handleSearch('')
        });
    },
    updateType() {
        // set active type to value in type select
        this.activeType = this.$typeInput.value

        // run search function to display updated results
        this.handleSearch(this.$searchInput.value)
    },
    updateSort() {
        // set active sort to value in sort select
        this.activeSort = this.$sortInput.value

        // get all elements with 'card' class in cards container and remove them from DOM
        var $allItems = this.$cardsContainer.getElementsByClassName('card')
        while($allItems.length > 0){
            $allItems[0].parentNode.removeChild($allItems[0]);
        }

        // rebuild DOM with 
        switch (this.activeSort) {
            case 'alpha':
                // sort array alphabetically by resource name
                this.resourceData.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1)
                break;
                case 'rate_increasing':
                // sort array by resource payment rate in increasing order
                this.resourceData.sort((a, b) => (
                    (a.maxRate || a.hourlyMaxRate) > (b.maxRate || b.hourlyMaxRate) ? 1 : -1
                ))
                break;
            case 'rate_decreasing':
                // sort array by resource payment rate in decreasing order
                this.resourceData.sort((a, b) => (
                    (a.maxRate || a.hourlyMaxRate) < (b.maxRate || b.hourlyMaxRate) ? 1 : -1
                ))
                break;
            default:
                break;
        }

        // re-render cards in the DOM with sorted resource array
        this.renderCards(this.resourceData, this.startIndex, this.endIndex)

        // run update type function to display updated results
        this.updateType()

    },
    handleSearch(val) {
        // set search field input value to search term
        this.$searchInput.value = val
        var search = val.toLowerCase();

        // loop through resources in resource data array
        this.resourceData.forEach(el => {
            // reference element by class and data-name attribute value
            const $el = document.querySelector(`.card[data-name="${el.name}"]`)

            // remove class that hides element
            $el.classList.remove('d-none')
    
            // create array for any topics included in the search term
            let searchedTopics = []
            if (el.topics) {
                searchedTopics = el.topics.filter(topic => {
                    return topic.toLowerCase().includes(search)
                })
            }
    
            // make element visible if:
            //    1) search term includes resource name or >= 1 resource topic
            //    2) resource type is 'everything' or the active type
            if (
                (el.name.toLowerCase().includes(search) || searchedTopics.length) &&
                (el.type == this.activeType || this.activeType == 'everything')
            ) {
                $el.classList.remove('d-none')
            }
            else {
                $el.classList.add('d-none')
            }
        });

        // get number of elements with hidden class in cards container
        let numberHidden = this.$cardsContainer.getElementsByClassName('d-none').length

        // get total number of resources
        let totalItems = this.resourceData.length

        // calculate total number of cards shown (total cards minus hidden cards)
        let numberShown = totalItems - numberHidden

        // create string for number of resources shown
        let resourceCountText = `Displaying ${numberShown} `

        // add type of resource to resource count string
        switch (this.activeType) {
            case 'agency':
                resourceCountText += numberShown != 1 ? 'agencies' : 'agency'
                break;
            case 'publication':
                resourceCountText += numberShown != 1 ? 'publications' : 'publication'
                break;
            case 'publisher':
                resourceCountText += numberShown != 1 ? 'publishers' : 'publisher'
                break;
            default:
                resourceCountText += numberShown != 1 ? 'resources' : 'resource'
                break;
        }

        // set text content of DOM element to resource count string
        this.$resourceCount.textContent = resourceCountText

        // only display "no results" message if no resources are shown
        this.$noResults.classList.add('d-none')
        if (numberShown == 0) {
            this.$noResults.classList.remove('d-none')
        }
    },




}

// on window load, run function to load/parse JSON file
window.onload = () => {
    Resources.loadJSON()
}


