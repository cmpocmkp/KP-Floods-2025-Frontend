import React from 'react';

interface DamageDonutChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  totalDamage: number;
  className?: string;
}

export const DamageDonutChart: React.FC<DamageDonutChartProps> = ({ 
  data, 
  totalDamage, 
  className = '' 
}) => {
  // Calculate the SVG dimensions and center
  const width = 400;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 120;
  const innerRadius = 80;
  
  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Generate SVG path for donut segments
  const generateArc = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const startX = centerX + Math.cos(startAngle) * outerRadius;
    const startY = centerY + Math.sin(startAngle) * outerRadius;
    const endX = centerX + Math.cos(endAngle) * outerRadius;
    const endY = centerY + Math.sin(endAngle) * outerRadius;
    
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
    
    const outerArc = `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    const innerArc = `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startX} ${startY}`;
    
    return `M ${startX} ${startY} ${outerArc} L ${endX} ${endY} ${innerArc} Z`;
  };

  let currentAngle = -Math.PI / 2; // Start from top

  return (
    <div className={`damage-donut-chart ${className}`}>
      <div className="chart-container">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Draw donut segments */}
          {data.map((item, index) => {
            const angle = (item.value / total) * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const path = generateArc(startAngle, endAngle, radius, innerRadius);
            
            currentAngle = endAngle;
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Center text */}
          <text x={centerX} y={centerY - 10} textAnchor="middle" className="center-title">
            DAMAGE
          </text>
          <text x={centerX} y={centerY + 15} textAnchor="middle" className="center-value">
            ${totalDamage.toLocaleString()}M
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="chart-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }}></div>
            <div className="legend-text">
              <span className="legend-name">{item.name}</span>
              <span className="legend-percentage">{item.percentage.toFixed(2)}%</span>
              <span className="legend-value">${item.value.toLocaleString()}M</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .damage-donut-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin: 20px 0;
        }
        
        .chart-container {
          position: relative;
        }
        
        .center-title {
          font-size: 16px;
          font-weight: bold;
          fill: #333;
          font-family: Arial, sans-serif;
        }
        
        .center-value {
          font-size: 20px;
          font-weight: bold;
          fill: #333;
          font-family: Arial, sans-serif;
        }
        
        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 300px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        
        .legend-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .legend-name {
          font-size: 12px;
          font-weight: 500;
          color: #333;
        }
        
        .legend-percentage {
          font-size: 11px;
          color: #666;
        }
        
        .legend-value {
          font-size: 11px;
          color: #666;
          font-weight: 500;
        }
        
        @media print {
          .damage-donut-chart {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}; 