import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  return (
    <div style={dashboardStyle}>
      <Sidebar />
      <div style={contentStyle}>
        <h1>Bienvenido al Dashboard</h1>
        <p>Contenido del dashboard...</p>
      </div>
    </div>
  );
};

const dashboardStyle = {
  display: 'flex',
};

const contentStyle = {
  marginLeft: '250px',
  padding: '20px',
  width: '100%',
};

export default Dashboard;
