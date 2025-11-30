// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Box
// } from "@mui/material";
// import { SnackbarProvider, useSnackbar } from "notistack";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import axios from "axios";

// export default function Wrapper() {
//   return (
//     <SnackbarProvider maxSnack={3}>
//       <Home />
//     </SnackbarProvider>
//   );
// }

// function Home() {
//   const API = "http://localhost:3000/sinhvien"; // đổi URL sang sinhvien
//   const { enqueueSnackbar } = useSnackbar();

//   const [data, setData] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [edit, setEdit] = useState(false);
//   const [sv, setSv] = useState({ hoten: "", tuoi: "", luong: "", diachi: "" });
//   const [err, setErr] = useState({});
//   const [searchName, setSearchName] = useState("");

//   // ---------------------- LOAD DATA ----------------------
//   const loadData = async (search = "") => {
//     try {
//       const res = await axios.get(API, { params: { search } });
//       setData(res.data);
//     } catch {
//       enqueueSnackbar("Không thể tải dữ liệu!", { variant: "error" });
//     }
//   };

//   useEffect(() => {
//     loadData(); // load lần đầu
//   }, []);

//   // ---------------------- VALIDATE ----------------------
//   const validate = () => {
//     const e = {};
//     if (!sv.hoten.trim()) e.hoten = "Không được trống";
//     if (!sv.tuoi || sv.tuoi < 18 || sv.tuoi > 60) e.tuoi = "18 - 60";
//     if (!sv.luong || sv.luong <= 0) e.luong = "Lương phải > 0";
//     setErr(e);
//     return Object.keys(e).length === 0;
//   };

//   // ---------------------- ADD ----------------------
//   const handleAdd = () => {
//     setSv({ hoten: "", tuoi: "", luong: "", diachi: "" });
//     setErr({});
//     setEdit(false);
//     setOpen(true);
//   };

//   // ---------------------- EDIT ----------------------
//   const handleEdit = (item) => {
//     setSv(item);
//     setEdit(true);
//     setErr({});
//     setOpen(true);
//   };

//   // ---------------------- DELETE ----------------------
//   const handleDelete = async (id) => {
//     if (!window.confirm("Xóa sinh viên?")) return;

//     try {
//       await axios.delete(`${API}/${id}`);
//       enqueueSnackbar("Đã xóa!", { variant: "success" });
//       loadData(searchName);
//     } catch {
//       enqueueSnackbar("Xóa thất bại!", { variant: "error" });
//     }
//   };

//   // ---------------------- SUBMIT ----------------------
//   const handleSubmit = async () => {
//     if (!validate()) return enqueueSnackbar("Dữ liệu chưa hợp lệ!", { variant: "warning" });

//     let payload = { ...sv };
//     if (!edit) delete payload._id;

//     try {
//       if (edit) await axios.put(`${API}/${sv._id}`, payload);
//       else await axios.post(API, payload);

//       enqueueSnackbar(edit ? "Đã cập nhật!" : "Đã thêm!", { variant: "success" });
//       setOpen(false);
//       loadData(searchName);
//     } catch {
//       enqueueSnackbar("Lỗi hệ thống!", { variant: "error" });
//     }
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
//         Quản Lý Sinh Viên
//       </Typography>

//       {/* SEARCH + ADD BUTTON */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//           mb: 3,
//           flexWrap: "wrap", // responsive khi màn hình nhỏ
//         }}
//       >
//         <TextField
//           placeholder="Tìm kiếm theo họ tên"
//           value={searchName}
//           onChange={(e) => setSearchName(e.target.value)}
          
//           sx={{
//             flex: 1,
//             minWidth: "250px",
//           }}
//           size="small"
//         />
//         <Button
//           variant="contained"
//           onClick={() => loadData(searchName)}
//           sx={{
//             bgcolor: "#1976d2",
//             color: "white",
//             height: "40px",
//             whiteSpace: "nowrap",
//           }}
//         >
//           Tìm kiếm
//         </Button>

//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleAdd}
//           sx={{
//             bgcolor: "#1976d2",
//             color: "white",
//             whiteSpace: "nowrap",
//             height: "40px",
//           }}
//         >
//           Thêm Sinh Viên
//         </Button>
//       </Box>

//       {/* TABLE */}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead sx={{ background: "#eaf3ff" }}>
//             <TableRow>
//               <TableCell><b>ID</b></TableCell>
//               <TableCell><b>Họ Tên</b></TableCell>
//               <TableCell><b>Tuổi</b></TableCell>
//               <TableCell><b>Lương</b></TableCell>
//               <TableCell><b>Địa chỉ</b></TableCell>
//               <TableCell><b>Hành động</b></TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {data.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
//               </TableRow>
//             ) : (
//               data.map((item) => (
//                 <TableRow key={item._id} hover>
//                   <TableCell>{item._id}</TableCell>
//                   <TableCell>{item.hoten}</TableCell>
//                   <TableCell>{item.tuoi}</TableCell>
//                   <TableCell>{item.luong.toLocaleString()} VNĐ</TableCell>
//                   <TableCell>{item.diachi}</TableCell>
//                   <TableCell>
//                     <Button startIcon={<EditIcon />} size="small" color="success" onClick={() => handleEdit(item)} sx={{ mr: 1 }}>Sửa</Button>
//                     <Button startIcon={<DeleteIcon />} size="small" color="error" onClick={() => handleDelete(item._id)}>Xóa</Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* DIALOG ADD/EDIT */}
//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTitle>{edit ? "Sửa Sinh Viên" : "Thêm Sinh Viên"}</DialogTitle>
//         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//           <TextField label="Họ Tên" value={sv.hoten} onChange={(e) => setSv({ ...sv, hoten: e.target.value })} error={!!err.hoten} helperText={err.hoten} />
//           <TextField label="Tuổi" type="number" value={sv.tuoi} onChange={(e) => setSv({ ...sv, tuoi: Number(e.target.value) })} error={!!err.tuoi} helperText={err.tuoi} />
//           <TextField label="Lương" type="number" value={sv.luong} onChange={(e) => setSv({ ...sv, luong: Number(e.target.value) })} error={!!err.luong} helperText={err.luong} />
//           <TextField label="Địa Chỉ" value={sv.diachi} onChange={(e) => setSv({ ...sv, diachi: e.target.value })} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Hủy</Button>
//           <Button variant="contained" onClick={handleSubmit}>{edit ? "Lưu" : "Thêm"}</Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }
