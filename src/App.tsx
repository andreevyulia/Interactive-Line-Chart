import { useEffect, useState } from 'react';
import './App.css'
import { LineChart } from './LineChart';
import { VariationData, VariationDef, type Conversion } from './models/data';
import data from "../public/data.json"

function App() {
  const [variationDef, setVariationDef] = useState<VariationDef[]>([]);
  const [variationData, setVariationData] = useState<VariationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
      const rates : VariationData[] =[];
      
      setVariationDef(data["variations"].map(x => {
        return new VariationDef(x.id? x.id.toString() : "0", x.name);
      }));

      // Calculate the conversion rate
      data["data"].forEach((item) => {
        const conversionsMap: Map<string, Conversion> = new Map(Object.entries(item.conversions));
        Object.entries(item.visits).forEach((visit) => {
          const conversionValue : any = conversionsMap.get(visit[0]) || 0; 
          const conversionRate = (conversionValue / visit[1]) * 100;
          if(!isNaN(conversionRate)){
            rates.push(new VariationData(
              Date.parse(item.date),
              visit[0],
              conversionRate
            ));
          }
        });
       })
      setVariationData(rates);
      
      setLoading(false);  
   
  }, [data]);

  if (loading) return <p>Loading...</p>;

  return <div className="App">
      <LineChart variationData={variationData} variationDef = {variationDef}/>
      </div>;
}

export default App
