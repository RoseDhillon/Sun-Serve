import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module __dirname replacement (for controllers folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadClients = () => {
  const dataPath = path.join(__dirname, "..", "data", "clients.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

const findClientById = (clients, id) =>
  clients.find(c => String(c.id) === String(id));

// SSR: Home
export const renderHome = (req, res) => {
  res.render("pages/home", {
    pageTitle: "Home",
    message:
      "This portal demonstrates dynamic server-side rendering using EJS layouts and partials. JSON APIs are available for an AngularJS frontend that will be added later.",
    now: new Date().toLocaleString()
  });
};

// SSR: Clients list
export const renderClientsList = (req, res) => {
  const clients = loadClients();

  res.render("pages/clients", {
    pageTitle: "Clients",
    clients,
    totalClients: clients.length,
    now: new Date().toLocaleString()
  });
};

// SSR: Client details
export const renderClientDetails = (req, res) => {
  const clients = loadClients();
  const client = findClientById(clients, req.params.id);
  if (!client) {
    return res.status(404).render("pages/home", {
      pageTitle: "Client Not Found",
      message: `No client record found for id: ${req.params.id}`,
      now: new Date().toLocaleString()
    });
  }
  
  res.render("pages/clientDetails", {
    pageTitle: "Client Profile",
    client,
    now: new Date().toLocaleString()
  });
};

// API: all clients
export const apiGetClients = (req, res) => {
  const clients = loadClients();
  res.json({ total: clients.length, clients });
};

// API: client by id
export const apiGetClientById = (req, res) => {
  const clients = loadClients();
  const client = findClientById(clients, req.params.id);

  if (!client) {
    return res.status(404).json({ error: "Client Not Found", id: req.params.id });
  }

  res.json({ client });
};

// Helpers: save clients
const saveClients = (clients) => {
  const dataPath = path.join(__dirname, "..", "data", "clients.json");
  fs.writeFileSync(dataPath, JSON.stringify(clients, null, 2), "utf-8");
};

// SSR: render create form
export const renderCreateClientForm = (req, res) => {
  res.render("pages/createClient", {
    pageTitle: "Create Client",
    now: new Date().toLocaleString()
  });
};

// Handle create (form POST)
export const handleCreateClient = (req, res) => {
  const clients = loadClients();
  const { fullName, email, riskCategory } = req.body;

  const maxId = clients.reduce((max, c) => Math.max(max, Number(c.id)), 0);
  const newId = maxId + 1 || 100;
  const newClient = {
    id: newId,
    fullName: fullName || "",
    email: email || "",
    riskCategory: riskCategory || "Low",
    createdDate: new Date().toISOString().split("T")[0]
  };

  clients.push(newClient);
  saveClients(clients);

  res.redirect(`/clients/${newId}`);
};

// SSR: render edit form
export const renderEditClientForm = (req, res) => {
  const clients = loadClients();
  const client = findClientById(clients, req.params.id);
  if (!client) {
    return res.status(404).render("pages/home", {
      pageTitle: "Client Not Found",
      message: `No client record found for id: ${req.params.id}`,
      now: new Date().toLocaleString()
    });
  }

  res.render("pages/editClient", {
    pageTitle: "Edit Client",
    client,
    now: new Date().toLocaleString()
  });
};

// Handle update (form POST)
export const handleUpdateClient = (req, res) => {
  const clients = loadClients();
  const client = findClientById(clients, req.params.id);
  if (!client) {
    return res.status(404).render("pages/home", {
      pageTitle: "Client Not Found",
      message: `No client record found for id: ${req.params.id}`,
      now: new Date().toLocaleString()
    });
  }

  const { fullName, email, riskCategory } = req.body;
  client.fullName = fullName || client.fullName;
  client.email = email || client.email;
  client.riskCategory = riskCategory || client.riskCategory;

  saveClients(clients);

  res.redirect(`/clients/${client.id}`);
};

// SSR: render delete confirmation
export const renderDeleteClientConfirm = (req, res) => {
  const clients = loadClients();
  const client = findClientById(clients, req.params.id);
  if (!client) {
    return res.status(404).render("pages/home", {
      pageTitle: "Client Not Found",
      message: `No client record found for id: ${req.params.id}`,
      now: new Date().toLocaleString()
    });
  }

  res.render("pages/deleteClient", {
    pageTitle: "Delete Client",
    client,
    now: new Date().toLocaleString()
  });
};

// Handle delete (form POST)
export const handleDeleteClient = (req, res) => {
  let clients = loadClients();
  const client = findClientById(clients, req.params.id);
  if (!client) {
    return res.status(404).render("pages/home", {
      pageTitle: "Client Not Found",
      message: `No client record found for id: ${req.params.id}`,
      now: new Date().toLocaleString()
    });
  }

  clients = clients.filter(c => String(c.id) !== String(req.params.id));
  saveClients(clients);

  res.redirect(`/clients`);
};
