var Resources = {
    resourceData: [],
    activeType: '',
    activeSort: '',

    $cardsContainer: null,
    $noResults: null,
    $resourceCount: null,
    $searchInput: null,
    $typeInput: null,
    $sortInput: null,

    loadJSON() {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                Resources.resourceData = JSON.parse(this.responseText)
                Resources.displayPage()
            }
        }
        xmlhttp.open("GET", "../js/data.json", true)
        xmlhttp.send()
    },

    displayPage() {
        this.$cardsContainer = document.querySelector('#cards-container')
        this.$noResults = document.querySelector('#no-results')
        this.$resourceCount = document.querySelector('#resource-count')
        this.$searchInput = document.querySelector('#search-input')
        this.$typeInput = document.querySelector('#type-input')
        this.$sortInput = document.querySelector('#sort-input')

        this.activeType = this.$typeInput.value
        this.activeSort = this.$sortInput.value

        this.renderCards()
        this.setListeners()
        
        this.updateType()
        this.updateSort()
    },

    renderCards() {

        this.resourceData.forEach(el => {
            console.log(el.name)
            let $cardItem = document.createElement("div")
            let $cardBody = document.createElement("div")
            
            $cardItem.className = 'card my-2';
            $cardItem.setAttribute('data-name', el.name)
            $cardBody.className = 'card-body';
    
            let cardContent = `
                <h5 class="card-title"><a href="${el.link}" target="_blank">${el.name} (${el.type})</a></h5>
            `
            let rateInfo = '<p class="card-text">'
    
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
            
            rateInfo += '</p>'
            cardContent += rateInfo
    
            cardContent += '<div class="w-100">'
            
            let cardTopics = ''
            if (el.topics) {
                el.topics.forEach(topic => {
                    cardTopics += `<span class="card-topic" onclick="Resources.handleSearch('${topic}')">${topic}</span>`
                }); 
            }
    
            cardContent += '</div>'
            cardContent += `<div class="w-100">${cardTopics}</div>`
    
            $cardBody.innerHTML = cardContent
    
            $cardItem.appendChild($cardBody)
            this.$cardsContainer.appendChild($cardItem)

            this.$resourceCount.textContent = `Displaying ${this.resourceData.length} resources`

        });
        
    },

    setListeners() {
        this.$searchInput.addEventListener("keyup", () => {
            this.handleSearch(this.$searchInput.value)
        });
        this.$sortInput.addEventListener("onchange", () => {
            this.handleSearch()
        });
    },
    updateType() {
        this.activeType = this.$typeInput.value
        this.handleSearch(this.$searchInput.value)
    },
    updateSort() {
        this.activeSort = this.$sortInput.value

        var $allItems = this.$cardsContainer.getElementsByClassName('card')
        while($allItems.length > 0){
            $allItems[0].parentNode.removeChild($allItems[0]);
        }

        switch (this.activeSort) {
            case 'alpha':
                this.resourceData.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1)
                break;
            case 'rate_increasing':
                this.resourceData.sort((a, b) => (
                    (a.maxRate || a.hourlyMaxRate) > (b.maxRate || b.hourlyMaxRate) ? 1 : -1
                ))
                break;
            case 'rate_decreasing':
                this.resourceData.sort((a, b) => (
                    (a.maxRate || a.hourlyMaxRate) < (b.maxRate || b.hourlyMaxRate) ? 1 : -1
                ))
                break;
            default:
                break;
        }

        this.renderCards()
        this.updateType()

    },
    handleSearch(val) {
        this.$searchInput.value = val
        var search = val.toLowerCase();
        this.resourceData.forEach(el => {
            const $el = document.querySelector(`.card[data-name="${el.name}"]`)
            $el.classList.remove('d-none')
    
            let searchedTopics = []
            if (el.topics) {
                searchedTopics = el.topics.filter(topic => {
                    return topic.toLowerCase().includes(search)
                })
            }
    
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

        let numberHidden = this.$cardsContainer.getElementsByClassName('d-none').length
        let totalItems = this.resourceData.length
        let numberShown = totalItems - numberHidden

        let resourceCountText = `Displaying ${numberShown} `

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

        this.$resourceCount.textContent = resourceCountText

        this.$noResults.classList.add('d-none')
        if (totalItems - numberHidden == 0) {
            this.$noResults.classList.remove('d-none')
        }
    },
}

window.onload = () => {
    Resources.loadJSON()
}
