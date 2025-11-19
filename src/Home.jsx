import React, { useEffect, useState } from "react";
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import { SnackbarProvider, useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

// ======================================================
// WRAPPER (bọc Snackbar)
// ======================================================
export default function Wrapper() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Home />
    </SnackbarProvider>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================
function Home() {
  const API = "http://localhost:3000/nhanvien";
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const [nv, setNv] = useState({
    hoten: "",
    tuoi: "",
    luong: "",
    diachi: ""
  });

  const [err, setErr] = useState({});

  // ---------------------- LOAD DATA ----------------------
  useEffect(() => {
    axios.get(API)
      .then(res => setData(res.data))
      .catch(() =>
        enqueueSnackbar("Không thể tải dữ liệu!", { variant: "error" })
      );
  }, []);

  // ---------------------- VALIDATE ----------------------
  const validate = () => {
    const e = {};
    if (!nv.hoten.trim()) e.hoten = "Không được trống";
    if (!nv.tuoi || nv.tuoi < 18 || nv.tuoi > 60) e.tuoi = "18 - 60";
    if (!nv.luong || nv.luong <= 0) e.luong = "Lương phải > 0";
    setErr(e);
    return Object.keys(e).length === 0;
  };

  // ---------------------- ADD ----------------------
  const handleAdd = () => {
    setNv({ hoten: "", tuoi: "", luong: "", diachi: "" });
    setErr({});
    setEdit(false);
    setOpen(true);
  };

  // ---------------------- EDIT ----------------------
  const handleEdit = (item) => {
    setNv(item);
    setEdit(true);
    setErr({});
    setOpen(true);
  };

  // ---------------------- DELETE ----------------------
  const handleDelete = (id) => {
    if (!window.confirm("Xóa nhân viên?")) return;

    axios.delete(`${API}/${id}`)
      .then(() => {
        setData(data.filter(i => i.id !== id));
        enqueueSnackbar("Đã xóa!", { variant: "success" });
      })
      .catch(() => enqueueSnackbar("Xóa thất bại!", { variant: "error" }));
  };

  // ---------------------- SUBMIT (ADD + EDIT) ----------------------
  const handleSubmit = () => {
    if (!validate()) {
      return enqueueSnackbar("Dữ liệu chưa hợp lệ!", { variant: "warning" });
    }

    let payload = { ...nv };
    if (!edit) delete payload.id; // CHẶN id null khi thêm

    const req = edit
      ? axios.put(`${API}/${nv.id}`, payload)
      : axios.post(API, payload);

    req.then(res => {
      setData(
        edit
          ? data.map(i => (i.id === nv.id ? res.data : i))
          : [...data, res.data]
      );

      enqueueSnackbar(edit ? "Đã cập nhật!" : "Đã thêm!", {
        variant: "success"
      });

      setOpen(false);
    })
      .catch(() => enqueueSnackbar("Lỗi hệ thống!", { variant: "error" }));
  };

  // ======================================================
  // RENDER UI
  // ======================================================
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
        Quản Lý Nhân Viên
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ mb: 3 }}
      >
        Thêm Nhân Viên
      </Button>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#eaf3ff" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Họ Tên</b></TableCell>
              <TableCell><b>Tuổi</b></TableCell>
              <TableCell><b>Lương</b></TableCell>
              <TableCell><b>Địa chỉ</b></TableCell>
              <TableCell><b>Hành động</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.hoten}</TableCell>
                  <TableCell>{item.tuoi}</TableCell>
                  <TableCell>{item.luong.toLocaleString()} VNĐ</TableCell>
                  <TableCell>{item.diachi}</TableCell>

                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      color="success"
                      onClick={() => handleEdit(item)}
                      sx={{ mr: 1 }}
                    >
                      Sửa
                    </Button>

                    <Button
                      startIcon={<DeleteIcon />}
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{edit ? "Sửa Nhân Viên" : "Thêm Nhân Viên"}</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Họ Tên"
            value={nv.hoten}
            onChange={(e) => setNv({ ...nv, hoten: e.target.value })}
            error={!!err.hoten}
            helperText={err.hoten}
          />

          <TextField
            label="Tuổi"
            type="number"
            value={nv.tuoi}
            onChange={(e) => setNv({ ...nv, tuoi: Number(e.target.value) })}
            error={!!err.tuoi}
            helperText={err.tuoi}
          />

          <TextField
            label="Lương"
            type="number"
            value={nv.luong}
            onChange={(e) => setNv({ ...nv, luong: Number(e.target.value) })}
            error={!!err.luong}
            helperText={err.luong}
          />

          <TextField
            label="Địa Chỉ"
            value={nv.diachi}
            onChange={(e) => setNv({ ...nv, diachi: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>

          <Button variant="contained" onClick={handleSubmit}>
            {edit ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}


// npm install -g json-server
// json-server --watch 
