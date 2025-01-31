// Update the path to look for .env in server root directory
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Resource = require('./Resource');
const Donation = require('./Donation');
const { Types } = mongoose;

// Fail fast if no MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.log('MongoDB connection error:', err);
  process.exit(1);
});

const sampleResources = [
  { name: 'Water Bottles', type: 'Water', quantity: 100 },
  { name: 'Canned Food', type: 'Food', quantity: 200 },
  { name: 'Blankets', type: 'Shelter', quantity: 50 },
  { name: 'First Aid Kits', type: 'Medical', quantity: 30 },
  { name: 'Flashlights', type: 'Equipment', quantity: 75 },
];

const sampleDonations = [
  { donor: new Types.ObjectId(), amount: 50, currency: 'USD' },
  { donor: new Types.ObjectId(), amount: 100, currency: 'USD' },
];

const insertResourcesAndDonations = async () => {
  try {
    await Resource.insertMany(sampleResources);
    console.log('Sample resources inserted successfully');
    await Donation.insertMany(sampleDonations);
    console.log('Sample donations inserted successfully');
  } catch (error) {
    console.error('Error inserting samples:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

insertResourcesAndDonations();