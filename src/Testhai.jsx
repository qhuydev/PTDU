import { 
  Button, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography 
} from '@mui/material'
import axios from 'axios'
import { SnackbarProvider, useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

export default function Wrapper() {
  return (
    <SnackbarProvider>
      <Testhai />
    </SnackbarProvider>
  )
}

function Testhai() {
  const [data, setData] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [nv, setNv] = useState({ id: null, hoten: "", tuoi: "", luong: "", diachi: "" })
  const [edit, setEdit] = useState(false)
  const [err, setErr] = useState({})

  const API_URL = "http://localhost:3000/nhanvien"
  const { enqueueSnackbar } = useSnackbar()

  // Load dữ liệu
  useEffect(() => {
    axios
      .get(API_URL)
      .then(res => setData(res.data))
      .catch(() => enqueueSnackbar("Không thể tải dữ liệu", { variant: 'error' }))
  }, [])

  // Validate
  const validate = () => {
    const e = {}
    if (!nv.hoten.trim()) e.hoten = "Không được để trống"
    if (!nv.tuoi || nv.tuoi < 18 || nv.tuoi > 60) e.tuoi = "Tuổi phải từ 18 - 60"
    if (!nv.luong || nv.luong <= 0) e.luong = "Lương phải lớn hơn 0"
    if (!nv.diachi.trim()) e.diachi = "Không được để trống"

    setErr(e)
    return Object.keys(e).length === 0
  }

  // Thêm nhân viên
  const handleAdd = () => {
    setNv({ id: null, hoten: "", tuoi: "", luong: "", diachi: "" })
    setEdit(false)
    setOpenDialog(true)
    setErr({})
  }

  // Sửa
  const handleEdit = (item) => {
    setNv(item)
    setEdit(true)
    setErr({})
    setOpenDialog(true)
  }

  // Xóa
  const handleDelete = (id) => {
    if (!window.confirm("Xóa nhân viên?")) return

    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setData(data.filter(i => i.id !== id))
        enqueueSnackbar("Đã xóa", { variant: 'success' })
      })
      .catch(() => enqueueSnackbar("Xóa thất bại", { variant: 'error' }))
  }

  // Submit
  const handleSubmit = () => {
    if (!validate())
      return enqueueSnackbar("Dữ liệu chưa hợp lệ", { variant: 'warning' })

    const req = edit
      ? axios.put(`${API_URL}/${nv.id}`, nv)
      : axios.post(API_URL, nv)

    req.then(res => {
      setData(edit
        ? data.map(i => (i.id === nv.id ? res.data : i))
        : [...data, res.data]
      )

      enqueueSnackbar(edit ? "Đã cập nhật" : "Đã thêm", { variant: 'success' })
      setOpenDialog(false)
    })
      .catch(() => enqueueSnackbar("Lỗi hệ thống", { variant: 'error' }))
  }

  return (
    <Container>
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Quản lý nhân viên
      </Typography>

      <Button 
        sx={{ backgroundColor: 'blue', color: 'white', my: 2 }}
        onClick={handleAdd}
      >
        Thêm mới nhân viên
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Tuổi</TableCell>
              <TableCell>Lương</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            ) : (
              data.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.hoten}</TableCell>
                  <TableCell>{item.tuoi}</TableCell>
                  <TableCell>{item.luong}</TableCell>
                  <TableCell>{item.diachi}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(item)}>Sửa</Button>
                    <Button onClick={() => handleDelete(item.id)}>Xóa</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{edit ? "Sửa nhân viên" : "Thêm nhân viên"}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Họ tên"
            value={nv.hoten}
            onChange={e => setNv({ ...nv, hoten: e.target.value })}
            error={!!err.hoten}
            helperText={err.hoten}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Tuổi"
            type="number"
            value={nv.tuoi}
            onChange={e => setNv({ ...nv, tuoi: Number(e.target.value) })}
            error={!!err.tuoi}
            helperText={err.tuoi}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Lương"
            type="number"
            value={nv.luong}
            onChange={e => setNv({ ...nv, luong: Number(e.target.value) })}
            error={!!err.luong}
            helperText={err.luong}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Địa chỉ"
            value={nv.diachi}
            onChange={e => setNv({ ...nv, diachi: e.target.value })}
            error={!!err.diachi}
            helperText={err.diachi}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {edit ? "Lưu" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  )
}


