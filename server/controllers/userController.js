import User from '../models/userModel.js';

export const createOrUpdateUser = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: 'UID and email are required' });
    }

    let user = await User.findOne({ uid });

    if (user) {
      user.displayName = displayName || user.displayName;
      user.photoURL = photoURL || user.photoURL;
      await user.save();
    } else {
      user = new User({
        uid,
        email,
        displayName,
        photoURL,
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { monthlyIncome, currency, displayName } = req.body;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (monthlyIncome !== undefined) user.monthlyIncome = monthlyIncome;
    if (currency) user.currency = currency;
    if (displayName) user.displayName = displayName;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ uid });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
