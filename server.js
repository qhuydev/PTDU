// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------- MongoDB Atlas ----------------
const MONGO_URI =
  "mongodb+srv://quanghuydev:HfXXGdMRBmOdjTVh@cluster0.itmveh7.mongodb.net/quanly_sinhvien?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ---------------- Schema & Model ----------------
const SinhVienSchema = new mongoose.Schema(
  {
    hoten: { type: String, required: true },
    tuoi: { type: Number, required: true, min: 18, max: 60 },
    luong: { type: Number, required: true },
    diachi: { type: String, required: true },
  },
  { timestamps: true }
);

const SinhVien = mongoose.model("SinhVien", SinhVienSchema, "sinhvien");

// ---------------- CRUD API ----------------

// GET tất cả hoặc tìm kiếm sinh viên theo tên
app.get("/sinhvien", async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = { hoten: { $regex: search, $options: "i" } }; // tìm không phân biệt hoa thường
    }
    const sinhviens = await SinhVien.find(filter);
    res.json(sinhviens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST thêm sinh viên mới
app.post("/sinhvien", async (req, res) => {
  try {
    const sv = new SinhVien(req.body);
    await sv.save();
    res.status(201).json(sv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT cập nhật sinh viên theo _id
app.put("/sinhvien/:id", async (req, res) => {
  try {
    const sv = await SinhVien.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sv) return res.status(404).json({ error: "Not found" });
    res.json(sv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE sinh viên theo _id
app.delete("/sinhvien/:id", async (req, res) => {
  try {
    const sv = await SinhVien.findByIdAndDelete(req.params.id);
    if (!sv) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Start server ----------------
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
