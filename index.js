const appId = "df2e7bdf";
const appKey = "e1d29fa29c215f19e1408451b2c270b4";
const baseUrl = "https://api.edamam.com/search";
let searchTerm;
let maxResultInput;
let json;
let currentPage = 1;
let totalPage = 1;


//Listen for customize button click
function customizeSearchListener(){
    $('#search-customize').click( event => {
        event.preventDefault;
        $('.filter-container').toggleClass('hidden');
        $('#search-customize').toggleClass('button-active');
})
}

//This function listens for the click events happened on the filters
function filterListener(){
//Below listen for the health concern filter.
    $('.health-concern-option').click(event => {
        //When click on filter option, unselect the "No Preference" button.
        $('#health-no-preference').prop('checked',false);

        //When all filter options are unchecked, the "No Preference" button is automaically back on. 
        let ifChecked = false;
        $('.health-concern-option').each(function(){
            if ($(this).prop('checked')){
                ifChecked = true;
            } 
        })
        if (!ifChecked) {
            $('#health-no-preference').prop('checked',true);
        }
    })

    //when click on 'No Preference' button, unselect the rest checkboxes.
    $('#health-no-preference').click(event => {
        $('.health-concern-option').prop('checked',false);
    });
}

//Listen for clicks on the next page button.
function nextPageListner(){
    $('#js-result-summary, #pagination').on('click', '.next-page', function() {
        if (currentPage < totalPage) {
            currentPage++;
            displayResults(json, maxResultInput, searchTerm);
        }
    })
}

//Listen for clicks on the previous page button.
function previousPageListner(){
    $('#js-result-summary , #pagination').on('click', '.previous-page', function() {
        if (currentPage > 1) {
            currentPage--;
            displayResults(json, maxResultInput, searchTerm);
        }
    })
}

//Display search results.
function displayResults(responseJson,maxResults,userInputSearch){
    try {
        let totalResultNumber = responseJson.count;
        let recipeArr = responseJson.hits;

        if (totalResultNumber === 0){
            $('#js-error-message').text('Uh oh :( ...No matching result found! Wannat try again with something else?')
        }

        if (maxResults === "") {
            maxResults = 100;
        }
        
        if (totalResultNumber > maxResults){
            totalResultNumber = maxResults;
        } 

        //pagination
        totalPage = Math.ceil(totalResultNumber / 10);

        $('#display-result').removeClass('hidden');
        $('#result-list').html('');        
        for (let i = (currentPage - 1) * 10 ; i < Math.min((currentPage - 1) * 10 + 10, totalResultNumber) ; i++){
            console.log(i);
            let recipeName = recipeArr[i].recipe.label;
            console.log(recipeName);
            let recipeImage = recipeArr[i].recipe.image;
            let recipeUrl = recipeArr[i].recipe.url;
            let recipeCalorie = recipeArr[i].recipe.calories;
            let recipeYield = recipeArr[i].recipe.yield;
            $('#js-result-summary').html(`<button class="previous-page" type="button"> < </button> <span class="grey">${userInputSearch} Recipes</span> <span class="number">${totalResultNumber}</span> <button class="next-page" type="button"> > </button> <p>${currentPage} / ${totalPage}</p> `)
            $('#pagination').html(`<button class="previous-page" type="button"> < </button> <span class="grey">${userInputSearch} Recipes</span> <span class="number">${totalResultNumber}</span> <button class="next-page" type="button"> > </button> <p>${currentPage} / ${totalPage}</p> `)
            $('#result-list').append(
                `<li class="recipe-item"">
                    <div class="recipe-content-container">
                        <div class="img-container">
                            <img class="recipe-img" src="${recipeImage}" alt="recipe image">
                            <div class="middle">
                                <div class="text"><a class="hover-link" href="${recipeUrl}" target="_blank">Read Recipe</a></div>
                            </div>
                        </div>
                        <div class="recipe-description">
                            <h3 class="recipe-title">${recipeName}</h3>
                            <p>Serving Size: ${recipeYield}</p>
                            <p>Total Calories: ${recipeCalorie.toFixed(2)} KCal / ${(recipeCalorie / recipeYield).toFixed(2)} KCal per Serving</p>
                            <p><a class="content-link" href="${recipeUrl}" target="_blank">Click to read the recipe >></a></p>
                        </div>
                    <div>
                </li>`)
    }}
    catch(err){
        //console.log(err)
    }
}

//Format query.
function formatParameter(paramValueObj){
    const paramArr = Object.keys(paramValueObj); // ["app_id","app_key","q"]
    const paramValueArr = paramArr.map(key => `${key}=${paramValueObj[key]}`); //["app_id=xxxxx","app_key=xxxx","q=chicken,tomato"]
    return paramValueArr.join('&');
}

//Get response from API
function getRecipes(userInput,calorieRange,dietType,healthConcernSelected,maxResultNum){
    const queryArr = userInput.toLowerCase().split(",")// ["chicken","tomato"]
    const completeQuery = queryArr.join(","); // "chick,tomato"
    const encodedCompleteQuery = completeQuery.replace(" ", "%20")

    const param = {
        app_id: appId,
        app_key: appKey,
        q: encodedCompleteQuery,
        calories: calorieRange,
        diet: dietType,
        health: healthConcernSelected,
        //from: "0",
        to: "100"
    };

    if (dietType === "no-preference"){
        delete param.diet;
    }

    if (healthConcernSelected === "no-preference"){
        delete param.health;
    }

    console.log(param)

    const queryString = formatParameter(param);
    const finalUrl = baseUrl + '?' + queryString;

    console.log(finalUrl);

    fetch(finalUrl)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response);
        })
        .then(responseJson => {
            json = responseJson;
            displayResults(responseJson,maxResultNum,userInput)
        })
        .catch(err => {
            //$('#js-error-message').text(`Something went wrong: ${err.message}. Try again for another search！`)
            console.log(err)
        })
}

//Check and store Filter Result
function checkHealthConcernInput(){
    if ($('#health-no-preference').prop('checked')){
        return "no-preference"
    }

    let finalResult = [];

    $('.health-concern-option').each(function(){
        if ($(this).prop('checked')){
            finalResult.push($(this).val())
        }
    })
    return finalResult.join('&health=')
}

//Check and store Filter Result
function checkCalorieInput(min,max) {
    let minCal = "0";
    let maxCal = "10000";
    if (min != ""){
        minCal = min;
    }
    if (max != ""){
        maxCal = max;
    }
    return `${minCal}-${maxCal}`
}

//Listen for clicks on search button
function watchForm(){
    $('#main-form').submit(event => {
        event.preventDefault();

        if (!$('.filter-container').hasClass('hidden')) {
            $('.filter-container').toggleClass('hidden');
        }
        currentPage = 1;
        searchTerm = $('#js-search-bar').val();  
        maxResultInput = $('#max-result-filter').val();
        console.log(maxResultInput)
        const minCal = $('#min-cal').val();
        const maxCal = $('#max-cal').val();
        const calories = checkCalorieInput(minCal,maxCal);
        const dietTypeSelected = $('.diet-type-option:checked').val();
        const healthConcernSelected = checkHealthConcernInput();
        getRecipes(searchTerm,calories,dietTypeSelected,healthConcernSelected,maxResultInput);
        //$('#js-search-bar').val("");
        //$('#min-cal').val("");
        //$('#max-cal').val("");
        $('#result-list').empty();
        $('#js-error-message').empty();
        $('#js-result-summary').empty();
        $('#pagination').empty();
    })
}


$(filterListener);
$(watchForm);
$(customizeSearchListener);
$(nextPageListner);
$(previousPageListner);