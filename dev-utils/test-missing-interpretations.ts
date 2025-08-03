// Test to verify missing synastry interpretations are now available
import { getSynastryAspectInterpretation } from './index';

// Test the missing aspects from the image
const missingAspects = [
  { aspect: 'Square', planet1: 'Moon', planet2: 'Mercury' },
  { aspect: 'Trine', planet1: 'Moon', planet2: 'Saturn' },
  { aspect: 'Opposition', planet1: 'Mercury', planet2: 'Moon' },
  { aspect: 'Trine', planet1: 'Mercury', planet2: 'Uranus' },
  { aspect: 'Opposition', planet1: 'Mercury', planet2: 'Neptune' }
];

console.log('Testing previously missing synastry interpretations:');
console.log('==================================================');

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