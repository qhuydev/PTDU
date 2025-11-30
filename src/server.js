// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB Atlas connection
// const MONGO_URI = "mongodb+srv://quanghuydev:HfXXGdMRBmOdjTVh@cluster0.itmveh7.mongodb.net/?appName=Cluster0";

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB Atlas"))
//   .catch(err => console.error(err));

// // Schema & Model
// const SinhVienSchema = new mongoose.Schema({
//   hoten: { type: String, required: true },
//   tuoi: { type: Number, required: true, min: 18, max: 60 },
//   luong: { type: Number, required: true },
//   diachi: { type: String, required: true }
// }, { timestamps: true });

// const SinhVien = mongoose.model("SinhVien", SinhVienSchema);

// // ---------------- CRUD API ----------------
// app.get("/nhanvien", async (req, res) => {
//   try {
//     const sinhviens = await SinhVien.find();
//     res.json(sinhviens);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/nhanvien", async (req, res) => {
//   try {
//     const sv = new SinhVien(req.body);
//     await sv.save();
//     res.json(sv);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.put("/nhanvien/:id", async (req, res) => {
//   try {
//     const sv = await SinhVien.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!sv) return res.status(404).json({ error: "Not found" });
//     res.json(sv);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// app.delete("/nhanvien/:id", async (req, res) => {
//   try {
//     await SinhVien.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start server
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
