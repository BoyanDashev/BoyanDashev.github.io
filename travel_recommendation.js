document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById('search-button');
  const clearButton = document.getElementById('clear-button');
  searchButton.addEventListener('click', handleSearch);
  clearButton.addEventListener('click', clearResults);
  
  function handleSearch() {
    const searchField = document.getElementById('search-field');
    const query = searchField.value.trim().toLowerCase();
    
    fetch('./travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {
        const results = searchDestinations(data, query);
        displayResults(results);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  function searchDestinations(data, query) {
    let results = [];

    // Search in countries
    if (data.countries) {
      results = results.concat(searchCategory(data.countries, query));
    }
    
    // Search in temples
    if (data.temples) {
      results = results.concat(searchCategory(data.temples, query));
    }
    
    // Search in beaches
    if (data.beaches) {
      results = results.concat(searchCategory(data.beaches, query));
    }
    
    return results;
  }

  function searchCategory(category, query) {
    const keywordVariations = {
      "beach": ["beach", "beaches"],
      "temple": ["temple", "temples"],
      "country": ["country", "countries"]
    };
    
    return category.filter(item => {
      const itemName = item.name.toLowerCase();
      for (let key in keywordVariations) {
        if (keywordVariations[key].includes(query)) {
          if (itemName.includes(key)) {
            return true;
          }
        }
      }
      return false;
    });
  }

  function displayResults(results) {
    const container = document.getElementById('travel-recommendations');
    container.innerHTML = '';
    
    if (results.length === 0) {
      container.innerHTML = '<p>No results found.</p>';
      return;
    }
    
    results.forEach(place => {
      const placeElement = document.createElement('div');
      placeElement.innerHTML = `
        <h2>${place.name}</h2>
        <img src="${place.imageUrl}" alt="${place.name}">
        <p>${place.description}</p>
      `;
      container.appendChild(placeElement);
    });
  }

  function clearResults() {
    const container = document.getElementById('travel-recommendations');
    container.innerHTML = '';
  }
});
