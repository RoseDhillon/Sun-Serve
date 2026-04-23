import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import installationService from "../../services/installationService"
import ticketService from "../../services/ticketService"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import { FaSolarPanel, FaTools, FaTicketAlt, FaPlus } from "react-icons/fa"
import "./Dashboard.css"

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [installations, setInstallations] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewInstallation, setShowNewInstallation] = useState(false)
  const [newInstallation, setNewInstallation] = useState({
    systemSize: "",
    panelType: "monocrystalline",
    numberOfPanels: "",
    estimatedCost: "",
    notes: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [installationsData, ticketsData] = await Promise.all([
        installationService.getAll(),
        ticketService.getAll(),
      ])
      setInstallations(installationsData.data || [])
      setTickets(ticketsData.data || [])
    } catch (error) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInstallation = async (e) => {
    e.preventDefault()

    try {
      await installationService.create({
        ...newInstallation,
        systemSize: parseFloat(newInstallation.systemSize),
        numberOfPanels: parseInt(newInstallation.numberOfPanels),
        estimatedCost: parseFloat(newInstallation.estimatedCost),
        address: user.address, // Use user's address
      })

      toast.success("Installation request created successfully!")
      setShowNewInstallation(false)
      setNewInstallation({
        systemSize: "",
        panelType: "monocrystalline",
        numberOfPanels: "",
        estimatedCost: "",
        notes: "",
      })
      loadData()
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to create installation request",
      )
    }
  }

  if (loading) return <Loading message="Loading your dashboard..." />

  const stats = {
    total: installations.length,
    pending: installations.filter((i) => i.status === "requested").length,
    active: installations.filter((i) =>
      ["approved", "scheduled", "in_progress"].includes(i.status),
    ).length,
    completed: installations.filter((i) => i.status === "completed").length,
    openTickets: tickets.filter((t) => t.status !== "closed").length,
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user.name}!</h1>
          <p>Customer Dashboard - Manage your solar installations</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowNewInstallation(true)}
        >
          <FaPlus /> Request Installation
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaSolarPanel />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Installations</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <FaTools />
          </div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">
            <FaSolarPanel />
          </div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Active Projects</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">
            <FaSolarPanel />
          </div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-icon">
            <FaTicketAlt />
          </div>
          <div className="stat-content">
            <h3>{stats.openTickets}</h3>
            <p>Open Tickets</p>
          </div>
        </div>
      </div>

      {/* New Installation Form Modal */}
      {showNewInstallation && (
        <div
          className="modal-overlay"
          onClick={() => setShowNewInstallation(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Request New Installation</h2>
            <form onSubmit={handleCreateInstallation}>
              <div className="form-group">
                <label>System Size (kW)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newInstallation.systemSize}
                  onChange={(e) =>
                    setNewInstallation({
                      ...newInstallation,
                      systemSize: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Panel Type</label>
                <select
                  value={newInstallation.panelType}
                  onChange={(e) =>
                    setNewInstallation({
                      ...newInstallation,
                      panelType: e.target.value,
                    })
                  }
                >
                  <option value="monocrystalline">Monocrystalline</option>
                  <option value="polycrystalline">Polycrystalline</option>
                  <option value="thin-film">Thin Film</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Panels</label>
                <input
                  type="number"
                  value={newInstallation.numberOfPanels}
                  onChange={(e) =>
                    setNewInstallation({
                      ...newInstallation,
                      numberOfPanels: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Estimated Budget ($)</label>
                <input
                  type="number"
                  value={newInstallation.estimatedCost}
                  onChange={(e) =>
                    setNewInstallation({
                      ...newInstallation,
                      estimatedCost: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  value={newInstallation.notes}
                  onChange={(e) =>
                    setNewInstallation({
                      ...newInstallation,
                      notes: e.target.value,
                    })
                  }
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewInstallation(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Installations Table */}
      <div className="section">
        <h2>My Installations</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>System Size</th>
                <th>Panels</th>
                <th>Panel Type</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {installations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No installations yet. Click "Request Installation" to get
                    started!
                  </td>
                </tr>
              ) : (
                installations.map((installation) => (
                  <tr key={installation._id}>
                    <td>
                      {installation.address.street}, {installation.address.city}
                    </td>
                    <td>{installation.systemSize} kW</td>
                    <td>{installation.numberOfPanels}</td>
                    <td className="capitalize">{installation.panelType}</td>
                    <td>
                      <span className={`badge badge-${installation.status}`}>
                        {installation.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>${installation.estimatedCost.toLocaleString()}</td>
                    <td>
                      {new Date(installation.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Tickets */}
      <div className="section">
        <h2>My Service Tickets</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No service tickets
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.ticketNumber}</td>
                    <td>{ticket.title}</td>
                    <td className="capitalize">{ticket.category}</td>
                    <td>
                      <span
                        className={`badge badge-priority-${ticket.priority}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${ticket.status}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
