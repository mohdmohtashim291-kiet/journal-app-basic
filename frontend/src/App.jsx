import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8080/api/journals';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadEntries() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Entries load nahi hui.');
      setEntries(await response.json());
    } catch {
      setError('Backend se connect nahi ho pa raha. Check karo Spring Boot aur MongoDB running hain.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  function resetForm() {
    setTitle('');
    setContent('');
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    const payload = { title: title.trim(), content: content.trim() };
    if (!payload.title || !payload.content) {
      setError('Title aur content dono bharna zaroori hai.');
      return;
    }

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error('Save nahi ho paya.');
      resetForm();
      setMessage(editingId ? 'Entry update ho gayi!' : 'New entry save ho gayi!');
      await loadEntries();
    } catch {
      setError('Entry save nahi hui. Backend status check karo.');
    }
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setTitle(entry.title ?? '');
    setContent(entry.content ?? '');
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteEntry(id) {
    if (!window.confirm('Kya tum sach mein ye entry delete karna chahte ho?')) return;
    setMessage('');
    setError('');
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      if (editingId === id) resetForm();
      setMessage('Entry delete ho gayi.');
      await loadEntries();
    } catch {
      setError('Entry delete nahi hui.');
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="eyebrow"><span className="dot" /> YOUR PERSONAL SPACE</div>
        <h1>My Journal<span>.</span></h1>
        <p>Apne thoughts, ideas aur daily moments ko ek jagah likho.</p>
      </header>

      <section className="editor panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{editingId ? 'UPDATE ENTRY' : 'NEW ENTRY'}</p>
            <h2>{editingId ? 'Entry edit karo' : 'Aaj kya hua?'}</h2>
          </div>
          <span className="note-icon">✎</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Aaj ka title..."
            maxLength={120}
          />

          <label htmlFor="content">Your thoughts</label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Yahan apni journal entry likho..."
            rows={5}
          />

          {message && <p className="notice success">{message}</p>}
          {error && <p className="notice error">{error}</p>}

          <div className="form-actions">
            {editingId && <button className="button secondary" type="button" onClick={resetForm}>Cancel</button>}
            <button className="button primary" type="submit">
              {editingId ? 'Save changes' : '＋ Save entry'}
            </button>
          </div>
        </form>
      </section>

      <section className="entries-section">
        <div className="section-heading list-heading">
          <div>
            <p className="eyebrow">YOUR COLLECTION</p>
            <h2>Past entries <span className="count">{entries.length}</span></h2>
          </div>
          <button className="refresh" type="button" onClick={loadEntries} aria-label="Refresh entries">↻</button>
        </div>

        {loading ? (
          <div className="empty panel">Entries load ho rahi hain...</div>
        ) : entries.length === 0 ? (
          <div className="empty panel">
            <div className="empty-symbol">✧</div>
            <h3>Abhi koi entry nahi hai</h3>
            <p>Upar apni first journal entry likho.</p>
          </div>
        ) : (
          <div className="entry-grid">
            {entries.map((entry) => (
              <article className="entry-card panel" key={entry.id}>
                <div className="entry-top">
                  <span className="entry-mark">✦</span>
                  <span className="entry-id">ID · {entry.id.slice(-6)}</span>
                </div>
                <h3>{entry.title}</h3>
                <p className="entry-content">{entry.content}</p>
                <div className="entry-actions">
                  <button className="text-button" onClick={() => startEdit(entry)} type="button">Edit</button>
                  <button className="text-button danger" onClick={() => deleteEntry(entry.id)} type="button">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>MADE FOR YOUR EVERYDAY THOUGHTS <span>✳</span></footer>
    </main>
  );
}
