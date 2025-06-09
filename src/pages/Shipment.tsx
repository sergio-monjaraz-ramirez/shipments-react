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
  Autocomplete,
} from "@mui/material";
import type { Shipment } from "../types/Shipment";
import type { Package } from "../types/Package";
import packageService from "../services/packageService";
import shipmentService from "../services/shipmentService";

// Helper to render shipment type with color

const ShipmentTable: React.FC = () => {
  const [shipments, setShipments] = React.useState<Shipment[]>([]);
  const [packages, setPackages] = React.useState<Package[]>([]); // Assuming packages is an array of package IDs or objects
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Shipment>({
    destination: "",
    createdAt: "",
    status: "pending",
    packages: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [packagesResponse, shipmentsResponse] = await Promise.all([
          packageService.getPackagesWithoutShipment(),
          shipmentService.getShipments(),
        ]);

        setShipments(shipmentsResponse);
        setPackages(packagesResponse);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Consider adding a user-facing error message here
      }
    }

    fetchData();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    try {
      const newShipment: Shipment = {
        ...form,
        createdAt: new Date().toISOString(),
      };
      shipmentService.createShipment(newShipment).then((response) => {
        setShipments([...shipments, response]);
      });
      // Optionally, you can reset the form or show a success message
      console.log("Shipment created successfully:", newShipment);
      
    } catch (error) {
      console.error("Error creating shipment:", error);
      // Consider adding a user-facing error message here
      
    }
    setOpen(false);
    // Reset form
    setForm({
      destination: "",
      createdAt: "",
      status: "pending",
      packages: [],
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shipment Page</h1>
      <div className="flex gap-5 justify-end">
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "1rem", marginBottom: "2rem", display: "block" }}
          onClick={() => setOpen(true)}
        >
          Create New Shipment
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Packages ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{shipment.createdAt}</TableCell>
                <TableCell>{shipment.status}</TableCell>
                <TableCell>
                  {shipment.packages.map((pkg) => pkg.id).join(", ")}
                </TableCell>
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
              autoFocus
              margin="dense"
              id="Destination"
              label="Destination"
              type="text"
              fullWidth
              value={form.destination}
              onChange={(e) =>
                setForm({ ...form, destination: e.target.value })
              }
              required
            />

             <Autocomplete
              multiple
              id="tags-outlined"
              options={packages}
              getOptionLabel={(pkg: Package) => `${pkg.client.name} - ${pkg.description}`}
              value={form.packages}
              onChange={(event, newValue) => {
                console.log("Selected packages:", newValue);
                setForm({ ...form, packages: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Packages"
                />
              )}
            />

            

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

export default ShipmentTable;
