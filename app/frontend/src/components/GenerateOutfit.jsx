import React, { useState } from 'react';
import Weather from './Weather';
import Wardrobe from './Wardrobe';
import hatImg from '../images/hats/hat1.jpg'
import WjacketImg from '../images/jackets/jacket1.jpg'
import LjacketImg from '../images/jackets/jacket2.jpg'
import shirtImg from '../images/shirts/shirt3.jpg'
import LshirtImg from '../images/shirts/shirt2.jpg'
import shoeImg from '../images/shoes/shoes1.jpg'
import jeansImg from '../images/pants/pants3.jpg'
import shortsImg from '../images/pants/pants2.jpg'
import axios from 'axios';
const OutfitGenerator = async () => {

  // State for selected items and weather
  const [selectedItems, setSelectedItems] = useState([]);
  const [weather, setWeather] = useState(null);

  const availableItems = {
    'Middle': ['Cold', 'Shoes', shoeImg],
    'Bottom': ['Hot | Mild', 'Pants', jeansImg],
    'Shoes': ['Hot | Mild | Cold', 'Shirts & Tops', shirtImg],
    'Shorts': ['Hot', 'Pants', shortsImg],
  };

  let Outfit = new Set();
  let imgArray = [];



  // Function to generate an ideal outfit based on selected items and weather
  const generateOutfit = () => {

    // Check if there are selected items
    if (selectedItems.length === 0) {
      alert('Please select some clothing items.');
      return;
    }

    // Logic to determine the outfit based on the filteredItems and weather.temperature
    let idealOutfit = "";

    let temperature = weather.main.temp;

    if (weather && temperature) {
      const outfits = {
        'Cold': new Set(),
        'Mild': new Set(),
        'Hot': new Set(),
      };

      selectedItems.forEach((item) => {
        const [itemTemperature, clothingCategory, itemImage] = availableItems[item];

        if (itemTemperature.includes('Cold')) {
          outfits['Cold'].add(item);
        }

        if (itemTemperature.includes('Mild')) {
          outfits['Mild'].add(item);
        }

        if (itemTemperature.includes('Hot')) {
          outfits['Hot'].add(item);
        }

        // Add the item image URL to imgArray
        imgArray.push(itemImage);
      });

      let piece;
      if (temperature < 10) {
        piece = getRandomItems(outfits['Mild'])
        idealOutfit += piece + ', ';
        Outfit.add(piece)

      } else if (temperature >= 10 && temperature < 20) {
        piece = getRandomItems(outfits['Mild'])
        idealOutfit += piece + ', ';
        Outfit.add(piece)
      } else {

        piece = getRandomItems(outfits['Mild'])
        idealOutfit += piece + ', ';
        Outfit.add(piece)
      }
    } else {
      idealOutfit += "Please wait for weather data.";
    }

    idealOutfit = idealOutfit.slice(0, -2);
    console.log(idealOutfit);
    
  };
  
  // Function to get random items from a Set
  const getRandomItems = (itemSet) => {
    const items = Array.from(itemSet);
    const selectedItems = [];

    while (items.length > 0) {
      const randomIndex = Math.floor(Math.random() * items.length);
      selectedItems.push(items.splice(randomIndex, 1)[0]);
    }

    return selectedItems.join(', ');

  };


  // ###### start of fetch coding ######

  const axios = require('axios');

  let fit = [
    {
      name:"Middle",
      type: "Clothing",
      options: ["Shirts & Tops"]
    },
    {
      name:"Bottom",
      type: "Clothing",
      options: [
				"Shorts",
				"Swimwear",
				"Pants",
				"Jeans",
				"Underwear"]
    },
    {
      name:"Shoes",
      type: "Shoes",
      options: [
        "Sneakers & Athletic",
				"Sandals",
				"Running Shoes",
				"Oxfords",
				"Loafers",
				"Clogs",
				"Boots",
				"Wide"]
    }
  ]
  
  // presets = [[top][middle][bottom]]
  async function setTopMiddleBottom(presets) {
    let imageArray = []; // holds the image urls to be paced straight to html object
    for (let i = 0; i < 3; i++) {
      imageArray.push(callingListApi(i,presets[i]));
    }
    return imageArray;
  }

  // takes in to parts position which is top middle bottom which is 0,1,2 and array [] options 
  async function callingListApi(position,options) {
    const options = {
      method: 'POST',
      url: 'https://zappos1.p.rapidapi.com/products/list',
      params: {
        page: '1',
        limit: '50',
        sort: 'relevance/desc'
      },
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '31b7cc45b3mshbdc7747cb8edda3p15254ejsn15b8c6d04f38',
        'X-RapidAPI-Host': 'zappos1.p.rapidapi.com'
      },
      data: [
        {
          facetField: 'zc1',
          values: [fit[position].type]
        },
        {
          facetField: 'zc2',
          values: reduceArray(fit[position].options,options)
        },
        {
          facetField: 'txAttrFacet_Gender',
          values: ['Men']
        }
      ]
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      return ["https://www.freepnglogos.com/uploads/among-us-png/green-among-us-png-character-0.png"];
    }

    return randomSelect(mapToImages(response.data));
  }

  function mapToImages(dataObject) {
    resultArray = dataObject.results;
    return resultsArray.map((item) => {
      return "https://www.zappos.com" + item.productUrl;
    }) 
  }

  function randomSelect(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function reduceArray(array,indexes) {
    let newArray = []
    for (let i = 0; i < indexes.length; i++) {
      newArray.push(array[indexes[i]])
    }
    return newArray;
  }
  // ###### end of fetch coding ######

  return (
    <div className="flex justify-center h-screen w-full">
      <div className="w-1/3 px-4 shadow-2xl h-5/6 rounded-2xl mr-4">
        <Wardrobe selectedItems={selectedItems} setSelectedItems={setSelectedItems} availableItems={availableItems} />
      </div>
      <div className="w-1/2 px-4 flex flex-col justify-end items-center h-5/6 bg-black bg-opacity-10 rounded-2xl shadow-xl">
        <button onClick={generateOutfit} className="bg-blue-500 hover:bg-blue-600 text-white font-bold my-8 py-2 px-4 rounded w-2/3 shadow-xl">
          Generate my outfit!
        </button>

        {/* Render the images associated with each item in imgArray */}
        <div>
          {imgArray.map((itemImage, index) => (
            <img
              key={index}
              src={itemImage}
              alt={"outfit item"}
              className="w-40 h-40"
            />
          ))}
        </div>

      </div>
      <div className="w-1/3 px-4 h-5/6">
        <Weather weather={weather} setWeather={setWeather} />
      </div>
    </div>
  );
};

export default OutfitGenerator;

