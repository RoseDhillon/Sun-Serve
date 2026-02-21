import express from "express";
import {
  renderHome,
  renderClientsList,
  renderClientDetails,
  apiGetClients,
  apiGetClientById,
  renderCreateClientForm,
  handleCreateClient,
  renderEditClientForm,
  handleUpdateClient,
  renderDeleteClientConfirm,
  handleDeleteClient
} from "../controllers/clientController.js";

const router = express.Router();

// SSR routes
router.get("/", renderHome);
router.get("/clients", renderClientsList);
// Create (must come before /clients/:id to avoid route conflict)
router.get("/clients/create", renderCreateClientForm);
router.post("/clients", handleCreateClient);
// Read single client
router.get("/clients/:id", renderClientDetails);
// Edit
router.get("/clients/:id/edit", renderEditClientForm);
router.post("/clients/:id", handleUpdateClient);
// Delete
router.get("/clients/:id/delete", renderDeleteClientConfirm);
router.post("/clients/:id/delete", handleDeleteClient);

// API routes (AngularJS-ready)
router.get("/api/clients", apiGetClients);
router.get("/api/clients/:id", apiGetClientById);

export default router;
