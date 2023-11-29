import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePapaParse } from 'react-papaparse';
import Home from './pages/Home';
import Bhajan from './pages/Bhajan';
import NoPage from './pages/NoPage';

function App() {
  const { readRemoteFile } = usePapaParse();
  const IDXSheet = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQjG4UmtnJUa-vTTTVcTzrbHOu9SUkkBaxt2ybzWUbA_aOt07h7KR0S2XKL4iywa5NlyexEQ7C1GECN/pub?gid=0&single=true&output=csv';
  const [results, setResults] = useState({});
  const [searchList, setSearchList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBhajan, setSelectedBhajan] = useState({});
  const [gidMap, setGidMap] = useState({});
  useEffect(() => {
    readRemoteFile(IDXSheet, {
      complete: (res) => {
        setResults(res);
        setCategories(categories => [...categories, ...res.data[0]]);
        const categories = res?.data[0];
        const gids = res?.data[1];
        const tempGidMap = {};
        for (let i = 0; i < categories.length; i++) {
          tempGidMap[categories[i]] = gids[i];
        }
        setGidMap(tempGidMap);

        // setting up the complete search list of bhajan names
        let tempSearchList = [];
        for (let i = 2; i < res.data.length; i++) {
          const rowData = res.data[i];
          for (let j = 0; j < rowData.length; j++) {
            if (rowData[j] && rowData[j] != '') {
              let bhajan = {
                id:`row${i-1}&col${j}`,
                row: i - 1,
                column: categories[j],
                bhajanTitle: rowData[j]
              }
              tempSearchList.push(bhajan);
            }
          }
        }
        setSearchList(tempSearchList);
      },
    });
  }, []);
  return (<>
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={
          <Home
            setSelectedBhajan={setSelectedBhajan}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            results={results}
            categories={categories}
            searchList = {searchList}
          />
        } />
        <Route exact path='/bhajan' element={<Bhajan
          setSelectedBhajan={setSelectedBhajan}
          selectedBhajan={selectedBhajan}
          categories={categories}
          setSelectedCategory={setSelectedCategory}
          gidMap={gidMap}
          searchList = {searchList}
        />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  </>

  );
}

export default App;
