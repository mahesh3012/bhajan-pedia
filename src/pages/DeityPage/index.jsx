import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Diya } from '../../components/Diya';
import { Notice } from '../../components/Notice';
import { useCatalog } from '../../context/CatalogProvider';
import { bhajanRefFor } from '../../utils/catalog';
import '../../App.css';

// The bhajan index for one deity, at /:deitySlug.
const DeityPage = () => {
  const { deitySlug } = useParams();
  const { loading, deityBySlug } = useCatalog();
  const deity = deityBySlug[deitySlug];

  return (
    <div className="app-shell">
      <Navbar />
      <main className="stage">
        <div className="stage__inner">
          {loading ? (
            <Notice deva="पृष्ठ खुल रहे हैं…" note="Opening the songbook." />
          ) : !deity ? (
            <Notice
              deva="यह देवता पोथी में नहीं मिले"
              note="No deity by that name — choose one from the left."
              to="/"
              cta="अनुक्रमणिका पर लौटें · Back to the index"
            />
          ) : (
            <>
              <header className="deity-head">
                <h2 className="deity-head__name">{deity.deva}</h2>
                {deity.epithet ? (
                  <div className="deity-head__epithet">{deity.epithet}</div>
                ) : null}
                {deity.roman ? (
                  <div className="deity-head__roman">{deity.roman}</div>
                ) : null}
                <div className="deity-head__rule">
                  <Diya className="deity-head__lamp" />
                </div>
              </header>

              {deity.bhajans.length === 0 ? (
                <Notice
                  deva="इस देवता के भजन शीघ्र ही।"
                  note="No bhajans here yet — pick another deity from the left."
                />
              ) : (
                <div className="index">
                  {deity.bhajans.map((b) => (
                    <Link
                      key={b.n}
                      className="index__item"
                      to={`/${deity.slug}/${bhajanRefFor(b)}`}
                    >
                      <span className="index__ord">{b.n}</span>
                      <span className="index__text">
                        <span className="index__deva">{b.deva}</span>
                        {b.roman ? (
                          <span className="index__roman">{b.roman}</span>
                        ) : null}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeityPage;
