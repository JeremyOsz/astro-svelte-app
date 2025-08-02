// Test file to verify synastry interpretations are being pulled correctly
import { getSynastryAspectInterpretation } from './index';

// Test various aspect combinations to ensure they're working
const testCases = [
  { aspect: 'Conjunction', planet1: 'Sun', planet2: 'Moon', relationship: 'romance' },
  { aspect: 'Opposition', planet1: 'Sun', planet2: 'Venus', relationship: 'friendship' },
  { aspect: 'Trine', planet1: 'Moon', planet2: 'Mars', relationship: 'family' },
  { aspect: 'Square', planet1: 'Mercury', planet2: 'Saturn', relationship: 'business' },
  { aspect: 'Sextile', planet1: 'Jupiter', planet2: 'Uranus', relationship: 'romance' }
];

console.log('Testing synastry interpretation usage:');
console.log('=====================================');

testCases.forEach((testCase, index) => {
  const interpretation = getSynastryAspectInterpretation(
    testCase.aspect, 
    testCase.planet1, 
    testCase.planet2, 
    testCase.relationship
  );
  
  console.log(`\nTest ${index + 1}: ${testCase.planet1} ${testCase.aspect} ${testCase.planet2} (${testCase.relationship})`);
  
  if (interpretation) {
    console.log(`✅ Found interpretation:`);
    console.log(`   - Compatibility: ${interpretation.compatibility}`);
    console.log(`   - Intensity: ${interpretation.intensity}`);
    console.log(`   - Interpretation: ${interpretation.interpretation.substring(0, 100)}...`);
  } else {
    console.log(`❌ No interpretation found`);
  }
});

// Test that the updated structure is working
console.log('\n\nTesting structure access:');
console.log('========================');

import { SYNASTRY_ASPECT_INTERPRETATIONS } from './synastry';

console.log('Available aspects:', Object.keys(SYNASTRY_ASPECT_INTERPRETATIONS));
console.log('Conjunction planets:', Object.keys(SYNASTRY_ASPECT_INTERPRETATIONS.Conjunction.planets));
console.log('Sample interpretation:', SYNASTRY_ASPECT_INTERPRETATIONS.Conjunction.planets.Sun_Moon?.interpretation.substring(0, 100) + '...'); 