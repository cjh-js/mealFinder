const searchBtn = document.querySelector('.search-btn');
const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.search');
const randomBtn = document.querySelector('.random-btn');

const resultText = document.querySelector('.result');
const showMeals = document.querySelector('.meals');
const singleMeal = document.querySelector('.single-meal');

// Get HTMl Elements
function getTitle(mealInfo){
    const title = document.createElement('div');
    title.innerText = mealInfo.strMeal;
    title.classList.add('singleMeal-title');
    return title;
}

function getImg(mealInfo){
    const img = document.createElement('img');
    img.src = mealInfo.strMealThumb;
    return img;
}

function getGenre(mealInfo){
    const genreWrap = document.createElement('div');
    const genre = document.createElement('h2');
    const country = document.createElement('h2');

    genreWrap.classList.add('genre');

    genre.innerText = mealInfo.strCategory;
    country.innerText = mealInfo.strArea;

    genreWrap.append(genre, country);

    return genreWrap;
}

function getRecipe(mealInfo){
    const recipe = document.createElement('div');
    recipe.classList.add('recipe');

    recipe.innerText = mealInfo.strInstructions;

    return recipe;
}

function getIngredientTitle(){
    const ingredientsTitle = document.createElement('h1');
    ingredientsTitle.classList.add('ingredientTitle');

    ingredientsTitle.innerText = 'Ingredients';

    return ingredientsTitle;
}

function getIngredients(mealInfo){
    const ingredients = document.createElement('div');
    ingredients.classList.add('ingredients');
    let elements = [];
    for(let i=1; i<=20; i++){
        if(`${mealInfo[`strIngredient${i}`]}`){
            elements.push(`${mealInfo[`strIngredient${i}`]} - ${mealInfo[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
        
    const ul = document.createElement('ul');
    elements.map(element => {
        const ingredient = document.createElement('li');
        ingredient.classList.add('ingredient');
        ingredient.innerText = element;
        ul.append(ingredient);
    });
    ingredients.append(ul);

    return ingredients;
}

// Single Food Detail
function getFoodDetail(foodName){

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`
    ).then(res => res.json()
    ).then(data => {
        const mealInfo = data.meals[0];

        const title = getTitle(mealInfo);
        const img = getImg(mealInfo);
        const genreWrap = getGenre(mealInfo);
        const recipe = getRecipe(mealInfo);
        const ingredientsTitle = getIngredientTitle();
        const ingredients = getIngredients(mealInfo);

        singleMeal.append(title, img, genreWrap, recipe, ingredientsTitle,ingredients);

    });
}

// Get Foods Grid
function getFoods(food){
    const foodWrap = document.createElement('div');
    const img = document.createElement('img');
    const foodInfo = document.createElement('div');

    img.classList.add('result-food');
    foodWrap.classList.add('each-meal');
    foodInfo.classList.add('food-info');

    img.src = food.strMealThumb;
    foodInfo.innerText = food.strMeal;

    foodWrap.append(foodInfo, img);
    showMeals.append(foodWrap);
}

function getRandom(){
    searchInput.value = '';
    singleMeal.innerHTML = '';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php'
    ).then(res => res.json()
    ).then(data => {
        const mealName = data.meals[0].strMeal;
        getFoodDetail(mealName);
    });
}

// Call Meal Info
async function findMeal(e){
    e.preventDefault();

    showMeals.innerText = '';

    const meal = searchInput.value.trim();
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
    const data = await res.json();
    const result = data.meals;
    if(result !== null){
        resultText.innerText = `Search results for '${meal}' :`;
        result.map((food) => {
            getFoods(food);
        });
    } else {
        resultText.innerText = 'There are no search results. Try again!';
        resultText.classList.add('no-results');
    }

    searchInput.value = '';
}

// Event Listener
searchForm.addEventListener('submit', findMeal);
randomBtn.addEventListener('click', getRandom);
showMeals.addEventListener('click', (e) => {
    singleMeal.innerHTML = '';
    const foodName = e.target.innerText;
    getFoodDetail(foodName);
});