declare module 'vsop87' {
  interface PlanetCoords {
    x: number;
    y: number;
    z: number;
  }
  
  interface VSOP87Result {
    mercury: PlanetCoords;
    venus: PlanetCoords;
    earth: PlanetCoords;
    mars: PlanetCoords;
    jupiter: PlanetCoords;
    saturn: PlanetCoords;
    uranus: PlanetCoords;
    neptune: PlanetCoords;
  }
  
  const vsop87c: Promise<(jd: number) => VSOP87Result>;
  export default vsop87c;
} 