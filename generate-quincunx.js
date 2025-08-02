const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const needed = [];
for (let i = 0; i < planets.length; i++) {
  for (let j = i; j < planets.length; j++) {
    needed.push(planets[i] + '_' + planets[j]);
  }
}

// Current combinations in the file
const existing = [
  'Sun_Sun', 'Sun_Moon', 'Sun_Mercury', 'Sun_Venus', 'Sun_Mars', 'Sun_Jupiter', 'Sun_Saturn', 'Sun_Uranus', 'Sun_Neptune', 'Sun_Pluto',
  'Moon_Moon', 'Moon_Mercury', 'Moon_Venus', 'Moon_Mars', 'Moon_Jupiter', 'Moon_Saturn', 'Moon_Uranus', 'Moon_Neptune', 'Moon_Pluto',
  'Venus_Jupiter'
];

const missing = needed.filter(combo => !existing.includes(combo));

console.log('Missing combinations:', missing.length);
console.log('Missing:', missing);

// Generate the remaining combinations
const remainingCombinations = [
  'Mercury_Mercury', 'Mercury_Venus', 'Mercury_Mars', 'Mercury_Jupiter', 'Mercury_Saturn', 'Mercury_Uranus', 'Mercury_Neptune', 'Mercury_Pluto',
  'Venus_Venus', 'Venus_Mars', 'Venus_Saturn', 'Venus_Uranus', 'Venus_Neptune', 'Venus_Pluto',
  'Mars_Mars', 'Mars_Jupiter', 'Mars_Saturn', 'Mars_Uranus', 'Mars_Neptune', 'Mars_Pluto',
  'Jupiter_Jupiter', 'Jupiter_Saturn', 'Jupiter_Uranus', 'Jupiter_Neptune', 'Jupiter_Pluto',
  'Saturn_Saturn', 'Saturn_Uranus', 'Saturn_Neptune', 'Saturn_Pluto',
  'Uranus_Uranus', 'Uranus_Neptune', 'Uranus_Pluto',
  'Neptune_Neptune', 'Neptune_Pluto',
  'Pluto_Pluto'
];

console.log('\nRemaining combinations to add:', remainingCombinations.length);
console.log('Remaining:', remainingCombinations); 