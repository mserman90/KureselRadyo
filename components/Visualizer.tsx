import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VisualizerProps {
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ isPlaying }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous
    svg.selectAll("*").remove();

    const barCount = 30;
    const barWidth = width / barCount;
    
    // Create data points
    const data = d3.range(barCount).map(() => Math.random());

    const bars = svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * barWidth)
      .attr("width", barWidth - 2)
      .attr("fill", "#a855f7") // Purple-500
      .attr("rx", 2); // Rounded corners

    let animationId: number;

    const animate = () => {
      if (isPlaying) {
        // Update data with randomness to simulate audio freq (Fake viz since CORS blocks real analysis usually)
        svg.selectAll("rect")
          .data(d3.range(barCount).map((d, i) => {
             // Create a wave-like pattern + noise
             const time = Date.now() / 500;
             const wave = Math.sin(i * 0.2 + time) * 0.3 + 0.5;
             return Math.max(0.1, Math.min(1, wave + (Math.random() - 0.5) * 0.4));
          }))
          .transition()
          .duration(100)
          .ease(d3.easeLinear)
          .attr("y", d => height - (d * height))
          .attr("height", d => d * height)
          .attr("fill", (d, i) => {
             // Gradient color based on height/index
             return d3.interpolateCool(d * 0.8 + 0.1); 
          });
      } else {
        // Flatten bars when stopped
        svg.selectAll("rect")
          .transition()
          .duration(500)
          .attr("y", height - 5)
          .attr("height", 5)
          .attr("fill", "#3f3f46"); // Zinc-700
      }

      if (isPlaying) {
         animationId = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    } else {
       // Reset to flat
       svg.selectAll("rect")
          .transition()
          .duration(500)
          .attr("y", height - 5)
          .attr("height", 5)
          .attr("fill", "#3f3f46");
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full opacity-80" 
      preserveAspectRatio="none"
    />
  );
};

export default Visualizer;