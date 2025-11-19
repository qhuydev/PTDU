import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  AppBar, // Thiếu trong code cũ
  Toolbar, // Thiếu trong code cũ
  Box, // Thiếu trong code cũ
  Grid, // Thiếu trong code cũ
  Card, // Thiếu trong code cũ
  CardMedia, // Thiếu trong code cũ
  CardContent, // Thiếu trong code cũ
  // Icon, nếu cần
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

function Banhang() {
  const [seafood, setSeafood] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  // Đổi tên state để phù hợp hơn với ngữ cảnh "Đặt hàng"
  const [orderInfo, setOrderInfo] = useState({
    hoten: "",
    diachi: "",
    sdt: "",
    productName: "", // Thêm trường tên sản phẩm để lưu sản phẩm đang đặt
  });
  const [isEdit, setIsEdit] = useState(false); // Dường như không cần thiết cho luồng đặt hàng đơn giản này, nhưng giữ lại nếu bạn có kế hoạch mở rộng.

  // Mở dialog đặt hàng
  const handleOpenOrderDialog = (product) => {
    // Lưu thông tin sản phẩm đang được đặt
    setOrderInfo({
      hoten: "",
      diachi: "",
      sdt: "",
      productName: product.name,
    });
    setIsEdit(false);
    setOpenDialog(true);
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Xử lý thay đổi trong TextField của dialog
  const handleChange = (e) => {
    setOrderInfo({
      ...orderInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý đặt hàng (ví dụ: gửi dữ liệu lên server)
  const handlePlaceOrder = () => {
    console.log("Thông tin đặt hàng:", orderInfo);
    // TODO: Thực hiện logic gửi dữ liệu đặt hàng (ví dụ: axios.post('/api/orders', orderInfo))
    alert(`Đặt hàng "${orderInfo.productName}" thành công!`);
    handleCloseDialog();
  };

  // Lấy dữ liệu hải sản
  useEffect(() => {
    axios
      .get("/seafood.json")
      .then((res) => {
        setSeafood(res.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
      });
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography variant="h6">🌊 Seafood Shop</Typography>
          <Typography>Trang chủ</Typography>
          <Typography>Sản phẩm</Typography>
          <Typography>Liên hệ</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography>Đăng nhập</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Danh Sách Hải Sản Tươi Ngon
        </Typography>
        <Grid container spacing={3}>
          {seafood.map((food) => (
            <Grid item xs={12} sm={6} md={4} key={food.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
                }}
              >
                <CardMedia
                  sx={{ objectFit: "cover" }}
                  component={"img"}
                  height={"200"}
                  image={food.image || 'https://via.placeholder.com/400x200?text=Seafood+Image'} // Fallback image
                  alt={food.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {food.name}
                  </Typography>
                  <Typography color="error" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {food.price} VNĐ
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      minHeight: 40, // Đảm bảo chiều cao tối thiểu cho mô tả
                    }}
                  >
                    {food.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleOpenOrderDialog(food)}
                  >
                    Đặt hàng
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog Đặt Hàng */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle> 📝 Đặt Hàng: {orderInfo.productName}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
              Vui lòng nhập thông tin giao hàng:
            </Typography>
            {/* Trường Họ Tên */}
            <TextField
              label="Họ Tên Khách Hàng"
              name="hoten"
              value={orderInfo.hoten}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
            {/* Trường Địa Chỉ */}
            <TextField
              label="Địa Chỉ Giao Hàng"
              name="diachi"
              value={orderInfo.diachi}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
            {/* Trường Số Điện Thoại */}
            <TextField
              label="Số Điện Thoại"
              name="sdt"
              value={orderInfo.sdt}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              type="tel"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error" startIcon={<CloseIcon />}>
              Hủy
            </Button>
            <Button
              onClick={handlePlaceOrder}
              color="primary"
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              // Vô hiệu hóa nút nếu thông tin chưa đầy đủ
              disabled={!orderInfo.hoten || !orderInfo.diachi || !orderInfo.sdt}
            >
              Đặt hàng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default Banhang;