import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { usePapaParse } from 'react-papaparse';
import parse from 'html-react-parser';
import '../../App.css';

const Bhajan = (props) => {
  const { readRemoteFile } = usePapaParse();
  const gidMap = props.gidMap;
  const [lyricsHtml, setLyricsHtml] = useState('');
  useEffect(() => {
    if (gidMap != {} && gidMap[props.selectedBhajan.column] != '') {
      const selectedBhajanSheet = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQjG4UmtnJUa-vTTTVcTzrbHOu9SUkkBaxt2ybzWUbA_aOt07h7KR0S2XKL4iywa5NlyexEQ7C1GECN/pub?gid=${gidMap[props.selectedBhajan.column]}&single=true&output=csv`
      // fetch bhajan sheet data
      let bhajanSheetData;
      readRemoteFile(selectedBhajanSheet, {
        complete: (res) => {
          bhajanSheetData = res.data;
          let tempLyricsHtml = '';
          let startIndex = -1;
          for (let i = 0; i < bhajanSheetData.length; i++) {
            let sheetRow = bhajanSheetData[i];
            if (parseInt(sheetRow[0]) > props.selectedBhajan.row) {
              break;
            }
            if (startIndex == -1 && parseInt(sheetRow[0]) == props.selectedBhajan.row) {
              startIndex = i;
            }
            if (startIndex > -1) {
              tempLyricsHtml += sheetRow[1] + '<br>';
            }
          }
          setLyricsHtml(tempLyricsHtml);
        }
      })
    }
  }, [props.selectedBhajan, gidMap])
  return (
    <>
      <div className='body'>
        <Navbar categories={props.categories} setSelectedCategory={props.setSelectedCategory} searchList = {props.searchList} setSelectedBhajan = {props.setSelectedBhajan}/>
        <div className="content-container">
            <h2>{props.selectedBhajan?.bhajanTitle}</h2>
            <div>{parse(lyricsHtml)}</div>
        </div>
      </div>
    </>
  )
}

export default Bhajan