require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../config/db');
const User = require('../models/User');

const updatePasswords = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const updates = [
    { email: 'admin@sphn.com', password: 'Admin@SPHN2024' },
    { email: 'police@sphn.com', password: 'Police@SPHN2024' },
    { email: 'citizen@sphn.com', password: 'Citizen@SPHN2024' }
  ];

  for (const u of updates) {
    const user = await User.scope('withPassword').findOne({ where: { email: u.email } });
    if (user) {
      user.password = u.password;
      await user.save();
      console.log('✅ Updated password for:', u.email, '→', u.password);
    } else {
      console.log('⚠️  User not found:', u.email);
    }
  }

  await sequelize.close();
  console.log('\nAll seed passwords updated successfully.');
};

updatePasswords().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
