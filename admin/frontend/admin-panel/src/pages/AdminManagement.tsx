import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../components/Layout';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../services/api';
import { Admin } from '../types';
import { useSnackbar } from 'notistack';

const AdminManagement: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Admin'
    });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await getAdmins();
            setAdmins(response.data);
        } catch (error) {
            console.error('Không thể lấy dữ liệu admin:', error);
            enqueueSnackbar('Không thể lấy danh sách admin', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (admin?: Admin) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                username: admin.username,
                email: admin.email,
                password: '',  // Không hiển thị mật khẩu hiện tại
                role: admin.role
            });
        } else {
            setEditingAdmin(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'Admin'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAdmin(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (editingAdmin) {
                // Cập nhật admin
                const adminData: Partial<Admin> & { password?: string } = {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role
                };
                
                // Chỉ thêm mật khẩu nếu đã nhập
                if (formData.password) {
                    adminData.password = formData.password;
                }
                
                console.log("Gửi dữ liệu cập nhật admin:", adminData);
                const response = await updateAdmin(editingAdmin.admin_id, adminData);
                console.log("Kết quả cập nhật:", response.data);
                enqueueSnackbar('Cập nhật admin thành công!', { variant: 'success' });
            } else {
                // Tạo admin mới
                console.log("Gửi dữ liệu tạo admin mới:", formData);
                const response = await createAdmin({
                    ...formData,
                    password: formData.password
                });
                console.log("Kết quả tạo mới:", response.data);
                enqueueSnackbar('Tạo admin mới thành công!', { variant: 'success' });
            }
            
            handleCloseDialog();
            fetchAdmins();
        } catch (error: any) {
            console.error('Lỗi khi lưu admin:', error);
            if (error.response) {
                console.error('Lỗi response:', error.response.data);
                enqueueSnackbar(`Lỗi: ${JSON.stringify(error.response.data)}`, { variant: 'error' });
            } else {
                enqueueSnackbar('Lỗi khi lưu dữ liệu admin', { variant: 'error' });
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa admin này?')) {
            try {
                await deleteAdmin(id);
                enqueueSnackbar('Xóa admin thành công!', { variant: 'success' });
                fetchAdmins();
            } catch (error) {
                console.error('Lỗi khi xóa admin:', error);
                enqueueSnackbar('Không thể xóa admin', { variant: 'error' });
            }
        }
    };

    return (
        <Layout>
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Quản lý Admin</Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => handleOpenDialog()}
                    >
                        Thêm Admin
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tên đăng nhập</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : admins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Không có dữ liệu</TableCell>
                                </TableRow>
                            ) : (
                                admins.map((admin) => (
                                    <TableRow key={admin.admin_id}>
                                        <TableCell>{admin.admin_id}</TableCell>
                                        <TableCell>{admin.username}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{admin.role}</TableCell>
                                        <TableCell>{new Date(admin.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleOpenDialog(admin)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(admin.admin_id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialog Thêm/Sửa Admin */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>{editingAdmin ? 'Sửa Admin' : 'Thêm Admin Mới'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                name="username"
                                label="Tên đăng nhập"
                                value={formData.username}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            
                            <TextField
                                name="password"
                                label={editingAdmin ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                fullWidth
                                required={!editingAdmin}
                            />
                            
                            <FormControl fullWidth>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    label="Vai trò"
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value="Super Admin">Super Admin</MenuItem>
                                    <MenuItem value="Admin">Admin</MenuItem>
                                    <MenuItem value="Editor">Editor</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {editingAdmin ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default AdminManagement; 