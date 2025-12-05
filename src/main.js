
import movies from './movies.json'

import {
  filterByCategory,
  filterByMinRating,
  getFeatured,
  sortByRating,
  getAverageRating,
  searchByTitle
} from './list-utils.js'

const movieListEl = document.querySelector('#movie-list')
const categorySelectEl = document.querySelector('#category-filter')
const minRatingInputEl = document.querySelector('#min-rating')
const sortSelectEl = document.querySelector('#sort-order')
const searchInputEl = document.querySelector('#search')
const avgRatingEl = document.querySelector('#avg-rating')
const featuredToggleEl = document.querySelector('#featured-only')

const getAllCategories = movies =>
  Array.from(new Set(movies.map(m => m.category))).sort()

const renderCategoryOptions = () => {
  const categories = getAllCategories(movies)
  categorySelectEl.innerHTML = `
    <option value="">All Categories</option>
    ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
  `
}

const renderMovies = list => {
  if (!list.length) {
    movieListEl.innerHTML = '<li>No movies match your filters.</li>'
    avgRatingEl.textContent = 'Average Rating: N/A'
    return
  }

  movieListEl.innerHTML = list
    .map(
      m => `
      <li>
        <strong>${m.title}</strong> 
        (${m.releaseYear}) – ${m.category} – ⭐ ${m.rating.toFixed(1)}
        ${m.isFeatured ? ' – <span class="badge">Featured</span>' : ''}
      </li>
    `
    )
    .join('')

  const avg = getAverageRating(list)
  avgRatingEl.textContent = `Average Rating: ${avg.toFixed(2)}`
}

const getFilteredMovies = () => {
  let result = [...movies]

  const searchTerm = searchInputEl.value.trim()
  if (searchTerm) {
    result = searchByTitle(result, searchTerm)
  }

  const selectedCategory = categorySelectEl.value
  if (selectedCategory) {
    result = filterByCategory(result, selectedCategory)
  }

  const minRating = Number(minRatingInputEl.value) || 0
  if (minRating > 0) {
    result = filterByMinRating(result, minRating)
  }

  if (featuredToggleEl.checked) {
    result = getFeatured(result)
  }

  const sortOrder = sortSelectEl.value
  result = sortByRating(result, sortOrder)

  return result
}

const updateUI = () => {
  const filtered = getFilteredMovies()
  renderMovies(filtered)
}

const init = () => {
  renderCategoryOptions()
  updateUI()

  categorySelectEl.addEventListener('change', updateUI)
  minRatingInputEl.addEventListener('input', updateUI)
  sortSelectEl.addEventListener('change', updateUI)
  searchInputEl.addEventListener('input', updateUI)
  featuredToggleEl.addEventListener('change', updateUI)
}

init()
