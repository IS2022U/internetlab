// Your API key (get this from OpenWeatherMap)
import fetch from 'node-fetch';
const API_KEY = '2b9dee83e244ef202510a6d460db155a';

const city = 'Patan';

const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log('=== RAW DATA (First 2 items) ===');
    console.log(JSON.stringify(data.list.slice(0, 2), null, 2));
    
    const weatherList = data.list;
    
    console.log('\n=== 1. USING .map() - Extract Temperatures ===');
    const temperatures = weatherList.map(item => ({
      date: item.dt_txt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      description: item.weather[0].description,
      humidity: item.main.humidity
    }));
    console.log(temperatures);
    
    console.log('\n=== 2. USING .filter() - Rainy Days ===');
    const rainyDays = weatherList.filter(item => 
      item.weather[0].main === 'Rain'
    );
    console.log(`Found ${rainyDays.length} rainy periods`);
    if (rainyDays.length > 0) {
      rainyDays.forEach(day => {
        console.log(`- ${day.dt_txt}: ${day.weather[0].description}, ${day.main.temp}°C`);
      });
    } else {
      console.log('No rain in the forecast! ☀️');
    }
    
    console.log('\n=== 3. USING .filter() - Clear/Sunny Days ===');
    const sunnyDays = weatherList.filter(item => 
      item.weather[0].main === 'Clear'
    );
    console.log(`Found ${sunnyDays.length} clear weather periods`);
    sunnyDays.slice(0, 5).forEach(day => {
      console.log(`- ${day.dt_txt}: ${day.weather[0].description}, ${day.main.temp}°C`);
    });
    
    console.log('\n=== 4. COMBINING .filter() + .map() ===');
    // Get only temperatures when it's cloudy
    const cloudyTemps = weatherList
      .filter(item => item.weather[0].main === 'Clouds')
      .map(item => ({
        date: item.dt_txt,
        temp: item.main.temp,
        clouds: item.weather[0].description
      }));
    console.log('Cloudy day temperatures:');
    console.log(cloudyTemps);
    
    console.log('\n=== 5. USING .reduce() - Statistics ===');
    
    // Average temperature
    const avgTemp = weatherList.reduce((sum, item) => 
      sum + item.main.temp, 0
    ) / weatherList.length;
    console.log(`Average temperature: ${avgTemp.toFixed(2)}°C`);
    
    // Maximum temperature
    const maxTemp = weatherList.reduce((max, item) => 
      item.main.temp > max ? item.main.temp : max
    , -Infinity);
    console.log(`Maximum temperature: ${maxTemp}°C`);
    
    // Minimum temperature
    const minTemp = weatherList.reduce((min, item) => 
      item.main.temp < min ? item.main.temp : min
    , Infinity);
    console.log(`Minimum temperature: ${minTemp}°C`);
    
    console.log('\n=== 6. MORE ADVANCED FILTERING ===');
    
    // Hot days (temperature > 15°C)
    const hotDays = weatherList.filter(item => item.main.temp > 15);
    console.log(`Days with temp > 15°C: ${hotDays.length}`);
    
    // Cold nights (temperature < 8°C)
    const coldNights = weatherList.filter(item => item.main.temp < 8);
    console.log(`Periods with temp < 8°C: ${coldNights.length}`);
    
    // High humidity days (> 60%)
    const humidDays = weatherList.filter(item => item.main.humidity > 60);
    console.log(`High humidity periods (>60%): ${humidDays.length}`);
    
    console.log('\n=== 7. GROUPING BY DAY ===');
    // Get unique dates
    const uniqueDates = [...new Set(weatherList.map(item => 
      item.dt_txt.split(' ')[0]
    ))];
    
    console.log('Days in forecast:', uniqueDates);
    
    // Average temperature per day
    uniqueDates.forEach(date => {
      const dayData = weatherList.filter(item => 
        item.dt_txt.startsWith(date)
      );
      const dayAvg = dayData.reduce((sum, item) => 
        sum + item.main.temp, 0
      ) / dayData.length;
      
      console.log(`${date}: Average ${dayAvg.toFixed(2)}°C`);
    });
    
  })
  .catch(error => {
    console.error('Error:', error);
  });