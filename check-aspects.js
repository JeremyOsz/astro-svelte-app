const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const needed = [];
for (let i = 0; i < planets.length; i++) {
  for (let j = i; j < planets.length; j++) {
    needed.push(planets[i] + '_' + planets[j]);
  }
}

// Opposition combinations from the file
const oppositionExisting = [
  'Sun_Sun', 'Sun_Moon', 'Sun_Mercury', 'Sun_Venus', 'Sun_Mars', 'Sun_Jupiter', 'Sun_Saturn', 'Sun_Uranus', 'Sun_Neptune', 'Sun_Pluto',
  'Moon_Moon', 'Moon_Mercury', 'Moon_Saturn', 'Moon_Neptune', 'Moon_Pluto',
  'Mercury_Mercury', 'Mercury_Venus', 'Mercury_Mars', 'Mercury_Jupiter', 'Mercury_Saturn', 'Mercury_Uranus', 'Mercury_Neptune', 'Mercury_Pluto',
  'Venus_Venus', 'Venus_Mars', 'Venus_Mercury', 'Venus_Jupiter', 'Venus_Saturn', 'Venus_Uranus', 'Venus_Neptune', 'Venus_Pluto',
  'Mars_Mars', 'Mars_Jupiter', 'Mars_Saturn', 'Mars_Neptune', 'Mars_Pluto',
  'Jupiter_Moon', 'Jupiter_Saturn', 'Jupiter_Uranus', 'Jupiter_Neptune', 'Jupiter_Pluto',
  'Saturn_Uranus', 'Saturn_Neptune', 'Saturn_Pluto',
  'Uranus_Pluto',
  'Neptune_Moon', 'Neptune_Mars', 'Neptune_Uranus', 'Neptune_Neptune', 'Neptune_Pluto',
  'Pluto_Pluto'
];

// Trine combinations from the file
const trineExisting = [
  'Sun_Sun', 'Sun_Moon', 'Sun_Mercury', 'Sun_Venus', 'Sun_Mars', 'Sun_Jupiter', 'Sun_Saturn', 'Sun_Uranus', 'Sun_Neptune', 'Sun_Pluto',
  'Moon_Moon', 'Moon_Saturn', 'Moon_Venus',
  'Mercury_Mercury', 'Mercury_Venus', 'Mercury_Mars', 'Mercury_Jupiter', 'Mercury_Saturn', 'Mercury_Uranus', 'Mercury_Pluto',
  'Venus_Venus', 'Venus_Mars', 'Venus_Mercury', 'Venus_Jupiter', 'Venus_Saturn', 'Venus_Uranus', 'Venus_Neptune', 'Venus_Pluto',
  'Mars_Mars', 'Mars_Saturn', 'Mars_Pluto', 'Mars_Jupiter', 'Mars_Neptune',
  'Jupiter_Moon', 'Jupiter_Saturn', 'Jupiter_Uranus', 'Jupiter_Neptune', 'Jupiter_Pluto',
  'Saturn_Uranus', 'Saturn_Neptune', 'Saturn_Pluto',
  'Uranus_Pluto',
  'Neptune_Mars', 'Neptune_Uranus', 'Neptune_Pluto',
  'Pluto_Neptune'
];

const oppositionMissing = needed.filter(function(combo) { 
  return !oppositionExisting.includes(combo); 
});

const trineMissing = needed.filter(function(combo) { 
  return !trineExisting.includes(combo); 
});

console.log('=== OPPOSITION ===');
console.log('Total needed:', needed.length);
console.log('Total existing:', oppositionExisting.length);
console.log('Missing combinations:', oppositionMissing);

console.log('\n=== TRINE ===');
console.log('Total needed:', needed.length);
console.log('Total existing:', trineExisting.length);
console.log('Missing combinations:', trineMissing); 