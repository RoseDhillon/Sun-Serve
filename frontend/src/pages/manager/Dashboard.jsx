import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import installationService from '../../services/installationService';
import equipmentService from '../../services/equipmentService';
import userService from '../../services/userService';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { FaClipboardCheck, FaUsers, FaBoxes, FaChartLine } from 'react-icons/fa';
import './Dashboard.css';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [installations, setInstallations] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [installationsData, equipmentData, techData] = await Promise.all([
        installationService.getAll(),
        equipmentService.getAll(),
        userService.getByRole('technician')
      ]);
      
      setInstallations(installationsData.data || []);
      setEquipment(equipmentData.data || []);
      setTechnicians(techData.data || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const approveInstallation = async (installationId) => {
    try {
      await installationService.update(installationId, {
        status: 'approved',
        approvedBy: user.id
      });
      toast.success('Installation approved!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve installation');
    }
  };

  const assignTechnician = async (installationId, technicianId) => {
    try {
      await installationService.update(installationId, {
        assignedTechnician: technicianId,
        status: 'scheduled'
      });
      toast.success('Technician assigned!');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to assign technician');
    }
  };

  if (loading) return <Loading message="Loading manager dashboard..." />;

  const stats = {
    totalInstallations: installations.length,
    pendingApproval: installations.filter(i => i.status === 'requested').length,
    active: installations.filter(i => ['approved', 'scheduled', 'in_progress'].includes(i.status)).length,
    completed: installations.filter(i => i.status === 'completed').length,
    lowStockItems: equipment.filter(e => e.quantity <= e.minimumStock).length,
    totalTechnicians: technicians.length
  };

  const pendingInstallations = installations.filter(i => i.status === 'requested');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Manager Dashboard</h1>
          <p>Welcome, {user.name} - Manage operations and approve requests</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-content">
            <h3>{stats.totalInstallations}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon"><FaClipboardCheck /></div>
          <div className="stat-content">
            <h3>{stats.pendingApproval}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Active Projects</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon"><FaClipboardCheck /></div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-icon"><FaBoxes /></div>
          <div className="stat-content">
            <h3>{stats.lowStockItems}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-content">
            <h3>{stats.totalTechnicians}</h3>
            <p>Technicians</p>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="section">
        <h2>Pending Installation Approvals ({stats.pendingApproval})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>System Size</th>
                <th>Panels</th>
                <th>Estimated Cost</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingInstallations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No pending approvals</td>
                </tr>
              ) : (
                pendingInstallations.map((installation) => (
                  <tr key={installation._id}>
                    <td>{installation.customer?.name || 'N/A'}</td>
                    <td>{installation.address.street}, {installation.address.city}</td>
                    <td>{installation.systemSize} kW</td>
                    <td>{installation.numberOfPanels}</td>
                    <td>${installation.estimatedCost.toLocaleString()}</td>
                    <td>{new Date(installation.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => approveInstallation(installation._id)}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approved - Assign Technicians */}
      <div className="section">
        <h2>Approved - Assign Technicians</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>System Size</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {installations.filter(i => i.status === 'approved').length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No approved installations waiting for assignment</td>
                </tr>
              ) : (
                installations.filter(i => i.status === 'approved').map((installation) => (
                  <tr key={installation._id}>
                    <td>{installation.customer?.name || 'N/A'}</td>
                    <td>{installation.address.city}</td>
                    <td>{installation.systemSize} kW</td>
                    <td>
                      <span className="badge badge-approved">Approved</span>
                    </td>
                    <td>
                      {installation.assignedTechnician?.name || 'Not assigned'}
                    </td>
                    <td>
                      <select
                        className="select-technician"
                        onChange={(e) => assignTechnician(installation._id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Technician</option>
                        {technicians.map(tech => (
                          <option key={tech._id} value={tech._id}>
                            {tech.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Inventory */}
      <div className="section">
        <h2>Equipment Inventory</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Quantity</th>
                <th>Min Stock</th>
                <th>Unit Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {equipment.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No equipment in inventory</td>
                </tr>
              ) : (
                equipment.map((item) => (
                  <tr key={item._id} className={item.quantity <= item.minimumStock ? 'low-stock-row' : ''}>
                    <td>{item.name}</td>
                    <td className="capitalize">{item.category.replace('_', ' ')}</td>
                    <td>{item.manufacturer}</td>
                    <td>{item.quantity}</td>
                    <td>{item.minimumStock}</td>
                    <td>${item.unitPrice}</td>
                    <td>
                      {item.quantity <= item.minimumStock ? (
                        <span className="badge badge-danger">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;