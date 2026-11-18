import './App.css';

export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-kicker">Loan commission</p>
        <h1>Quote workspace</h1>
        <p className="app-intro">
          Prepare loan details and request a commission quote.
        </p>
      </header>
      <section className="workspace" aria-labelledby="workspace-title">
        <h2 id="workspace-title">New quote</h2>
        <p>Loan details will be collected here.</p>
      </section>
    </main>
  );
}
