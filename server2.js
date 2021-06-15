import path from 'path';
import csv from 'csv-parser';
import fs from 'fs';
import cors from 'cors';
import express, { response } from 'express';



const app = express();
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3002;

const cord1 = {
  x: 31.9685988,
  y: -99.9018131,
};
const cord2 = {
  x: 32.7766642,
  y: -96.79698789999999,
};

const getFromData = (startPoint, endPoint) => {
  let cordinateList = [];
  let counter = 0;

    startPoint=JSON.parse(startPoint.json)
    endPoint=JSON.parse(endPoint.json)
    console.log(startPoint);
    console.log(endPoint)


  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
      counter++;
      if (startPoint.x < endPoint.x) {
        if (row.Start_Lat >= startPoint.x && row.Start_Lat <= endPoint.x) {
          var x = row.Start_Lat;
        }
      } else {
        if (row.Start_Lat >= endPoint.x && row.Start_Lat <= startPoint.x) {
          var x = row.Start_Lat;
        }
      }

      if (startPoint.y < endPoint.y) {
        if (row.Start_Lng >= startPoint.y && row.Start_Lng <= endPoint.y) {
          var y = row.Start_Lng;
        }
      } else {
        if (row.Start_Lng >= startPoint.y && row.Start_Lng <= endPoint.y) {
          var y = row.Start_Lng;
        }
      }

      if (x != undefined && y != undefined) {
        var info = row.Description;
        cordinateList.push({
          lat: x,
          lng: y,
          time: new Date(86400000 + counter),
          info: `${info}`,
        });
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      return cordinateList;
    });
};


const getCrushes =(req, res) => {

    const { cord1, cord2 } = req.body;
    return res.json=(cord1,cord2)
    // if (!cord1 || !cord2) {
    //   return res.status(400).json(req.body);
    // } else {
    //   return (res.json = getFromData(cord1, cord2));
    // }
  };


app.post('/getCrushes', getCrushes);

app.listen(PORT, () => {
    console.log(`app is working on port ${PORT}`);
  });
