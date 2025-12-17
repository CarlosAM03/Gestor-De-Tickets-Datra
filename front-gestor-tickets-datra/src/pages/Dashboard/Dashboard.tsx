import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h5>Tickets abiertos</h5>
          <p>—</p>
        </div>

        <div className="dashboard-card">
          <h5>Tickets cerrados</h5>
          <p>—</p>
        </div>

        <div className="dashboard-card">
          <h5>Última actividad</h5>
          <p>—</p>
        </div>
      </div>
    </div>
  );
}
