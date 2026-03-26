interface ChartBirthData {
  date?: string;
  time?: string;
  latitude?: number;
  longitude?: number;
}

interface ChartSelectionCandidate {
  id?: string;
  birthData?: ChartBirthData;
}

function hasComparableBirthSignature(chart: ChartSelectionCandidate): boolean {
  const birthData = chart.birthData;
  return Boolean(
    birthData &&
      birthData.date &&
      birthData.time &&
      typeof birthData.latitude === 'number' &&
      typeof birthData.longitude === 'number'
  );
}

export function isSameChartSelection(
  currentChart: ChartSelectionCandidate | null,
  nextChart: ChartSelectionCandidate | null
): boolean {
  if (!currentChart || !nextChart) {
    return false;
  }

  if (currentChart.id && nextChart.id) {
    return currentChart.id === nextChart.id;
  }

  if (!hasComparableBirthSignature(currentChart) || !hasComparableBirthSignature(nextChart)) {
    return false;
  }

  return (
    currentChart.birthData!.date === nextChart.birthData!.date &&
    currentChart.birthData!.time === nextChart.birthData!.time &&
    currentChart.birthData!.latitude === nextChart.birthData!.latitude &&
    currentChart.birthData!.longitude === nextChart.birthData!.longitude
  );
}
