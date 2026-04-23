import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import installationService from "../../services/installationService"
import ticketService from "../../services/ticketService"
import Loading from "../../components/Loading"
import { toast } from "react-toastify"
import {
  FaTools,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa"
import "./Dashboard.css"

const TechnicianDashboard = () => {
  const { user } = useAuth()
  const [installations, setInstallations] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [installationsData, ticketsData] = await Promise.all([
        installationService.getAll(),
        ticketService.getAll(),
      ])

      // Filter for assigned jobs (backend should do this, but double-check)
      const myInstallations =
        installationsData.data?.filter(
          (i) =>
            i.assignedTechnician?._id === user.id ||
            i.assignedTechnician === user.id,
        ) || []

      const myTickets =
        ticketsData.data?.filter(
          (t) => t.assignedTo?._id === user.id || t.assignedTo === user.id,
        ) || []

      setInstallations(myInstallations)
      setTickets(myTickets)
    } catch (error) {
      toast.error("Failed to load assigned jobs")
    } finally {
      setLoading(false)
    }
  }

  const updateJobStatus = async (installationId, newStatus) => {
    try {
      await installationService.update(installationId, { status: newStatus })
      toast.success("Job status updated!")
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status")
    }
  }

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await ticketService.update(ticketId, { status: newStatus })
      toast.success("Ticket status updated!")
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update ticket")
    }
  }

  if (loading) return <Loading message="Loading your assignments..." />

  const stats = {
    totalJobs: installations.length,
    scheduled: installations.filter((i) => i.status === "scheduled").length,
    inProgress: installations.filter((i) => i.status === "in_progress").length,
    completed: installations.filter((i) => i.status === "completed").length,
    assignedTickets: tickets.length,
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Technician Dashboard</h1>
          <p>Welcome, {user.name} - Your assigned jobs and tickets</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaTools />
          </div>
          <div className="stat-content">
            <h3>{stats.totalJobs}</h3>
            <p>Total Assigned Jobs</p>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{stats.scheduled}</h3>
            <p>Scheduled</p>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">
            <FaTools />
          </div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h3>{stats.assignedTickets}</h3>
            <p>Assigned Tickets</p>
          </div>
        </div>
      </div>

      {/* Assigned Installations */}
      <div className="section">
        <h2>My Installation Jobs</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>System Size</th>
                <th>Panels</th>
                <th>Status</th>
                <th>Scheduled Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {installations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No jobs assigned yet
                  </td>
                </tr>
              ) : (
                installations.map((installation) => (
                  <tr key={installation._id}>
                    <td>{installation.customer?.name || "N/A"}</td>
                    <td>
                      {installation.address.street}, {installation.address.city}
                    </td>
                    <td>{installation.systemSize} kW</td>
                    <td>{installation.numberOfPanels}</td>
                    <td>
                      <span className={`badge badge-${installation.status}`}>
                        {installation.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      {installation.scheduledDate
                        ? new Date(
                            installation.scheduledDate,
                          ).toLocaleDateString()
                        : "Not scheduled"}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {installation.status === "scheduled" && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              updateJobStatus(installation._id, "in_progress")
                            }
                          >
                            Start Job
                          </button>
                        )}
                        {installation.status === "in_progress" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              updateJobStatus(installation._id, "completed")
                            }
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assigned Tickets */}
      <div className="section">
        <h2>My Assigned Tickets</h2>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No tickets assigned
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>{ticket.ticketNumber}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.createdBy?.name || "N/A"}</td>
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
                    <td>
                      <div className="action-buttons">
                        {ticket.status === "assigned" && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              updateTicketStatus(ticket._id, "in_progress")
                            }
                          >
                            Start Work
                          </button>
                        )}
                        {ticket.status === "in_progress" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              updateTicketStatus(ticket._id, "resolved")
                            }
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
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

export default TechnicianDashboard
