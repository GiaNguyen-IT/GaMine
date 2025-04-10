import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, 
    TextField, Divider, Chip, Tooltip, Card, CardMedia, CardContent,
    Tab, Tabs, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
    CircularProgress, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../services/api';
import { Blog, BlogImage } from '../types';
import { useSnackbar } from 'notistack';
import Layout from '../components/Layout';
import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'gamine_preset';
const CLOUDINARY_CLOUD_NAME = 'dlexb1dx9'; 
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`blog-tabpanel-${index}`}
            aria-labelledby={`blog-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Format date for display
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
};

const BlogManagement: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);
    
    // Form data
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    
    // Images
    const [uploadedImages, setUploadedImages] = useState<{file: File, cloudinaryUrl: string}[]>([]);
    const [selectedImages, setSelectedImages] = useState<BlogImage[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState<number | null>(null);
    
    const { enqueueSnackbar } = useSnackbar();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const contentFieldRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await getBlogs();
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            enqueueSnackbar('Unable to fetch blogs', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (blog?: Blog) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                content: blog.content,
            });
            setSelectedImages(blog.images || []);
            const primaryImage = blog.images?.find(img => img.is_primary);
            setPrimaryImageIndex(primaryImage ? blog.images.indexOf(primaryImage) : null);
        } else {
            setEditingBlog(null);
            setFormData({
                title: '',
                content: '',
            });
            setSelectedImages([]);
            setPrimaryImageIndex(null);
        }
        setUploadedImages([]);
        setOpenDialog(true);
        setTabValue(0);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingBlog(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            content: value
        }));
        
        // Lưu vị trí con trỏ hiện tại
        if (e.target instanceof HTMLTextAreaElement) {
            setCursorPosition(e.target.selectionStart);
        }
    };

    // Upload image to Cloudinary
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw new Error('Failed to upload image to Cloudinary');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            try {
                setUploading(true);
                const filesArray = Array.from(e.target.files);
                
                // Upload each file to Cloudinary
                const uploadPromises = filesArray.map(async (file) => {
                    const cloudinaryUrl = await uploadToCloudinary(file);
                    return { file, cloudinaryUrl };
                });
                
                const uploadedResults = await Promise.all(uploadPromises);
                setUploadedImages(prev => [...prev, ...uploadedResults]);
                
                enqueueSnackbar('Tải ảnh lên thành công!', { variant: 'success' });
            } catch (error) {
                console.error('Error uploading images:', error);
                enqueueSnackbar('Lỗi khi tải ảnh lên', { variant: 'error' });
            } finally {
                setUploading(false);
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        // Remove from uploaded images
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        
        // Update primary image index if needed
        if (primaryImageIndex === index) {
            setPrimaryImageIndex(null);
        } else if (primaryImageIndex !== null && primaryImageIndex > index) {
            setPrimaryImageIndex(primaryImageIndex - 1);
        }
    };

    const handleRemoveExistingImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        
        // Update primary image index if needed
        if (primaryImageIndex === index) {
            setPrimaryImageIndex(null);
        } else if (primaryImageIndex !== null && primaryImageIndex > index) {
            setPrimaryImageIndex(primaryImageIndex - 1);
        }
    };

    const handleSetPrimaryImage = (index: number, isUploaded: boolean = false) => {
        if (isUploaded) {
            // Uploaded images
            setPrimaryImageIndex(index);
        } else {
            // Existing images
            setPrimaryImageIndex(uploadedImages.length + index);
        }
    };

    // Chèn ảnh vào vùng nội dung tại vị trí con trỏ
    const insertImageToContent = (imageUrl: string) => {
        const imgTag = `<img src="${imageUrl}" alt="Blog image" style="max-width: 100%; height: auto;" />`;
        
        if (cursorPosition !== null && contentFieldRef.current) {
            const beforeText = formData.content.substring(0, cursorPosition);
            const afterText = formData.content.substring(cursorPosition);
            
            const newContent = beforeText + imgTag + afterText;
            setFormData(prev => ({
                ...prev,
                content: newContent
            }));
            
            // Đặt lại vị trí con trỏ sau khi chèn ảnh
            setTimeout(() => {
                if (contentFieldRef.current) {
                    const newPosition = cursorPosition + imgTag.length;
                    contentFieldRef.current.focus();
                    contentFieldRef.current.setSelectionRange(newPosition, newPosition);
                    setCursorPosition(newPosition);
                }
            }, 0);
        } else {
            // Nếu không có vị trí con trỏ, thêm vào cuối
            const newContent = formData.content + imgTag;
            setFormData(prev => ({
                ...prev,
                content: newContent
            }));
        }
    };

    const handleSubmit = async () => {
        // Validate data
        if (!formData.title || !formData.content) {
            enqueueSnackbar('Vui lòng điền đầy đủ thông tin', { variant: 'error' });
            return;
        }
        
        try {
            // Prepare blog data
            const blogData: any = {
                title: formData.title,
                content: formData.content,
                images: []
            };
            
            // Add uploaded images
            if (uploadedImages.length > 0) {
                uploadedImages.forEach((img, index) => {
                    blogData.images.push({
                        image_url: img.cloudinaryUrl,
                        is_primary: primaryImageIndex === index
                    });
                });
            }
            
            // For existing images that should remain
            if (editingBlog && selectedImages.length > 0) {
                selectedImages.forEach((image, index) => {
                    blogData.images.push({
                        image_id: image.image_id,
                        image_url: image.image_url,
                        is_primary: primaryImageIndex === (uploadedImages.length + index)
                    });
                });
            }
            
            if (editingBlog) {
                // Update blog
                await updateBlog(editingBlog.blog_id, blogData);
                enqueueSnackbar('Cập nhật bài viết thành công!', { variant: 'success' });
            } else {
                // Create new blog
                await createBlog(blogData);
                enqueueSnackbar('Tạo bài viết mới thành công!', { variant: 'success' });
            }
            
            handleCloseDialog();
            fetchBlogs();
        } catch (error: any) {
            console.error('Error saving blog:', error);
            if (error.response) {
                console.error('Response error:', error.response.data);
                enqueueSnackbar(`Lỗi: ${JSON.stringify(error.response.data)}`, { variant: 'error' });
            } else {
                enqueueSnackbar('Lỗi khi lưu dữ liệu bài viết', { variant: 'error' });
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await deleteBlog(id);
                enqueueSnackbar('Blog deleted successfully!', { variant: 'success' });
                fetchBlogs();
            } catch (error) {
                console.error('Error deleting blog:', error);
                enqueueSnackbar('Unable to delete blog', { variant: 'error' });
            }
        }
    };

    const handlePreview = (blog: Blog) => {
        setPreviewBlog(blog);
        setOpenPreviewDialog(true);
    };

    return (
        <Layout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý bài viết
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenDialog()}
                    sx={{ mb: 2 }}
                >
                    Tạo bài viết mới
                </Button>
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tiêu đề</TableCell>
                                <TableCell>Hình ảnh</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : blogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Không có dữ liệu</TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog.blog_id}>
                                        <TableCell>{blog.blog_id}</TableCell>
                                        <TableCell>{blog.title}</TableCell>
                                        <TableCell>
                                            {blog.images?.length ? (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    {blog.images.slice(0, 3).map((image, index) => (
                                                        <Box 
                                                            key={image.image_id}
                                                            component="img"
                                                            src={image.image_url}
                                                            alt={`Image ${index + 1}`}
                                                            sx={{ 
                                                                width: 50, 
                                                                height: 50, 
                                                                objectFit: 'cover',
                                                                border: image.is_primary ? '2px solid blue' : 'none'
                                                            }}
                                                        />
                                                    ))}
                                                    {blog.images.length > 3 && (
                                                        <Chip 
                                                            label={`+${blog.images.length - 3}`} 
                                                            size="small"
                                                        />
                                                    )}
                                                </Box>
                                            ) : (
                                                <Chip 
                                                    icon={<ImageIcon />} 
                                                    label="Không có hình ảnh" 
                                                    size="small"
                                                    color="default"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>{formatDate(blog.created_at)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handlePreview(blog)} title="Xem trước">
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDialog(blog)} title="Sửa">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(blog.blog_id)} title="Xóa">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Dialog Thêm/Sửa Blog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {editingBlog ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                    </DialogTitle>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="Thông tin chung" />
                            <Tab label="Hình ảnh" />
                        </Tabs>
                    </Box>
                    <DialogContent>
                        <TabPanel value={tabValue} index={0}>
                            <Box sx={{ mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Tiêu đề"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                />
                                
                                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                                    Nội dung
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={10}
                                    name="content"
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    placeholder="Nhập nội dung bài viết..."
                                    variant="outlined"
                                    inputRef={contentFieldRef}
                                />
                                
                                {/* Thêm phần chèn ảnh vào nội dung */}
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Ảnh đã tải lên (nhấp vào ảnh để chèn vào nội dung)
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -0.5 }}>
                                        {uploadedImages.map((img, index) => (
                                            <Box 
                                                key={`content-image-${index}`}
                                                sx={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    m: 0.5,
                                                    cursor: 'pointer',
                                                    border: '1px solid #ddd',
                                                    '&:hover': {
                                                        border: '1px solid #2196f3'
                                                    }
                                                }}
                                                onClick={() => insertImageToContent(img.cloudinaryUrl)}
                                            >
                                                <Box 
                                                    component="img"
                                                    src={img.cloudinaryUrl}
                                                    alt={`Thumbnail ${index}`}
                                                    sx={{ 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        objectFit: 'cover' 
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                        {selectedImages.map((img, index) => (
                                            <Box 
                                                key={`content-existing-image-${img.image_id}`}
                                                sx={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    m: 0.5,
                                                    cursor: 'pointer',
                                                    border: '1px solid #ddd',
                                                    '&:hover': {
                                                        border: '1px solid #2196f3'
                                                    }
                                                }}
                                                onClick={() => insertImageToContent(img.image_url)}
                                            >
                                                <Box 
                                                    component="img"
                                                    src={img.image_url}
                                                    alt={`Thumbnail ${index}`}
                                                    sx={{ 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        objectFit: 'cover' 
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                        {uploadedImages.length === 0 && selectedImages.length === 0 && (
                                            <Typography variant="body2" color="textSecondary">
                                                Không có ảnh nào. Vui lòng tải lên ảnh ở tab "Hình ảnh".
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </TabPanel>
                        
                        <TabPanel value={tabValue} index={1}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Tải lên hình ảnh
                                </Typography>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    disabled={uploading}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={uploading ? <CircularProgress size={20} /> : <AddPhotoAlternateIcon />}
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{ mb: 2 }}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Đang tải lên...' : 'Chọn hình ảnh'}
                                </Button>
                                
                                {/* Hiển thị hình ảnh đã tải lên */}
                                {uploadedImages.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Hình ảnh mới
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1 }}>
                                            {uploadedImages.map((img, index) => (
                                                <Box sx={{ width: { xs: '50%', sm: '33.33%', md: '25%' }, p: 1 }} key={`new-${index}`}>
                                                    <Card variant="outlined">
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            image={img.cloudinaryUrl}
                                                            alt={`Uploaded ${index + 1}`}
                                                        />
                                                        <CardContent sx={{ p: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Tooltip title="Đặt làm ảnh chính">
                                                                    <IconButton 
                                                                        size="small"
                                                                        color={primaryImageIndex === index ? "primary" : "default"}
                                                                        onClick={() => handleSetPrimaryImage(index, true)}
                                                                    >
                                                                        <ImageIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Xóa">
                                                                    <IconButton 
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => handleRemoveImage(index)}
                                                                    >
                                                                        <DeleteOutlineIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                                
                                {/* Hiển thị hình ảnh hiện có */}
                                {selectedImages.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Hình ảnh hiện có
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1 }}>
                                            {selectedImages.map((image, index) => (
                                                <Box sx={{ width: { xs: '50%', sm: '33.33%', md: '25%' }, p: 1 }} key={`existing-${image.image_id}`}>
                                                    <Card variant="outlined">
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            image={image.image_url}
                                                            alt={`Image ${index + 1}`}
                                                        />
                                                        <CardContent sx={{ p: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <Tooltip title="Đặt làm ảnh chính">
                                                                    <IconButton 
                                                                        size="small"
                                                                        color={primaryImageIndex === uploadedImages.length + index ? "primary" : "default"}
                                                                        onClick={() => handleSetPrimaryImage(index)}
                                                                    >
                                                                        <ImageIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Xóa">
                                                                    <IconButton 
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => handleRemoveExistingImage(index)}
                                                                    >
                                                                        <DeleteOutlineIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </TabPanel>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Hủy</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            Lưu
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog xem trước */}
                <Dialog open={openPreviewDialog} onClose={() => setOpenPreviewDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        Xem trước: {previewBlog?.title}
                    </DialogTitle>
                    <DialogContent>
                        {previewBlog && (
                            <Box>
                                <Typography variant="h5" gutterBottom>
                                    {previewBlog.title}
                                </Typography>
                                
                                {previewBlog.images && previewBlog.images.find(img => img.is_primary) && (
                                    <Box 
                                        component="img"
                                        src={previewBlog.images.find(img => img.is_primary)?.image_url}
                                        alt="Primary image"
                                        sx={{ 
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: '400px',
                                            objectFit: 'contain',
                                            mb: 2
                                        }}
                                    />
                                )}
                                
                                <Box 
                                    dangerouslySetInnerHTML={{ __html: previewBlog.content }}
                                    sx={{ 
                                        pb: 2,
                                        whiteSpace: 'pre-wrap',
                                        '& img': {
                                            maxWidth: '100%',
                                            height: 'auto'
                                        }
                                    }}
                                />
                                
                                {previewBlog.images && previewBlog.images.length > 1 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Hình ảnh khác
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1 }}>
                                            {previewBlog.images
                                                .filter(img => !img.is_primary)
                                                .map((image) => (
                                                <Box sx={{ width: { xs: '50%', sm: '33.33%', md: '25%' }, p: 1 }} key={image.image_id}>
                                                    <Box 
                                                        component="img"
                                                        src={image.image_url}
                                                        alt="Blog image"
                                                        sx={{ 
                                                            width: '100%',
                                                            height: '140px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                                
                                <Box sx={{ mt: 2, textAlign: 'right', color: 'text.secondary' }}>
                                    <Typography variant="caption">
                                        Ngày đăng: {formatDate(previewBlog.created_at)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPreviewDialog(false)}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default BlogManagement; 