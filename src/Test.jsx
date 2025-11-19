
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

function Home() {
  const [nhanviens, setNhanviens] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentNV, setCurrentNV] = useState({ hoten: "", tuoi: "", luong: "", diachi: "" });
  const [isEdit, setIsEdit] = useState(false);

  const API_URL = "http://localhost:3001/nhanvien";

  // Load dữ liệu từ server
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios
      .get(API_URL)
      .then((res) => setNhanviens(res.data))
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  };

  // Mở dialog thêm mới
  const handleAdd = () => {
    setCurrentNV({ hoten: "", tuoi: "", luong: "", diachi: "" });
    setIsEdit(false);
    setOpenDialog(true);
  };

  // Mở dialog sửa
  const handleEdit = (nv) => {
    setCurrentNV(nv);
    setIsEdit(true);
    setOpenDialog(true);
  };

  // Xóa nhân viên
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này không?")) {
      axios
        .delete(`${API_URL}/${id}`)
        .then(() => {
          setNhanviens(nhanviens.filter((nv) => nv.id !== id));
        })
        .catch((err) => console.error("Lỗi khi xóa:", err));
    }
  };

  // Xử lý submit form Thêm/Sửa
  const handleSubmit = () => {
    if (isEdit) {
      // Sửa
      axios
        .put(`${API_URL}/${currentNV.id}`, currentNV)
        .then((res) => {
          setNhanviens(nhanviens.map((nv) => (nv.id === res.data.id ? res.data : nv)));
          setOpenDialog(false);
        })
        .catch((err) => console.error("Lỗi khi sửa:", err));
    } else {
      // Thêm
      axios
        .post(API_URL, currentNV)
        .then((res) => {
          setNhanviens([...nhanviens, res.data]);
          setOpenDialog(false);
        })
        .catch((err) => console.error("Lỗi khi thêm:", err));
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Quản lý nhân viên với ReactJS & Axios
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleAdd}
      >
        Thêm mới nhân viên
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Họ tên</strong></TableCell>
              <TableCell><strong>Tuổi</strong></TableCell>
              <TableCell><strong>Lương</strong></TableCell>
              <TableCell><strong>Địa chỉ</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nhanviens.map((nv) => (
              <TableRow key={nv.id}>
                <TableCell>{nv.id}</TableCell>
                <TableCell>{nv.hoten}</TableCell>
                <TableCell>{nv.tuoi}</TableCell>
                <TableCell>{nv.luong}</TableCell>
                <TableCell>{nv.diachi}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(nv)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(nv.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Thêm/Sửa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{isEdit ? "Sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Họ tên"
            value={currentNV.hoten}
            onChange={(e) => setCurrentNV({ ...currentNV, hoten: e.target.value })}
          />
          <TextField
            label="Tuổi"
            type="number"
            value={currentNV.tuoi}
            onChange={(e) => setCurrentNV({ ...currentNV, tuoi: parseInt(e.target.value) })}
          />
          <TextField
            label="Lương"
            type="number"
            value={currentNV.luong}
            onChange={(e) => setCurrentNV({ ...currentNV, luong: parseInt(e.target.value) })}
          />
          <TextField
            label="Địa chỉ"
            value={currentNV.diachi}
            onChange={(e) => setCurrentNV({ ...currentNV, diachi: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEdit ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Home;