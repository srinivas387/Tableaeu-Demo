import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  var viz, sheet, table;
  const [vizInitialized, setVizInitialised] = useState(false);
  const [v, setV] = useState();
  const [s, setS] = useState();
  const [data, setData] = useState([]);
  const [formatValue, setFormatValue] = useState('');
  const [value, setValue] = useState('');

  function getUnderlyingData() {
    if (!vizInitialized) {
      var containerDiv = document.getElementById('vizContainer');
      var url = 'http://public.tableau.com/views/RegionalSampleWorkbook/Storms';
      var options = {
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive: function () {
          setVizInitialised(true);
          sheet = viz
            .getWorkbook()
            .getActiveSheet()
            .getWorksheets()
            .get('Storm Map Sheet');

          const options1 = {
            'Storm Name': '',
            ignoreAliases: false,
            ignoreSelection: true,
            includeAllColumns: false,
          };

          sheet?.getUnderlyingDataAsync(options1).then(function (t) {
            table = t;
            console.log(table.getData());
            setData(table.getData());
          });
        },
      };
      if (viz) {
        viz.dispose();
      }
      viz = new window.tableau.Viz(containerDiv, url, options);
      setV(viz);
      setS(sheet);
    }
  }

  const handleExportToExcel = () => {
    v.exportCrossTabToExcel();
  };

  return (
    <>
      <div>
        <button onClick={getUnderlyingData}>Get Data</button>
        <table>
          <thead>
            {data[0] && (
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      setValue('ALEX');

                      const s = v
                        .getWorkbook()
                        .getActiveSheet()
                        .getWorksheets()
                        .get('Storm Map Sheet');

                      if (event.target.checked) {
                        s.applyFilterAsync(
                          'Storm Name',
                          ['ALEX', formatValue],
                          window.tableau.FilterUpdateType.REPLACE
                        );
                      } else {
                        s.applyFilterAsync(
                          'Storm Name',
                          ['ALEX'],
                          window.tableau.FilterUpdateType.REMOVE
                        );
                      }
                    }}
                  />{' '}
                  Value{' '}
                </th>
                <th>
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      setFormatValue('BONNIE');
                      const s = v
                        .getWorkbook()
                        .getActiveSheet()
                        .getWorksheets()
                        .get('Storm Map Sheet');
                      if (event.target.checked) {
                        s.applyFilterAsync(
                          'Storm Name',
                          [value, 'BONNIE'],
                          window.tableau.FilterUpdateType.REPLACE
                        );
                      } else {
                        s.applyFilterAsync(
                          'Storm Name',
                          ['BONNIE'],
                          window.tableau.FilterUpdateType.REMOVE
                        );
                      }
                    }}
                  />{' '}
                  Formated Value
                </th>
              </tr>
            )}
          </thead>
          <tbody>
            {data[0] &&
              data[0].map((x) => (
                <tr>
                  <td>{x.value}</td>
                  <td>{x.formattedValue}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <button onClick={() => handleExportToExcel()}>Export to excel</button>
      </div>
      <div id="vizContainer" style={{ width: '600px', height: '600px' }}></div>
    </>
  );
}

export default App;
