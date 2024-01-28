const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, downloadFile, getUserFiles, deleteFile } = require('../controllers/fileController');
const { authenticateToken } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', authenticateToken, upload.single('file'), uploadFile);
router.get('/user/download/:fileId', authenticateToken, downloadFile);
router.get('/:userId/files', authenticateToken, getUserFiles);
router.delete('/user/delete/:fileId', authenticateToken, deleteFile);

module.exports = router;
