var Resources = {

    // customizable settings
    cardsPerPage: 10,

    // state variables
    resourceData: [],
    relevantData: [],
    activeType: '',
    activeSort: '',
    totalPages: 0,
    activePageIndex: 0,
    startIndex: 0,
    endIndex: 0,

    // DOM element variables (denoted by '$')
    $cardsContainer: null,
    $noResults: null,
    $resourceCount: null,
    $searchInput: null,
    $typeInput: null,
    $sortInput: null,
    $clearBtn: null,
    $pagination: null,
    $paginationPrevBtn: null,
    $paginationNextBtn: null,

    loadJSON() {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                s = this.responseText
                // preserve newlines, etc - use valid JSON
                s = s.replace(/\\n/g, "\\n")  
                            .replace(/\\'/g, "\\'")
                            .replace(/\\"/g, '\\"')
                            .replace(/\\&/g, "\\&")
                            .replace(/\\r/g, "\\r")
                            .replace(/\\t/g, "\\t")
                            .replace(/\\b/g, "\\b")
                            .replace(/\\f/g, "\\f");
                // remove non-printable and other non-valid JSON chars
                s = s.replace(/[\u0000-\u0019]+/g,""); 

                // if successful, store JSON in resourceData array

                Resources.resourceData = JSON.parse(s)
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
        this.$paginationPrevBtn = document.querySelector('#pagination-prev-btn')
        this.$paginationNextBtn = document.querySelector('#pagination-next-btn')

        // initialize state variables as default DOM variable values
        this.activeType = this.$typeInput.value
        this.activeSort = this.$sortInput.value

        // initialize relevant data array as default JSON data
        this.relevantData = this.resourceData

        // establish listeners for interactive DOM elements
        this.setListeners()
        
        // render cards with relevant data and correct sort, type, and search settings
        this.updateAll()
    },

    renderPagination() {

        // calculate total pages required to display relevant data
        this.totalPages = Math.floor(this.relevantData.length / this.cardsPerPage) + 1

        // remove all pagination tabs
        var $allPaginationTabs = this.$pagination.getElementsByClassName('page-number')
        if ($allPaginationTabs.length) {
            while ($allPaginationTabs.length > 0){
                $allPaginationTabs[0].parentNode.removeChild($allPaginationTabs[0]);
            }
        }

        // toggle pagination visibility depending on total number of pages
        if (this.totalPages < 2) {
            this.$pagination.classList.add('d-none')
        }
        else {
            this.$pagination.classList.remove('d-none')
        }

        // insert new pagination tabs based on number of pages
        for (let i = 0; i < this.totalPages; i++) {
            let $paginationTab = document.createElement("li")
            $paginationTab.classList.add('page-item', 'page-number')

            // add CSS class to denote active page
            if (i == this.activePageIndex) { 
                $paginationTab.classList.add('active')
            }

            $paginationTab.innerHTML = `
                <a class="page-link" onclick="Resources.setPageIndex(${i})">${i+1}</a></li>
            `

            // insert pagination tab before the "next" button
            this.$pagination.insertBefore($paginationTab, this.$paginationNextBtn)
        }
    },

    setPageIndex(index) {

        this.activePageIndex = index

        // toggle "disabled" attribute for previous button depending on active page index
        if (this.activePageIndex < 1) {
            this.$paginationPrevBtn.classList.add('disabled')
            this.$paginationPrevBtn.firstElementChild.setAttribute('aria-disabled', 'true')
            this.$paginationPrevBtn.firstElementChild.setAttribute('tab-index', '-1')
        }
        else {
            this.$paginationPrevBtn.classList.remove('disabled')
            this.$paginationPrevBtn.firstElementChild.setAttribute('aria-disabled', 'false')
            this.$paginationPrevBtn.firstElementChild.setAttribute('tab-index', '0')
        }
        
        // toggle "disabled" attribute for next button depending on active page index
        if (this.activePageIndex >= this.totalPages - 1) {
            this.$paginationNextBtn.classList.add('disabled')
            this.$paginationNextBtn.firstElementChild.setAttribute('aria-disabled', 'true')
            this.$paginationNextBtn.firstElementChild.setAttribute('tab-index', '-1')
        }
        else {
            this.$paginationNextBtn.classList.remove('disabled')
            this.$paginationNextBtn.firstElementChild.setAttribute('aria-disabled', 'false')
            this.$paginationNextBtn.firstElementChild.setAttribute('tab-index', '0')
        }

        // update card start and end index with new page index
        this.startIndex = index * this.cardsPerPage
        this.endIndex = (this.cardsPerPage * (index + 1)) - 1

        // re-render cards to display relevant data
        this.renderCards()
    },

    renderCards() {

        // remove all cards from the DOM
        var $allItems = this.$cardsContainer.getElementsByClassName('card')
        if ($allItems.length) {
            while ($allItems.length > 0){
                $allItems[0].parentNode.removeChild($allItems[0]);
            }
        }

        let cardIndex = 0

        // loop through objects in relevant data array
        this.relevantData.forEach(el => {

            // add divs for card and card content to the DOM
            let $cardItem = document.createElement("div")
            let $cardBody = document.createElement("div")
            
            // set data-name attribute (resource name) & Bootstrap classes
            $cardItem.className = 'card my-2';
            $cardItem.setAttribute('data-name', el.name)
            $cardBody.className = 'card-body';

            let resourceTitle = `
                <h5 class="card-title w-100 d-flex justify-content-between mb-0">
                    <a href="${el.link}" target="_blank">
                        ${el.name}
                        <i class="bi bi-link card-link"></i>
                    </a>
                    <span class="badge rounded-pill type-badge">
                        ${el.type}
                    </span>
                </h5>
            `
            
            let rateInfo = ''

            // determine relevant payment rate information based on resource type
            switch (el.type) {
                case 'publication':
                    rateInfo += el.minRate ? `$${el.minRate} &ndash; ` : ''
                    rateInfo += el.maxRate ? `$${el.maxRate}` : ''
                    break;
    
                case 'publisher':
                    rateInfo += el.royaltyRate ? `$${el.royaltyRate}` : ''
                    break;
            
                case 'agency':
                    rateInfo += el.hourlyMinRate ? `$${el.hourlyMinRate}/hr &ndash;` : ''
                    rateInfo += el.hourlyMaxRate ? `$${el.hourlyMaxRate}/hr` : ''
                    break;
            
                default:
                    break;
            }

            if (rateInfo.length) {
                let rawRateInfo = rateInfo
                rateInfo = `
                    <h6 class="card-category d-flex align-items-center">
                        <i class="bi bi-credit-card me-3"></i>
                        <span>${rawRateInfo}<span class="fw-normal"> for first-time authors</span></span>
                    </h6>
                `
            }
    
            // add optional contact info
            let contactInfo = el.contact ? `
                <h6 class="card-category d-flex align-items-center">
                    <i class="bi bi-envelope me-3"></i>
                    <a href="mailto:${el.contact}" class="email-link">${el.contact}</a>
                </h6>
            ` : ''

            let resourceNotes = el.notes ? `
                <h6 class="card-category d-flex align-items-start pt-2">
                    <i class="bi bi-info-circle me-3"></i>
                    <span class="fw-normal card-notes">
                        ${el.notes}
                    </span>
                </h6>
            ` : ''

            // create labels for each resource topic
            let resourceTopics = ''
            if (el.topics) {
                el.topics.forEach(topic => {
                    resourceTopics += `
                        <span class="card-topic rounded-pill" onclick="Resources.searchByTopic('${topic}')">
                            ${topic}
                        </span>
                    `
                }); 
            }

            // add all card content HTML to the card
            let cardContent = ''
            cardContent += (rateInfo || contactInfo) ? `
                <div class="card-content pb-1">  
                    ${rateInfo}
                    ${contactInfo}
                </div>
            ` : ''
            cardContent += (resourceNotes || resourceTopics) ? `
                <div class="card-details mt-1 pt-1 border-top">
                    ${resourceNotes}
                    <div class="mt-3 d-flex justify-content-end flex-wrap">
                        ${resourceTopics}
                    </div>
                </div>
            ` : ''

            cardContent = (cardContent.length) ? `<div class="mt-3"></div>${cardContent}` : ''
            cardContent = resourceTitle + cardContent

            $cardBody.innerHTML = cardContent
    
            // append card body to parent card div
            $cardItem.appendChild($cardBody)

            // append card to container div
            this.$cardsContainer.appendChild($cardItem)


            // toggle visibility of card if it's included in range of indices for pagination
            if (cardIndex > this.endIndex || cardIndex < this.startIndex ) {
                $cardItem.classList.add('pagination-hidden')
            }
            else {
                $cardItem.classList.remove('pagination-hidden')
            }

            cardIndex++

        });

        this.renderPagination()
    },

    setListeners() {
        // handle search each time a key is pressed
        this.$searchInput.addEventListener("keyup", () => {
            this.updateAll()
        });

        // re-sort the array each time the sort select is changed
        this.$sortInput.addEventListener("change", () => {
            this.updateAll()
        });

        // update resource type when type select is changed
        this.$typeInput.addEventListener("change", () => {
            this.updateAll()
        });

        // clear search field when clear button is clicked
        this.$clearBtn.addEventListener("click", () => {
            this.$searchInput.value = ''
            this.updateAll()
        });
        
        // add event listener for pagination previous button
        this.$paginationPrevBtn.addEventListener("click", () => {
            if (this.activePageIndex > 0) {
                this.setPageIndex(this.activePageIndex - 1)
                // window.scrollTo(0, 0);
            }
        });

        // add event listener for pagination next button
        this.$paginationNextBtn.addEventListener("click", () => { 
            if (this.activePageIndex < this.totalPages - 1) {
                this.setPageIndex(this.activePageIndex + 1)
                // window.scrollTo(0, 0);
            }
        });  
    },

    updateType() {
        // set active type to value in type select
        this.activeType = this.$typeInput.value

        // reset relevant data to all data
        this.relevantData = this.resourceData

        // create new array for relevant data
        let updatedRelevantData = []

        this.relevantData.forEach(el => {
            // make element visible if resource type is 'everything' or the active type
            if (el.type == this.activeType || this.activeType == 'everything') {
                updatedRelevantData.push(el)
            }
        })

        // update relevant data array with new data
        this.relevantData = updatedRelevantData

        // this.renderCards()
    },

    updateSort() {
        // set active sort to value in sort select
        this.activeSort = this.$sortInput.value

        switch (this.activeSort) {
            case 'alpha':
                // sort array alphabetically by resource name
                this.relevantData.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1)
                break;
                case 'rate_increasing':
                // sort array by resource payment rate in increasing order
                this.relevantData.sort((a, b) => (
                    (a.maxRate || a.hourlyMaxRate) > (b.maxRate || b.hourlyMaxRate) ? 1 : -1
                ))
                break;
            case 'rate_decreasing':
                // sort array by resource payment rate in decreasing order
                this.relevantData.sort((a, b) => (
                    (a.maxRate || a.hourlyMaxRate) < (b.maxRate || b.hourlyMaxRate) ? 1 : -1
                ))
                break;
            default:
                break;
        }
    },

    updateSearch(val) {
        // set search field input value to search term
        this.$searchInput.value = val
        var search = val.toLowerCase();

        if (search != '') {

            let updatedRelevantData = []

            // loop through resources in resource data array
            this.relevantData.forEach(el => {

                // create array for any topics included in the search term
                let searchedTopics = []
                if (el.topics) {
                    searchedTopics = el.topics.filter(topic => {
                        return topic.toLowerCase().includes(search)
                    })
                }
                    
                // make element visible if search term includes resource name or >= 1 resource topic
                if (el.name.toLowerCase().includes(search) || searchedTopics.length) {
                    updatedRelevantData.push(el)
                }

            });
            this.relevantData = updatedRelevantData
        }

    },
    updateCount() {
        // create string for number of resources shown
        let resourceCountText = `Displaying ${this.relevantData.length} `

        // add type of resource to resource count string
        switch (this.activeType) {
            case 'agency':
                resourceCountText += this.relevantData.length != 1 ? 'agencies' : 'agency'
                break;
            case 'publication':
                resourceCountText += this.relevantData.length != 1 ? 'publications' : 'publication'
                break;
            case 'publisher':
                resourceCountText += this.relevantData.length != 1 ? 'publishers' : 'publisher'
                break;
            default:
                resourceCountText += this.relevantData.length != 1 ? 'resources' : 'resource'
                break;
        }

        // set text content of DOM element to resource count string
        this.$resourceCount.textContent = resourceCountText

        // only display "no results" message if no resources are shown
        this.$noResults.classList.add('d-none')
        if (this.relevantData.length == 0) {
            this.$noResults.classList.remove('d-none')
        }
    },

    updateAll() {
        // reset pagination to first page
        this.setPageIndex(0)

        // update relevant data with correct type setting
        this.updateType()

        // update relevant data with correct sort setting
        this.updateSort()

        // update relevant data with filter for search term
        this.updateSearch(this.$searchInput.value)

        // update count message
        this.updateCount()

        // re-render cards to display correct data
        this.renderCards()
    },

    searchByTopic(topic) {
        this.$searchInput.value = topic;
        this.updateAll()
    }

}

// on window load, run function to load/parse JSON file
window.onload = () => {
    Resources.loadJSON()
}


