const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const needed = [];
for (let i = 0; i < planets.length; i++) {
  for (let j = i; j < planets.length; j++) {
    needed.push(planets[i] + '_' + planets[j]);
  }
}

// Square combinations from the file
const squareExisting = [
  'Sun_Sun', 'Sun_Moon', 'Sun_Mercury', 'Sun_Venus', 'Sun_Mars', 'Sun_Jupiter', 'Sun_Saturn', 'Sun_Uranus', 'Sun_Neptune', 'Sun_Pluto',
  'Moon_Moon', 'Moon_Mercury',
  'Mercury_Mercury', 'Mercury_Venus', 'Mercury_Mars', 'Mercury_Jupiter', 'Mercury_Saturn',
  'Venus_Mercury', 'Venus_Mars', 'Venus_Saturn', 'Venus_Uranus', 'Venus_Neptune', 'Venus_Pluto',
  'Mars_Jupiter', 'Mars_Neptune', 'Mars_Pluto',
  'Jupiter_Moon', 'Jupiter_Saturn', 'Jupiter_Uranus', 'Jupiter_Neptune', 'Jupiter_Pluto',
  'Saturn_Uranus', 'Saturn_Neptune',
  'Uranus_Jupiter', 'Uranus_Neptune', 'Uranus_Pluto',
  'Neptune_Pluto',
  'Pluto_Saturn', 'Pluto_Venus'
];

const squareMissing = needed.filter(function(combo) { 
  return !squareExisting.includes(combo); 
});

console.log('=== SQUARE ===');
console.log('Total needed:', needed.length);
console.log('Total existing:', squareExisting.length);
console.log('Missing combinations:', squareMissing); 