import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePapaParse } from 'react-papaparse';
import parse from 'html-react-parser';
import Navbar from '../../components/Navbar';
import { Diya } from '../../components/Diya';
import { Notice } from '../../components/Notice';
import { useCatalog } from '../../context/CatalogProvider';
import { parseBhajanRef } from '../../utils/catalog';
import '../../App.css';

const SHEET = (gid) =>
  `https://docs.google.com/spreadsheets/d/e/2PACX-1vQjG4UmtnJUa-vTTTVcTzrbHOu9SUkkBaxt2ybzWUbA_aOt07h7KR0S2XKL4iywa5NlyexEQ7C1GECN/pub?gid=${gid}&single=true&output=csv`;

// One bhajan's lyrics, at /:deitySlug/:bhajanRef. The leading number of
// bhajanRef is the key; everything after it is cosmetic.
const BhajanPage = () => {
  const { deitySlug, bhajanRef } = useParams();
  const navigate = useNavigate();
  const { readRemoteFile } = usePapaParse();
  const { loading, deityBySlug } = useCatalog();

  const deity = deityBySlug[deitySlug];
  const n = parseBhajanRef(bhajanRef);
  const bhajan = deity && n != null ? deity.bhajans.find((b) => b.n === n) : null;

  const [lyrics, setLyrics] = useState({ loading: true, html: '' });

  useEffect(() => {
    if (!deity || !bhajan || !deity.gid) return;
    setLyrics({ loading: true, html: '' });
    let cancelled = false;
    readRemoteFile(SHEET(deity.gid), {
      complete: (res) => {
        if (cancelled) return;
        const data = res.data;
        let html = '';
        let started = false;
        for (let i = 0; i < data.length; i++) {
          const rowNo = parseInt(data[i][0], 10);
          if (rowNo > n) break;
          if (rowNo === n) started = true;
          if (started) html += data[i][1] + '<br>';
        }
        setLyrics({ loading: false, html });
      },
    });
    return () => {
      cancelled = true;
    };
  }, [deity, bhajan, n, readRemoteFile]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="stage">
        <div className="stage__inner">
          {loading ? (
            <article className="pothi">
              <div className="pothi__loading">भजन ला रहे हैं…</div>
            </article>
          ) : !deity ? (
            <Notice
              deva="यह देवता पोथी में नहीं मिले"
              note="No deity by that name."
              to="/"
              cta="अनुक्रमणिका पर लौटें · Back to the index"
            />
          ) : !bhajan ? (
            <Notice
              deva="यह भजन नहीं मिला"
              note="That bhajan isn’t in this deity’s list."
              to={`/${deity.slug}`}
              cta={`${deity.deva} की सूची पर लौटें · Back to the list`}
            />
          ) : (
            <article className="pothi">
              <button
                className="pothi__back"
                onClick={() => navigate(`/${deity.slug}`)}
              >
                ← अनुक्रमणिका · Back to index
              </button>
              <div className="pothi__eyebrow">
                {deity.deva}
                {deity.epithet ? ` · ${deity.epithet}` : ''}
              </div>
              <h2 className="pothi__title">{bhajan.deva}</h2>
              {bhajan.roman ? (
                <div className="pothi__roman">{bhajan.roman}</div>
              ) : null}
              <div className="pothi__rule">
                <Diya className="pothi__lamp" />
              </div>
              {lyrics.loading ? (
                <div className="pothi__loading">भजन ला रहे हैं…</div>
              ) : (
                <div className="pothi__lyrics">{parse(lyrics.html)}</div>
              )}
            </article>
          )}
        </div>
      </main>
    </div>
  );
};

export default BhajanPage;
