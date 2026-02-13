import './App.css';

import  { useEffect, useState } from 'react'


function App() {
  const [facts, setFacts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);

  const getInfo = async (page) => {
    let url = `https://catfact.ninja/facts?page=${page}&limit=5`;
    const response = await fetch(url);
    return response.json();
  };

  const getAllInfo = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const resp = await getInfo(page);
    setFacts((prev) => [...prev, ...resp.data]);
    setPage((prev) => prev + 1);
    setHasMore(!!resp.next_page_url);
    setLoading(false);
  };

  useEffect(() => {
    getAllInfo();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 &&
        hasMore &&
        !loading
      ) {
        getAllInfo();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, [hasMore, loading]);

  const handleShowMore = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="App" style={{ minHeight: '100vh', background: '#f7f7fa', fontFamily: 'sans-serif', padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 500, margin: '40px auto', borderRadius: 12, boxShadow: '0 2px 16px #0001', background: '#fff', padding: 24 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#333', letterSpacing: 1 }}>🐱 Cat Facts</h2>
        {facts.map((fact, idx) => {
          const isLong = fact.fact.length > 100;
          const showFull = expanded[idx];
          return (
            <div key={idx} style={{ marginBottom: 18, padding: 16, borderRadius: 8, background: '#f0f4fa', boxShadow: '0 1px 4px #0001', position: 'relative' }}>
              <span style={{ fontSize: 16, color: '#222' }}>
                {isLong && !showFull ? fact.fact.slice(0, 100) + '...' : fact.fact}
              </span>
              {isLong && (
                <button onClick={() => handleShowMore(idx)} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: 14, padding: 0 }}>
                  {showFull ? 'Mostrar menos' : 'Mostrar más'}
                </button>
              )}
            </div>
          );
        })}
        {loading && <div style={{ textAlign: 'center', color: '#888', margin: 16 }}>Cargando...</div>}
        {!hasMore && !loading && <div style={{ textAlign: 'center', color: '#aaa', margin: 16 }}>No hay más facts.</div>}
      </div>
    </div>
  );
}
export default App;