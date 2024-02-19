import React from 'react';
import html2canvas from 'html2canvas';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

type SimpleBarChartProps = {
  question: QuestionType;
  onNext: () => void;
  openForParticipants: () => void;
};

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Add more colors if needed

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ question, onNext, openForParticipants }) => {
  const data = question.answers.map((answer, index) => ({ name: answer.text, votes: answer.votes }));

  const [svg, setSvg] = React.useState<string>('');

  const exportToImage = async () => {
    miro.board.createImage({url: svg})
  };

  const convertChart = (ref) => {
    if (ref && ref.container) {
      let svg = ref.container.children[0];
      let svgData = new XMLSerializer().serializeToString(svg);
      let base64Data = btoa(unescape(encodeURIComponent(svgData)));
      let imgURL = 'data:image/svg+xml;base64,' + base64Data;
      console.log(imgURL);
      setSvg(imgURL);
    }
  };

  return (
    <div>
    <ResponsiveContainer width="100%" maxHeight={500} minWidth={500}>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button className="button button-secondary" onClick={exportToImage}>
          Export Results to Board        
        </button>
      </div>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
        ref={ref => convertChart(ref)} 
      >
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <text x={500 / 2} y={20} fill="black" textAnchor="middle" dominantBaseline="central">
            <tspan fontSize="14">{question.question}</tspan>
        </text>
        <Bar dataKey="votes">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button className="button button-secondary" onClick={openForParticipants}>
        Open For Participants       
      </button>
      <button className="button button-primary" onClick={onNext}>
        Next Question       
      </button>
      </div>
    </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;