import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePapaParse } from 'react-papaparse';
import { buildCatalog } from '../utils/catalog';

const INDEX_SHEET =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQjG4UmtnJUa-vTTTVcTzrbHOu9SUkkBaxt2ybzWUbA_aOt07h7KR0S2XKL4iywa5NlyexEQ7C1GECN/pub?gid=0&single=true&output=csv';

const CatalogContext = createContext(null);

export const useCatalog = () => useContext(CatalogContext);

export const CatalogProvider = ({ children }) => {
  const { readRemoteFile } = usePapaParse();
  const [state, setState] = useState({
    loading: true,
    error: null,
    catalog: null,
  });

  useEffect(() => {
    let cancelled = false;
    readRemoteFile(INDEX_SHEET, {
      complete: (res) => {
        if (cancelled) return;
        try {
          setState({ loading: false, error: null, catalog: buildCatalog(res.data) });
        } catch (e) {
          setState({ loading: false, error: e, catalog: null });
        }
      },
      error: (err) => {
        if (!cancelled) setState({ loading: false, error: err, catalog: null });
      },
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => {
    const catalog = state.catalog;
    return {
      loading: state.loading,
      error: state.error,
      deities: catalog ? catalog.deities : [],
      deityBySlug: catalog ? catalog.deityBySlug : {},
      searchIndex: catalog ? catalog.searchIndex : [],
      getBhajan: (deitySlug, n) => {
        const deity = catalog && catalog.deityBySlug[deitySlug];
        if (!deity) return null;
        return deity.bhajans.find((b) => b.n === n) || null;
      },
    };
  }, [state]);

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};
