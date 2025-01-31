const mongoose = require('mongoose');
const Event = require('./Event');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const sampleEvents = [
  {
    title: 'Workshop on Disaster Management',
    description: 'A workshop to educate people on disaster management.',
    type: 'workshop',
    date: new Date('2023-11-01'),
    location: { coordinates: [40.7128, -74.0060] },
    capacity: 50,
    registeredParticipants: []
  },
  {
    title: 'Fire Drill',
    description: 'A fire drill to practice emergency evacuation.',
    type: 'drill',
    date: new Date('2023-11-05'),
    location: { coordinates: [34.0522, -118.2437] },
    capacity: 100,
    registeredParticipants: []
  },
  {
    title: 'First Aid Training',
    description: 'Training session on providing first aid.',
    type: 'training',
    date: new Date('2023-11-10'),
    location: { coordinates: [51.5074, -0.1278] },
    capacity: 30,
    registeredParticipants: []
  },
  {
    title: 'Earthquake Preparedness Workshop',
    description: 'Workshop on how to prepare for an earthquake.',
    type: 'workshop',
    date: new Date('2023-11-15'),
    location: { coordinates: [35.6895, 139.6917] },
    capacity: 40,
    registeredParticipants: []
  },
  {
    title: 'Flood Evacuation Drill',
    description: 'Drill to practice evacuation during a flood.',
    type: 'drill',
    date: new Date('2023-11-20'),
    location: { coordinates: [28.6139, 77.2090] },
    capacity: 80,
    registeredParticipants: []
  },
  {
    title: 'CPR Training',
    description: 'Training session on performing CPR.',
    type: 'training',
    date: new Date('2023-11-25'),
    location: { coordinates: [48.8566, 2.3522] },
    capacity: 25,
    registeredParticipants: []
  },
  {
    title: 'Hurricane Preparedness Workshop',
    description: 'Workshop on how to prepare for a hurricane.',
    type: 'workshop',
    date: new Date('2023-11-30'),
    location: { coordinates: [29.7604, -95.3698] },
    capacity: 60,
    registeredParticipants: []
  },
  {
    title: 'Tsunami Evacuation Drill',
    description: 'Drill to practice evacuation during a tsunami.',
    type: 'drill',
    date: new Date('2023-12-05'),
    location: { coordinates: [35.6762, 139.6503] },
    capacity: 90,
    registeredParticipants: []
  },
  {
    title: 'Basic Life Support Training',
    description: 'Training session on basic life support techniques.',
    type: 'training',
    date: new Date('2023-12-10'),
    location: { coordinates: [37.7749, -122.4194] },
    capacity: 35,
    registeredParticipants: []
  },
  {
    title: 'Emergency Response Workshop',
    description: 'Workshop on how to respond to emergencies.',
    type: 'workshop',
    date: new Date('2023-12-15'),
    location: { coordinates: [40.7306, -73.9352] },
    capacity: 70,
    registeredParticipants: []
  }
];

const insertEvents = async () => {
  try {
    await Event.insertMany(sampleEvents);
    console.log('Sample events inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting sample events:', error);
    mongoose.connection.close();
  }
};

insertEvents();