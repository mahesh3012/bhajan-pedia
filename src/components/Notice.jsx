import React from 'react';
import { Link } from 'react-router-dom';

// A themed message block for loading / empty / not-found states inside the stage.
export const Notice = ({ deva, note, to, cta }) => (
  <div className="state">
    <div className="state__deva">{deva}</div>
    {note ? <div className="state__note">{note}</div> : null}
    {to && cta ? (
      <Link className="state__link" to={to}>
        {cta}
      </Link>
    ) : null}
  </div>
);
