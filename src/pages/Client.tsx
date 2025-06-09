import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  DialogActions,
} from "@mui/material";
import type { Client } from "../types/Client";
import clientService from "../services/clientService";
import type { Summary } from "../types/Summary";
import type { TopClients } from "../types/TopClients";

const ClientComponent: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [expandedRow, setExpandedRow] = useState<number>();
  const [summary, setSummary] = useState<Summary>();
  const [open, setOpen] = useState(false);
  const [openTop, setOpenTop] = useState(false);
  const [topClients, setTopClients] = useState<TopClients[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await clientService.getClients();
        setClients(response);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    }
    fetchClients();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    try {
      const newClient: Omit<Client, "id"> = {
        name: formData.name,
        email: formData.email,
      };
      clientService
        .createClient(newClient)
        .then((createdClient) => {
          setClients((prevClients) => [...prevClients, createdClient]);
          setFormData({ name: "", email: "" }); // Reset form data
        })
        .catch((error) => {
          console.error("Failed to create client:", error);
        });
    } catch (error) {
      console.error("Failed to create client:", error);
    }

    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchClientSummary = async (id: number) => {
    try {
      const response = await clientService.getSummaryByClientId(id.toString());
      setSummary(response);
      console.log("Client Summary:", response);
    } catch (error) {
      console.error("Failed to fetch client summary:", error);
    }
  };

  const fetchTopClients = async () => {
    try {
      const response = await clientService.getTopClients();
      setTopClients(response);
      setOpenTop(true);
    } catch (error) {
      console.error("Failed to fetch top clients:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", email: "" }); // Reset form data on close
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Client Page</h1>
      <div className="flex gap-5 justify-end">
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "1rem", display: "block" }}
          onClick={() => setOpen(true)}
        >
          Add New Client
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: "1rem", display: "block" }}
          onClick={fetchTopClients}
        >
          View Top Clients
        </Button>
      </div>

      <TableContainer
        component={Paper}
        style={{ marginTop: "2rem", backgroundColor: "#f5f5f5" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <React.Fragment key={client.id}>
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        // Handle view client details
                        setExpandedRow((prevState) =>
                          prevState ? undefined : client.id
                        );
                        console.log("View client:", client.id);
                        fetchClientSummary(client.id as number);
                      }}
                    >
                      Summary
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRow === client.id && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div>
                        <h3>Client Summary</h3>
                        {summary && (
                          <div>
                            <p>Total Packages: {summary.totalPackages}</p>
                            <p>Total Weight: {summary.totalWeight} kg</p>
                            <p>
                              Total Shipments Created:{" "}
                              {summary.totalShipmentsCreated}
                            </p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "500px", maxHeight: "80vh" } }}
      >
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            onSubmit={handleSubmit}
          >
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />

            <DialogActions sx={{ p: 0, pt: 2 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
        <Dialog
        open={openTop}
        onClose={() => setOpenTop(false)}
        sx={{ "& .MuiDialog-paper": { width: "500px", maxHeight: "80vh" } }}
      >
        <DialogTitle>Top Users</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            onSubmit={handleSubmit}
          >
            <div>
              <span className="py-10">Top Clients</span>
              { topClients && topClients.map((client, index) => (
                <div className="my-5" key={index}>
                  <p>
                    Client Id: {client.clientId}
                  </p>
                  <p>
                    Total Weight: {client.totalWeight} kg
                  </p>
                  <hr />
                </div>
              ))}
            </div>
           

            <DialogActions sx={{ p: 0, pt: 2 }}>
              <Button onClick={()=> setOpenTop(false)}>Close</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientComponent;
