import React, { useState, useEffect } from 'react';
import './autocomplete.css'; // Tạo file CSS để định dạng danh sách gợi ý
import axios from 'axios';

const AutocompleteSearch = ({onLocationSelect}) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (searchInput.length > 2) {
      const apiKey = '2a993ba7ec9941d69d8cb930e7f79797'; // Thay thế bằng Geoapify API Key của bạn
      fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${searchInput}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.features) {
            setSuggestions(data.features);
          }
        })
        .catch(error => {
          console.error('Error fetching autocomplete suggestions:', error);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchInput]);

  const handleSelectSuggestion =async (suggestion) => {
    const location = {
      formattedAddress: suggestion.properties.formatted,
      city: suggestion.properties.city,
      state: suggestion.properties.state,
      country: suggestion.properties.country,
      coordinates: suggestion.geometry.coordinates,
    };
    // Gọi hàm callback được truyền từ `index.jsx`
    if (typeof onLocationSelect === 'function') {
      onLocationSelect(location);
    }

    // Cập nhật ô tìm kiếm và xóa danh sách gợi ý
    setSearchInput(suggestion.properties.formatted);

    setSuggestions([]); // Clear suggestions after selection
   };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className='border-[2px]'
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
              {suggestion.properties.formatted}
            </li>
          ))}
        </ul>
      )}
      {selectedLocation && (
        <div>
          <h3>Selected Location</h3>
          <p>{selectedLocation.name}</p>
          <p>Coordinates: {selectedLocation.coordinates[1]}, {selectedLocation.coordinates[0]}</p>
        </div>
      )}
      
    </div>
  );
};

export default AutocompleteSearch;
