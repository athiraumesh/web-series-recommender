import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'ad012238b103ccdd066b193a546cd8e5'; // Replace with your actual TMDB API key

interface Genre {
  id: number;
  name: string;
}

interface Show {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
}

export default function App() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [recommendations, setRecommendations] = useState<Show[]>([]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/genre/tv/list`, {
        params: {
          api_key: API_KEY,
        },
      });
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/tv`, {
        params: {
          api_key: API_KEY,
          with_genres: selectedGenre,
          first_air_date_year: selectedYear,
          sort_by: 'popularity.desc',
        },
      });
      setRecommendations(response.data.results);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 20; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Web Series Recommender
        </h1>
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-400 mb-2">
                  Genre
                </label>
                <select
                  id="genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-400 mb-2">
                  Year
                </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-gray-700 rounded-md border-gray-600 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a year</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={fetchRecommendations}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
            >
              Get Recommendations
            </button>
          </div>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((show) => (
            <div key={show.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-200 hover:shadow-2xl hover:scale-105">
              {show.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  {show.name}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-3">{show.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}