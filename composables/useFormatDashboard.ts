export const generateConicGradient = (
  data: Record<string, number>,
  colors: Record<string, string>
) => {
  const dataArray = Object.entries(data);
  const total = dataArray.reduce((sum, [_, value]) => sum + value, 0);
  let currentPercentage = 0;

  return dataArray
    .map(([key, value]) => {
      const startPercentage = currentPercentage;
      const endPercentage = currentPercentage + (value / total) * 100;
      currentPercentage = endPercentage;
      return `${colors[key]} ${startPercentage}% ${endPercentage}%`;
    })
    .join(', ');
};

export const calculateWidth = (allData: any, data: number) => {
  let max = 0;

  if (Array.isArray(allData)) {
    max = Math.max(...allData.map((item) => item.count)) * 1.25;
  } else if (typeof allData === 'object') {
    max =
      Math.max(
        ...Object.values(allData).flatMap((group) => {
          if (typeof group === 'object' && group !== null) {
            return Object.values(group).map((value) =>
              typeof value === 'number' ? value : 0
            );
          }
          return [];
        })
      ) * 1.25;
  }

  if (max === 0) return 0;
  const width = (data * 100) / max;

  return width;
};
