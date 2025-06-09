import React, { useEffect } from "react";
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
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import type { Package } from "../types/Package";
import packageService from "../services/packageService";
import clientService from "../services/clientService";
import type { Client } from "../types/Client";

const PackageComponent: React.FC = () => {
  const [packages, setPackages] = React.useState<Package[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    description: "",
    weight: 0,
    client: 0,
  });

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const selectedClient = clients.find((client) => client.id === form.client);
  
  if (!selectedClient) {
    console.error("Selected client not found");
    return;
  }

  try {
    const newPackage: Omit<Package, "id"> = {
      description: form.description,
      weight: form.weight,
      client: selectedClient
    };

    const createdPackage = await packageService.createPackage(newPackage);
    setPackages((prevPackages) => [...prevPackages, createdPackage]);
    setOpen(false);
    setForm({ description: "", weight: 0, client: 0 });
    
  } catch (error) {
    console.error("Failed to create package:", error);
    // Consider adding a user-facing error message here
  }
};

useEffect(() => {
  async function fetchData() {
    try {
      const [packagesResponse, clientsResponse] = await Promise.all([
        packageService.getPackages(),
        clientService.getClients()
      ]);

      console.log("Fetched packages:", packagesResponse);
      console.log("Fetched clients:", clientsResponse);
      
      setPackages(packagesResponse);
      setClients(clientsResponse);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Consider adding a user-facing error message here
    }
  }

  fetchData();
}, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Package Page</h1>
      <div className="flex gap-5 justify-end">
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "1rem", marginBottom: "2rem", display: "block" }}
          onClick={() => setOpen(true)}
        >
          Create New Package
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
              <TableCell>Description</TableCell>
              <TableCell>Peso</TableCell>
              <TableCell>Cliente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.id}</TableCell>
                <TableCell>{pkg.description}</TableCell>
                <TableCell>{pkg.weight}</TableCell>
                <TableCell>{pkg.client.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{ "& .MuiDialog-paper": { width: "500px", maxHeight: "80%" } }}
      >
        <DialogTitle>Create New Package</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Weight"
              type="number"
              fullWidth
              value={form.weight}
              onChange={(e) =>
                setForm({ ...form, weight: parseInt(e.target.value) })
              }
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="client-select-label">Client</InputLabel>
              <Select
                labelId="client-select-label"
                value={form.client}
                label="Client"
                onChange={(e) => setForm({ ...form, client: e.target.value })}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageComponent;
