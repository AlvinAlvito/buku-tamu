import { ResponsivePie } from '@nivo/pie';

interface PieData {
  id: string;
  label: string;
  value: number;
}

interface DonutChartProps {
  data: PieData[];
}

export default function DonutChart({ data }: DonutChartProps) {
  // balik data untuk legend
  const reversedData = [...data].reverse();

  return (
    <div
      style={{
        height: '90%',
        width: '135%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: '1 1 60%', minWidth: '300px', height: '100%' }}>
        <ResponsivePie
          data={reversedData}
          margin={{ top: 20, right: 500, bottom: 60, left: 40 }} // margin kanan ditambah
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'nivo' }}
          theme={{
            labels: {
              text: {
                fontSize: 14,
                fontWeight: 600,
              },
            },
            legends: {
              text: {
                fontSize: 14,
                fill: '#009ebb',
              },
            },
          }}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 200, // lebih ke kanan
              translateY: 0,
              itemsSpacing: 8,
              itemWidth: 150,
              itemHeight: 18,
              itemDirection: 'left-to-right',
              itemTextColor: '#666',
              itemOpacity: 1,
              symbolSize: 14,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#009ebb',
                  },
                },
              ],
            },
          ]}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#009ebb"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          tooltip={({ datum }) => (
            <strong>
              {datum.label}: {datum.value}
            </strong>
          )}
        />
      </div>
    </div>
  );
}
