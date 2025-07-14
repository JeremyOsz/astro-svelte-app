import vsop87c from 'vsop87';

// Test each correction step individually

// Reference data from professional source (Melbourne birth chart)
const referenceData = {
  // Date: 1991-12-09T17:59:00.000Z
  // Location: Melbourne, Australia (lat: -37.814, lon: 144.96332)
  
  // Professional astrology software reference positions
  Sun: 247.58,      // 17°34'42" Sagittarius
  Moon: 191.92,     // 11°55'13" Libra  
  Mercury: 237.51,  // 27°30'32" Sagittarius
  Venus: 244.56,    // 4°33'23" Sagittarius
  Mars: 82.62,      // 22°37'20" Gemini
  Jupiter: 358.81,  // 28°48'41" Pisces
  Saturn: 319.24,   // 19°14'15" Aquarius
  Uranus: 46.46,    // 16°27'41" Taurus
  Neptune: 352.70,  // 22°42'2" Pisces
};

// Constants
const AU = 149597870.691; // km
const LIGHT_SPEED = 299792.458; // km/s
const SPEED_OF_LIGHT_AU_PER_DAY = LIGHT_SPEED * 86400 / AU; // AU/day

// Apply precession from J2000 to date
function applyPrecession(x, y, z, jd) {
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000
  
  // Precession angles in arcseconds, converted to radians
  const zeta = (2306.2181 + 1.39656 * T - 0.000139 * T * T) * T * Math.PI / (180 * 3600);
  const z_prec = (2306.2181 + 1.39656 * T + 0.000139 * T * T) * T * Math.PI / (180 * 3600);
  const theta = (2004.3109 - 0.85330 * T - 0.000217 * T * T) * T * Math.PI / (180 * 3600);
  
  // Precession matrix
  const cos_zeta = Math.cos(zeta);
  const sin_zeta = Math.sin(zeta);
  const cos_z = Math.cos(z_prec);
  const sin_z = Math.sin(z_prec);
  const cos_theta = Math.cos(theta);
  const sin_theta = Math.sin(theta);
  
  const xx = cos_zeta * cos_z * cos_theta - sin_zeta * sin_z;
  const xy = -sin_zeta * cos_z * cos_theta - cos_zeta * sin_z;
  const xz = -sin_theta * cos_z;
  
  const yx = cos_zeta * sin_z * cos_theta + sin_zeta * cos_z;
  const yy = -sin_zeta * sin_z * cos_theta + cos_zeta * cos_z;
  const yz = -sin_theta * sin_z;
  
  const zx = cos_zeta * sin_theta;
  const zy = -sin_zeta * sin_theta;
  const zz = cos_theta;
  
  return {
    x: xx * x + xy * y + xz * z,
    y: yx * x + yy * y + yz * z,
    z: zx * x + zy * y + zz * z
  };
}

// Apply nutation correction
function applyNutation(x, y, z, jd) {
  const T = (jd - 2451545.0) / 36525.0;
  
  // Simplified nutation calculation (main terms only)
  const D = 297.85036 + 445267.111480 * T - 0.0019142 * T * T;
  const M = 357.52772 + 35999.050340 * T - 0.0001603 * T * T;
  const Mprime = 134.96298 + 477198.867398 * T + 0.0086972 * T * T;
  const F = 93.27191 + 483202.017538 * T - 0.0036825 * T * T;
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T;
  
  // Convert to radians
  const D_rad = D * Math.PI / 180;
  const M_rad = M * Math.PI / 180;
  const Mprime_rad = Mprime * Math.PI / 180;
  const F_rad = F * Math.PI / 180;
  const omega_rad = omega * Math.PI / 180;
  
  // Main nutation terms (in arcseconds)
  const dpsi = -17.20 * Math.sin(omega_rad) 
               - 1.32 * Math.sin(2 * (F_rad - D_rad + omega_rad))
               - 0.23 * Math.sin(2 * (F_rad + omega_rad))
               + 0.21 * Math.sin(2 * omega_rad);
  
  const deps = 9.20 * Math.cos(omega_rad) 
               + 0.57 * Math.cos(2 * (F_rad - D_rad + omega_rad))
               + 0.10 * Math.cos(2 * (F_rad + omega_rad))
               - 0.09 * Math.cos(2 * omega_rad);
  
  // Convert to radians
  const dpsi_rad = dpsi * Math.PI / (180 * 3600);
  const deps_rad = deps * Math.PI / (180 * 3600);
  
  // Mean obliquity of the ecliptic
  const epsilon0 = 23.439291 - 0.0130042 * T - 0.00000016 * T * T;
  const epsilon = epsilon0 + deps;
  const epsilon_rad = epsilon * Math.PI / 180;
  
  // Nutation matrix (simplified)
  const cos_eps = Math.cos(epsilon_rad);
  const sin_eps = Math.sin(epsilon_rad);
  const cos_dpsi = Math.cos(dpsi_rad);
  const sin_dpsi = Math.sin(dpsi_rad);
  
  return {
    x: cos_dpsi * x - sin_dpsi * cos_eps * y,
    y: sin_dpsi * x + cos_dpsi * cos_eps * y,
    z: sin_eps * y + cos_eps * z
  };
}

// Test function
async function testStepByStepCorrections() {
  console.log('Testing Step-by-Step Geocentric Corrections');
  console.log('==========================================');
  
  const testDate = new Date('1991-12-09T17:59:00.000Z');
  const jd = dateToJulianDay(testDate);
  
  console.log(`Test Date: ${testDate.toISOString()}`);
  console.log(`Julian Day: ${jd}`);
  console.log('');
  
  try {
    const vsop87 = await vsop87c;
    
    // Step 1: Raw heliocentric coordinates
    const coords = vsop87(jd);
    console.log('STEP 1: Raw Heliocentric Coordinates');
    console.log('====================================');
    console.log(`Earth: x=${coords.earth.x.toFixed(6)}, y=${coords.earth.y.toFixed(6)}, z=${coords.earth.z.toFixed(6)}`);
    console.log('');
    
    // Step 2: Basic geocentric transformation (what we're currently doing)
    console.log('STEP 2: Basic Geocentric Transformation');
    console.log('======================================');
    
    const testPlanets = {
      sun: { name: 'Sun', x: -coords.earth.x, y: -coords.earth.y, z: -coords.earth.z },
      mercury: { name: 'Mercury', x: coords.mercury.x - coords.earth.x, y: coords.mercury.y - coords.earth.y, z: coords.mercury.z - coords.earth.z },
      venus: { name: 'Venus', x: coords.venus.x - coords.earth.x, y: coords.venus.y - coords.earth.y, z: coords.venus.z - coords.earth.z },
      mars: { name: 'Mars', x: coords.mars.x - coords.earth.x, y: coords.mars.y - coords.earth.y, z: coords.mars.z - coords.earth.z },
      jupiter: { name: 'Jupiter', x: coords.jupiter.x - coords.earth.x, y: coords.jupiter.y - coords.earth.y, z: coords.jupiter.z - coords.earth.z },
      saturn: { name: 'Saturn', x: coords.saturn.x - coords.earth.x, y: coords.saturn.y - coords.earth.y, z: coords.saturn.z - coords.earth.z },
      uranus: { name: 'Uranus', x: coords.uranus.x - coords.earth.x, y: coords.uranus.y - coords.earth.y, z: coords.uranus.z - coords.earth.z },
      neptune: { name: 'Neptune', x: coords.neptune.x - coords.earth.x, y: coords.neptune.y - coords.earth.y, z: coords.neptune.z - coords.earth.z }
    };
    
    console.log('Planet    | Raw Geocentric | Reference | Difference');
    console.log('----------|----------------|-----------|----------');
    
    for (const [key, planet] of Object.entries(testPlanets)) {
      const spherical = rectangularToSpherical(planet.x, planet.y, planet.z);
      const reference = referenceData[planet.name];
      if (reference) {
        const difference = Math.abs(spherical.lon - reference);
        console.log(`${planet.name.padEnd(9)} | ${spherical.lon.toFixed(2).padStart(14)} | ${reference.toFixed(2).padStart(9)} | ${difference.toFixed(3).padStart(10)}`);
      }
    }
    console.log('');
    
    // Step 3: Add light-time correction
    console.log('STEP 3: With Light-Time Correction');
    console.log('=================================');
    
    const correctedCoords = await applyLightTimeCorrection(vsop87, jd, coords);
    
    console.log('Planet    | Light-Time Corrected | Reference | Difference');
    console.log('----------|---------------------|-----------|----------');
    
    for (const [key, planet] of Object.entries(testPlanets)) {
      let correctedPlanet = planet;
      
      // Apply light-time correction for planets (not Sun)
      if (key !== 'sun' && correctedCoords[key]) {
        correctedPlanet = {
          name: planet.name,
          x: correctedCoords[key].x - correctedCoords.earth.x,
          y: correctedCoords[key].y - correctedCoords.earth.y,
          z: correctedCoords[key].z - correctedCoords.earth.z
        };
      }
      
      const spherical = rectangularToSpherical(correctedPlanet.x, correctedPlanet.y, correctedPlanet.z);
      const reference = referenceData[planet.name];
      if (reference) {
        const difference = Math.abs(spherical.lon - reference);
        console.log(`${planet.name.padEnd(9)} | ${spherical.lon.toFixed(2).padStart(19)} | ${reference.toFixed(2).padStart(9)} | ${difference.toFixed(3).padStart(10)}`);
      }
    }
    console.log('');
    
    // Step 4: Add FK5 reference frame transformation
    console.log('STEP 4: With FK5 Reference Frame Transformation');
    console.log('==============================================');
    
    console.log('Planet    | FK5 Transformed | Reference | Difference');
    console.log('----------|----------------|-----------|----------');
    
    for (const [key, planet] of Object.entries(testPlanets)) {
      let correctedPlanet = planet;
      
      // Apply light-time correction for planets (not Sun)
      if (key !== 'sun' && correctedCoords[key]) {
        correctedPlanet = {
          name: planet.name,
          x: correctedCoords[key].x - correctedCoords.earth.x,
          y: correctedCoords[key].y - correctedCoords.earth.y,
          z: correctedCoords[key].z - correctedCoords.earth.z
        };
      }
      
      // Apply FK5 transformation
      const fk5Planet = applyFK5Transformation(correctedPlanet.x, correctedPlanet.y, correctedPlanet.z);
      
      const spherical = rectangularToSpherical(fk5Planet.x, fk5Planet.y, fk5Planet.z);
      const reference = referenceData[planet.name];
      if (reference) {
        const difference = Math.abs(spherical.lon - reference);
        console.log(`${planet.name.padEnd(9)} | ${spherical.lon.toFixed(2).padStart(15)} | ${reference.toFixed(2).padStart(9)} | ${difference.toFixed(3).padStart(10)}`);
      }
    }
    console.log('');
    
    // Step 5: Add precession correction
    console.log('STEP 5: With Precession Correction');
    console.log('=================================');
    
    console.log('Planet    | Precession Corrected | Reference | Difference');
    console.log('----------|---------------------|-----------|----------');
    
    for (const [key, planet] of Object.entries(testPlanets)) {
      let correctedPlanet = planet;
      
      // Apply light-time correction for planets (not Sun)
      if (key !== 'sun' && correctedCoords[key]) {
        correctedPlanet = {
          name: planet.name,
          x: correctedCoords[key].x - correctedCoords.earth.x,
          y: correctedCoords[key].y - correctedCoords.earth.y,
          z: correctedCoords[key].z - correctedCoords.earth.z
        };
      }
      
      // Apply FK5 transformation
      const fk5Planet = applyFK5Transformation(correctedPlanet.x, correctedPlanet.y, correctedPlanet.z);
      
      // Apply precession
      const precessionPlanet = applyPrecession(fk5Planet.x, fk5Planet.y, fk5Planet.z, jd);
      
      const spherical = rectangularToSpherical(precessionPlanet.x, precessionPlanet.y, precessionPlanet.z);
      const reference = referenceData[planet.name];
      if (reference) {
        const difference = Math.abs(spherical.lon - reference);
        console.log(`${planet.name.padEnd(9)} | ${spherical.lon.toFixed(2).padStart(19)} | ${reference.toFixed(2).padStart(9)} | ${difference.toFixed(3).padStart(10)}`);
      }
    }
    console.log('');
    
    // Step 6: Add nutation correction
    console.log('STEP 6: With Nutation Correction (Final)');
    console.log('=======================================');
    
    console.log('Planet    | Final Corrected | Reference | Difference');
    console.log('----------|----------------|-----------|----------');
    
    for (const [key, planet] of Object.entries(testPlanets)) {
      let correctedPlanet = planet;
      
      // Apply light-time correction for planets (not Sun)
      if (key !== 'sun' && correctedCoords[key]) {
        correctedPlanet = {
          name: planet.name,
          x: correctedCoords[key].x - correctedCoords.earth.x,
          y: correctedCoords[key].y - correctedCoords.earth.y,
          z: correctedCoords[key].z - correctedCoords.earth.z
        };
      }
      
      // Apply FK5 transformation
      const fk5Planet = applyFK5Transformation(correctedPlanet.x, correctedPlanet.y, correctedPlanet.z);
      
      // Apply precession
      const precessionPlanet = applyPrecession(fk5Planet.x, fk5Planet.y, fk5Planet.z, jd);
      
      // Apply nutation
      const finalPlanet = applyNutation(precessionPlanet.x, precessionPlanet.y, precessionPlanet.z, jd);
      
      const spherical = rectangularToSpherical(finalPlanet.x, finalPlanet.y, finalPlanet.z);
      const reference = referenceData[planet.name];
      if (reference) {
        const difference = Math.abs(spherical.lon - reference);
        console.log(`${planet.name.padEnd(9)} | ${spherical.lon.toFixed(2).padStart(15)} | ${reference.toFixed(2).padStart(9)} | ${difference.toFixed(3).padStart(10)}`);
      }
    }
    
  } catch (error) {
    console.error('Error in step-by-step test:', error);
  }
}

// Apply light-time correction
async function applyLightTimeCorrection(vsop87, jd, coords) {
  const correctedCoords = { ...coords };
  
  const planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  
  for (const planetName of planetNames) {
    if (coords[planetName]) {
      const planet = coords[planetName];
      const earth = coords.earth;
      
      // Calculate geocentric distance
      const dx = planet.x - earth.x;
      const dy = planet.y - earth.y;
      const dz = planet.z - earth.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // Calculate light-time in days
      const lightTime = distance / SPEED_OF_LIGHT_AU_PER_DAY;
      
      // Recalculate planet position at earlier time
      const correctedJD = jd - lightTime;
      const correctedPlanetCoords = vsop87(correctedJD);
      
      if (correctedPlanetCoords[planetName]) {
        correctedCoords[planetName] = correctedPlanetCoords[planetName];
      }
    }
  }
  
  return correctedCoords;
}

// Apply FK5 reference frame transformation
// From VSOP87.doc - transformation matrix from J2000 ecliptic to FK5 J2000 equatorial
function applyFK5Transformation(x, y, z) {
  // FK5 transformation matrix (VSOP87 J2000 ecliptic to FK5 J2000 equatorial)
  const matrix = [
    [1.000000000000, 0.000000440360, -0.000000190919],
    [-0.000000479966, 0.917482137087, -0.397776982902],
    [0.000000000000, 0.397776982902, 0.917482137087]
  ];
  
  const x_fk5 = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
  const y_fk5 = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
  const z_fk5 = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
  
  return { x: x_fk5, y: y_fk5, z: z_fk5 };
}

// Helper functions (same as before)
function dateToJulianDay(date) {
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12);
  const y = date.getUTCFullYear() + 4800 - a;
  const m = (date.getUTCMonth() + 1) + 12 * a - 3;
  
  let jd = date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add time fraction
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();
  
  const timeFraction = (hours + minutes / 60 + seconds / 3600 + milliseconds / 3600000) / 24;
  jd += timeFraction - 0.5; // Julian day starts at noon
  
  return jd;
}

function rectangularToSpherical(x, y, z) {
  const distance = Math.sqrt(x * x + y * y + z * z);
  const lon = Math.atan2(y, x) * 180 / Math.PI;
  const lat = Math.asin(z / distance) * 180 / Math.PI;
  
  return {
    lon: ((lon % 360) + 360) % 360, // Normalize to 0-360
    lat,
    distance
  };
}

// Run the test
testStepByStepCorrections(); 