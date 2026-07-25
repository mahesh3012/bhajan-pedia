import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePapaParse } from 'react-papaparse';
import parse from 'html-react-parser';
import Navbar from '../../components/Navbar';
import { Diya } from '../../components/Diya';
import { deityLabel, splitBhajan } from '../../utils/text';
import '../../App.css';

const Bhajan = (props) => {
  const navigate = useNavigate();
  const { readRemoteFile } = usePapaParse();
  const gidMap = props.gidMap;
  const selectedBhajan = props.selectedBhajan || {};
  const hasSelection = Boolean(selectedBhajan.bhajanTitle);
  const [lyricsHtml, setLyricsHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const column = selectedBhajan.column;
    if (gidMap && gidMap[column] && gidMap[column] !== '') {
      setLoading(true);
      const sheet = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQjG4UmtnJUa-vTTTVcTzrbHOu9SUkkBaxt2ybzWUbA_aOt07h7KR0S2XKL4iywa5NlyexEQ7C1GECN/pub?gid=${gidMap[column]}&single=true&output=csv`;
      const targetRow = parseInt(selectedBhajan.row, 10);
      readRemoteFile(sheet, {
        complete: (res) => {
          const data = res.data;
          let html = '';
          let startIndex = -1;
          for (let i = 0; i < data.length; i++) {
            const sheetRow = data[i];
            if (parseInt(sheetRow[0], 10) > targetRow) break;
            if (startIndex === -1 && parseInt(sheetRow[0], 10) === targetRow) {
              startIndex = i;
            }
            if (startIndex > -1) html += sheetRow[1] + '<br>';
          }
          setLyricsHtml(html);
          setLoading(false);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBhajan, gidMap]);

  const title = splitBhajan(selectedBhajan.bhajanTitle || '');
  const deity = deityLabel(selectedBhajan.column || '');

  return (
    <div className="app-shell">
      <Navbar
        categories={props.categories}
        setSelectedCategory={props.setSelectedCategory}
        searchList={props.searchList}
        setSelectedBhajan={props.setSelectedBhajan}
        activeCategory={selectedBhajan.column}
      />

      <main className="stage">
        <div className="stage__inner">
          <article className="pothi">
            <button
              className="pothi__back"
              onClick={() => navigate('/bhajan-pedia')}
            >
              ← अनुक्रमणिका · Back to index
            </button>

            {hasSelection ? (
              <>
                <div className="pothi__eyebrow">
                  {deity.deva}
                  {deity.epithet ? ` · ${deity.epithet}` : ''}
                </div>
                <h2 className="pothi__title">{title.deva}</h2>
                {title.roman ? (
                  <div className="pothi__roman">{title.roman}</div>
                ) : null}
                <div className="pothi__rule">
                  <Diya className="pothi__lamp" />
                </div>
                {loading ? (
                  <div className="pothi__loading">भजन ला रहे हैं…</div>
                ) : (
                  <div className="pothi__lyrics">{parse(lyricsHtml)}</div>
                )}
              </>
            ) : (
              <div className="pothi__loading">
                कोई भजन चुनें — Choose a bhajan from the index.
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
};

export default Bhajan;
