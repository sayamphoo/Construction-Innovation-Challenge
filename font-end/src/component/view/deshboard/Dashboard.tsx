import React, { useState, useEffect } from "react";

import "./Deshboard.scss";

interface PMData {
  pm1: number;
  pm2_5: number;
  pm10: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<PMData[]>([{ pm1: 0, pm2_5: 0, pm10: 0 }]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://34.201.53.199:7700/air-sensor-all"); // เปลี่ยนเส้นทางของ API เป็น URL ของ API ที่คุณต้องการใช้งาน
      const data = await response.json();
      if(data != null) {
        setData(data);
      }
      
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function getColorCode(number: number): string {
    if (number >= 0 && number <= 12) {
      return "#8DE060";
    } else if (number >= 12.1 && number <= 35.4) {
      return "#f3c017";
    } else if (number >= 35.5 && number <= 55.4) {
      return "#E2894D";
    } else if (number >= 55.5 && number <= 150.4) {
      return "#f6676b";
    } else if (number >= 150.5 && number <= 250.4) {
      return "#DD5C60";
    } else if (number >= 250.5) {
      return "#D03D6E";
    } else {
      return "Invalid number";
    }
  }

  const ReaderTable = data.map((result: PMData) => {
    return (
      <tr>
        <td>{result.pm1}</td>
        <td>{result.pm2_5}</td>
        <td>{result.pm10}</td>
      </tr>
    );
  });

  const download = () => {
    const link = document.createElement('a');
    link.href = 'http://34.201.53.199:7700/download';
    link.click();
  };

  return (
    <div className="container">
      <div className="box-item">
        <div
          style={{ backgroundColor: getColorCode(data[0].pm1) }}
          className="item"
        >
          <p>PM1</p>
          <p>{data[0]?.pm1.toString()}</p>
          <p>µg/m3</p>
        </div>
        <div
          style={{ backgroundColor: getColorCode(data[0].pm2_5) }}
          className="item"
        >
          <p>PM2.5</p>
          <p>{data[0]?.pm2_5.toString()}</p>
          <p>µg/m3</p>
        </div>
        <div
          style={{ backgroundColor: getColorCode(data[0].pm10) }}
          className="item"
        >
          <p>PM10</p>
          <p>{data[0]?.pm10.toString()}</p>
          <p>µg/m3</p>
        </div>
      </div>

      <div className="oldData">
        <button onClick={download}>Download Excel</button>

        <div className="tabledata">
          <table>
            <tr>
              <th>PM1</th>
              <th>PM2.5</th>
              <th>PM10</th>
            </tr>
            {ReaderTable}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
