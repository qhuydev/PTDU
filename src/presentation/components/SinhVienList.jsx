import React from "react";
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SinhVienList({ data, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ background: "#eaf3ff" }}>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Họ Tên</b></TableCell>
            <TableCell><b>Tuổi</b></TableCell>
            <TableCell><b>Lương</b></TableCell>
            <TableCell><b>Địa Chỉ</b></TableCell>
            <TableCell><b>Hành động</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
            </TableRow>
          ) : (
            data.map((sv) => (
              <TableRow key={sv._id}>
                <TableCell>{sv._id}</TableCell>
                <TableCell>{sv.hoten}</TableCell>
                <TableCell>{sv.tuoi}</TableCell>
                <TableCell>{sv.luong}</TableCell>
                <TableCell>{sv.diachi}</TableCell>
                <TableCell>
                  <Button size="small" color="success" startIcon={<EditIcon />} onClick={() => onEdit(sv)}>Sửa</Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(sv._id)} sx={{ ml: 1 }}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
