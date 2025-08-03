const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const needed = [];
for (let i = 0; i < planets.length; i++) {
  for (let j = i; j < planets.length; j++) {
    needed.push(planets[i] + '_' + planets[j]);
  }
}

// Quincunx combinations from the file
const quincunxExisting = [
  'Venus_Jupiter'
];

const quincunxMissing = needed.filter(function(combo) { 
  return !quincunxExisting.includes(combo); 
});

console.log('=== QUINCUNX ===');
console.log('Total needed:', needed.length);
console.log('Total existing:', quincunxExisting.length);
console.log('Missing combinations:', quincunxMissing.length);
console.log('First 10 missing:', quincunxMissing.slice(0, 10)); 