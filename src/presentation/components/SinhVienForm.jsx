import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function SinhVienForm({ open, edit, nv, err, onChange, onSubmit, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{edit ? "Sửa Sinh Viên" : "Thêm Sinh Viên"}</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Họ tên" value={nv.hoten} onChange={(e) => onChange("hoten", e.target.value)} error={!!err.hoten} helperText={err.hoten} />

        <TextField label="Tuổi" type="number" value={nv.tuoi} onChange={(e) => onChange("tuoi", e.target.value)} error={!!err.tuoi} helperText={err.tuoi} />

        <TextField label="Lương" type="number" value={nv.luong} onChange={(e) => onChange("luong", e.target.value)} error={!!err.luong} helperText={err.luong} />

        <TextField label="Địa chỉ" value={nv.diachi} onChange={(e) => onChange("diachi", e.target.value)} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSubmit}>{edit ? "Lưu" : "Thêm"}</Button>
      </DialogActions>
    </Dialog>
  );
}
