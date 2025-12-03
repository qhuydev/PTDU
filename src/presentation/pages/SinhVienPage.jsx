import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";

import SinhVienService from "../../usecases/SinhVienService";
import SinhVienForm from "../components/SinhVienForm";
import SinhVienList from "../components/SinhVienList";

export default function SinhVienPage() {
  const service = new SinhVienService();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [nv, setNv] = useState({ hoten: "", tuoi: "",diachi: "" });
  const [err, setErr] = useState({});

  // State cho dialog xác nhận xoá
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const loadData = async () => {
    const res = await service.getSinhVien(search);
    setData(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  const validate = () => {
    const e = {};
    if (!nv.hoten) e.hoten = "Không được trống";
    if (!nv.tuoi || nv.tuoi < 18 || nv.tuoi > 60) e.tuoi = "18 - 60";
   
    setErr(e);
    return Object.keys(e).length === 0;
  };

  // Submit thêm hoặc sửa
  const handleSubmit = async () => {
    if (!validate()) return;

    if (edit) {
      await service.updateSinhVien(nv._id, nv);
      enqueueSnackbar("Đã cập nhật!", { variant: "success" });
    } else {
      await service.addSinhVien(nv);
      enqueueSnackbar("Đã thêm!", { variant: "success" });
    }

    setOpen(false);
    loadData();
  };

  // Khi nhấn nút xoá trong danh sách
  const handleDeleteRequest = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  // Xác nhận xoá
  const handleDeleteConfirm = async () => {
    await service.deleteSinhVien(deleteId);
    enqueueSnackbar("Đã xoá!", { variant: "success" });

    setOpenDelete(false);
    setDeleteId(null);
    loadData();
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Quản Lý Sinh Viên
      </Typography>

      {/* Ô tìm kiếm */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          placeholder="Tìm kiếm theo họ tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: "40%" }}
        />
        <Button variant="contained" onClick={loadData}>
          Tìm kiếm
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEdit(false);
            setNv({ hoten: "", tuoi: "", diachi: "" });
            setOpen(true);
          }}
        >
          Thêm Sinh Viên
        </Button>
      </Box>

      {/* Danh sách */}
      <SinhVienList
        data={data}
        onEdit={(sv) => {
          setNv(sv);
          setEdit(true);
          setOpen(true);
        }}
        onDelete={handleDeleteRequest}
      />

      {/* Form thêm/sửa */}
      <SinhVienForm
        open={open}
        edit={edit}
        nv={nv}
        err={err}
        onClose={() => setOpen(false)}
        onChange={(field, val) => setNv({ ...nv, [field]: val })}
        onSubmit={handleSubmit}
      />

      {/* Dialog xác nhận xoá */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>Bạn có chắc muốn xoá sinh viên này?</DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
