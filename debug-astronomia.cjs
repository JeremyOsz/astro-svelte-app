// Debug script for astronomia calculations
const { julian } = require('astronomia');
const { Planet } = require('astronomia/planetposition');
const { apparentLongitude } = require('astronomia/solar');
const { position } = require('astronomia/moonposition');

const testDate = new Date('1991-12-09T17:59:00.000Z');
const jd = julian.DateToJD(testDate);

console.log('Julian Day:', jd);
console.log('Test Date:', testDate.toISOString());
console.log('');

// Test Sun calculation
console.log('=== SUN ===');
try {
  const sunLongRad = apparentLongitude(jd);
  const sunLongDeg = sunLongRad * 180 / Math.PI;
  console.log('Sun longitude (rad):', sunLongRad);
  console.log('Sun longitude (deg):', sunLongDeg);
  console.log('Expected longitude:', 233.42);
  console.log('Difference:', Math.abs(sunLongDeg - 233.42));
} catch (error) {
  console.error('Sun calculation error:', error);
}

console.log('');

// Test Moon calculation
console.log('=== MOON ===');
try {
  const moonPos = position(jd);
  const moonLongRad = moonPos.lon;
  const moonLongDeg = moonLongRad * 180 / Math.PI;
  console.log('Moon longitude (rad):', moonLongRad);
  console.log('Moon longitude (deg):', moonLongDeg);
  console.log('Expected longitude:', 272.60);
  console.log('Difference:', Math.abs(moonLongDeg - 272.60));
} catch (error) {
  console.error('Moon calculation error:', error);
}

console.log('');

// Test other planets
const planets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
planets.forEach(planetName => {
  console.log(`=== ${planetName.toUpperCase()} ===`);
  try {
    const planet = new Planet(jd, planetName);
    const longRad = planet.lon;
    const longDeg = longRad * 180 / Math.PI;
    console.log(`${planetName} longitude (rad):`, longRad);
    console.log(`${planetName} longitude (deg):`, longDeg);
  } catch (error) {
    console.error(`${planetName} calculation error:`, error);
  }
  console.log('');
}); 