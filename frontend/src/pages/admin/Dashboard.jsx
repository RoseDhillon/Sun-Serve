import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import installationService from '../../services/installationService';
import equipmentService from '../../services/equipmentService';
import ticketService from '../../services/ticketService';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { FaUsers, FaSolarPanel, FaBoxes, FaTicketAlt, FaChartBar, FaDollarSign } from 'react-icons/fa';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, installationsData, equipmentData, ticketsData] = await Promise.all([
        userService.getAll(),
        installationService.getAll(),
        equipmentService.getAll(),
        ticketService.getAll()
      ]);
      
      setUsers(usersData.data || []);
      setInstallations(installationsData.data || []);
      setEquipment(equipmentData.data || []);
      setTickets(ticketsData.data || []);
    } catch (error) {
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userService.delete(userId);
      toast.success('User deleted successfully');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) return <Loading message="Loading admin dashboard..." />;

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    technicians: users.filter(u => u.role === 'technician').length,
    managers: users.filter(u => u.role === 'manager').length,
    totalInstallations: installations.length,
    activeProjects: installations.filter(i => ['approved', 'scheduled', 'in_progress'].includes(i.status)).length,
    completedProjects: installations.filter(i => i.status === 'completed').length,
    totalRevenue: installations.filter(i => i.status === 'completed').reduce((sum, i) => sum + i.estimatedCost, 0),
    openTickets: tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length,
    equipmentItems: equipment.length,
    lowStockItems: equipment.filter(e => e.quantity <= e.minimumStock).length
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.name} - Complete system overview</p>
        </div>
      </div>

      {/* Statistics Cards - Row 1 */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon"><FaSolarPanel /></div>
          <div className="stat-content">
            <h3>{stats.totalInstallations}</h3>
            <p>Total Installations</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon"><FaChartBar /></div>
          <div className="stat-content">
            <h3>{stats.activeProjects}</h3>
            <p>Active Projects</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon"><FaSolarPanel /></div>
          <div className="stat-content">
            <h3>{stats.completedProjects}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-content">
            <h3>${(stats.totalRevenue / 1000).toFixed(0)}K</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-icon"><FaTicketAlt /></div>
          <div className="stat-content">
            <h3>{stats.openTickets}</h3>
            <p>Open Tickets</p>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="stats-row">
        <div className="mini-stat">
          <strong>{stats.customers}</strong> Customers
        </div>
        <div className="mini-stat">
          <strong>{stats.technicians}</strong> Technicians
        </div>
        <div className="mini-stat">
          <strong>{stats.managers}</strong> Managers
        </div>
        <div className="mini-stat">
          <strong>{stats.equipmentItems}</strong> Equipment Items
        </div>
        <div className="mini-stat">
          <strong>{stats.lowStockItems}</strong> Low Stock Alerts
        </div>
      </div>

      {/* User Management */}
      <div className="section">
        <h2>User Management</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge badge-role-${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.phone}</td>
                  <td>{u.address?.city}, {u.address?.state}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u._id !== user.id && (
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteUser(u._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Installations */}
      <div className="section">
        <h2>Recent Installations</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>System Size</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Cost</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {installations.slice(0, 10).map((installation) => (
                <tr key={installation._id}>
                  <td>{installation.customer?.name || 'N/A'}</td>
                  <td>{installation.address.street}, {installation.address.city}</td>
                  <td>{installation.systemSize} kW</td>
                  <td>
                    <span className={`badge badge-${installation.status}`}>
                      {installation.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{installation.assignedTechnician?.name || 'Unassigned'}</td>
                  <td>${installation.estimatedCost.toLocaleString()}</td>
                  <td>{new Date(installation.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Overview */}
      <div className="section">
        <h2>Equipment Inventory Overview</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>In Stock</th>
                <th>Min Stock</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item._id} className={item.quantity <= item.minimumStock ? 'low-stock-row' : ''}>
                  <td>{item.name}</td>
                  <td className="capitalize">{item.category.replace('_', ' ')}</td>
                  <td>{item.manufacturer}</td>
                  <td>{item.quantity}</td>
                  <td>{item.minimumStock}</td>
                  <td>${item.unitPrice}</td>
                  <td>${(item.quantity * item.unitPrice).toLocaleString()}</td>
                  <td>
                    {item.quantity <= item.minimumStock ? (
                      <span className="badge badge-danger">⚠️ Low Stock</span>
                    ) : item.quantity <= item.minimumStock * 2 ? (
                      <span className="badge badge-warning">Low</span>
                    ) : (
                      <span className="badge badge-success">Good</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Tickets */}
      <div className="section">
        <h2>Recent Service Tickets</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Title</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0, 10).map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.ticketNumber}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.createdBy?.name || 'N/A'}</td>
                  <td className="capitalize">{ticket.category}</td>
                  <td>
                    <span className={`badge badge-priority-${ticket.priority}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${ticket.status}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.assignedTo?.name || 'Unassigned'}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;