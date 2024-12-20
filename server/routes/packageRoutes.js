import Package from "../models/Package.js";
import express from 'express';
import adminAuthMiddleware from "./adminAuthMiddleware.js";
import combinedAuthMiddleware from "./combinedAuthMiddleware.js";


const router = express.Router();

//route to create a package
router.post('/', adminAuthMiddleware, async (req, res) => {

    const { title, destination, description, price, availableDates, maxTravelers } = req.body;

    try{
        const newPackage = new Package({ title, destination, description, price, availableDates, maxTravelers });
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//route to get all packages
router.get('/', async (req, res) => {
    try{
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching packages", error: err.message });
    }
});

//route to get a specific package
router.get('/:id', async (req, res) => {
    try{
        const pkg = await Package.findById(req.params.id);
        if(!pkg) return res.status(404).json({ message: "Package not found" });
        res.status(200).json(pkg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//update a package 
router.put('/:id', adminAuthMiddleware, async (req, res) => {
    const { title, destination, description, price, availableDates, maxTravelers } = req.body;
    try {
        const updatedPackage = await Package.findByIdAndUpdate(
            req.params.id,
            { title, destination, description, price, availableDates, maxTravelers },
            { new: true }
        );
        if(!updatedPackage) return res.status(404).json({ message: "Package not found" });
        res.status(200).json(updatedPackage);
    } catch (err) {
        res.status(500).json( { message: err.message });
    }
});

// Delete a Package
router.delete('/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id);
        if (!deletedPackage) return res.status(404).json({ message: "Package not found" });
        res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
