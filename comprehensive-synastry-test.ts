// Comprehensive test to verify all missing synastry interpretations are now available
import { getSynastryAspectInterpretation } from './index';

// Test all the missing aspects from the image
const missingAspects = [
  { aspect: 'Opposition', planet1: 'Mercury', planet2: 'Neptune' },
  { aspect: 'Trine', planet1: 'Mercury', planet2: 'Pluto' },
  { aspect: 'Sextile', planet1: 'Venus', planet2: 'Venus' },
  { aspect: 'Quincunx', planet1: 'Venus', planet2: 'Jupiter' },
  { aspect: 'Sextile', planet1: 'Mars', planet2: 'Mars' },
  { aspect: 'Trine', planet1: 'Mars', planet2: 'Saturn' },
  { aspect: 'Square', planet1: 'Mars', planet2: 'Pluto' },
  { aspect: 'Square', planet1: 'Jupiter', planet2: 'Moon' }
];

console.log('Testing all previously missing synastry interpretations:');
console.log('=======================================================');

missingAspects.forEach((testCase, index) => {
  const interpretation = getSynastryAspectInterpretation(
    testCase.aspect, 
    testCase.planet1, 
    testCase.planet2, 
    'romance'
  );
  
  console.log(`\nTest ${index + 1}: ${testCase.planet1} ${testCase.aspect} ${testCase.planet2}`);
  
  if (interpretation) {
    console.log(`✅ Found interpretation:`);
    console.log(`   - Compatibility: ${interpretation.compatibility}`);
    console.log(`   - Intensity: ${interpretation.intensity}`);
    console.log(`   - Interpretation: ${interpretation.interpretation.substring(0, 100)}...`);
  } else {
    console.log(`❌ Still missing interpretation`);
  }
});

console.log('\n\nSummary:');
console.log('========');
const found = missingAspects.filter((testCase, index) => {
  const interpretation = getSynastryAspectInterpretation(
    testCase.aspect, 
    testCase.planet1, 
    testCase.planet2, 
    'romance'
  );
  return interpretation !== null;
}).length;

console.log(`Found ${found} out of ${missingAspects.length} missing interpretations`);
console.log(`Coverage: ${Math.round((found / missingAspects.length) * 100)}%`); 