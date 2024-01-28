const { AppUser } = require("../model/userModel");

async function deleteUser(req, res) {
    const userId = req.params.userId;
    try {
        const deletedUser = await AppUser.findByIdAndDelete({ _id: userId });
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found with the provided ID' });
        } else {
            res.status(200).json({ message: 'User deleted successfully', deletedUser });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
}

async function getUsers(req, res) {
    try {
        const users = await AppUser.find({ role: "user" });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
}

module.exports = { deleteUser, getUsers };
