const mongoose = require('mongoose');
const Hospital = require('./Hospital');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const sampleHospitals = [
  {
    "id": 1,
    "name": "Bhopal Fracture Hospital",
    "address": "E-3/01 Arera Colony Bhopal, Savarkar Bridge, Arera Colony",
    "city": "Bhopal",
    "pinCode": "462016",
    "phoneNumber": "7411794854",
    "rating": 4.6,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 2,
    "name": "Care Chl Hospital",
    "address": "Ab Road, Near LIG Sq, RSS Nagar, New Market",
    "city": "Indore",
    "pinCode": "462003",
    "phoneNumber": "7041962479",
    "rating": 4.3,
    "longitude": 75.857727,
    "latitude": 22.719568
  },
  {
    "id": 3,
    "name": "Siddhanta Redcross Superspeciality Hospital",
    "address": "Redcross Bhawan, Link Road No 1, Shivaji Nagar",
    "city": "Redcross",
    "pinCode": "462016",
    "phoneNumber": "7383066597",
    "rating": 4.2,
    "longitude": 77.4195,
    "latitude": 23.2308
  },
  {
    "id": 4,
    "name": "Asian Globus Liver & Gastroenterolog Centre",
    "address": "E 5/24 Arera Colony, Arera Colony",
    "city": "Bittan Market",
    "pinCode": "462016",
    "phoneNumber": "8401875637",
    "rating": 3.5,
    "longitude": 77.4297,
    "latitude": 23.216
  },
  {
    "id": 5,
    "name": "Green City Hospital",
    "address": "DIG Bangalow, Berasia Road, Near V Mart",
    "city": "Bhopal",
    "pinCode": "462001",
    "phoneNumber": "8401822135",
    "rating": 3.9,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 6,
    "name": "Carewell Multispeciality Hospital",
    "address": "Gufa Mandir Road, Lalghati, (Opposite Nevari Mandir)",
    "city": "Bhopal",
    "pinCode": "462030",
    "phoneNumber": "7383509430",
    "rating": 3.7,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 7,
    "name": "Sakshi Hospital",
    "address": "127, Durga Chowk, Samanvay Nagar, Awadhpuri Khajuri Kalan Bhel, Awadhpuri",
    "city": "Bhopal",
    "pinCode": "462022",
    "phoneNumber": "8401296528",
    "rating": 3.8,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 8,
    "name": "Apollo Sage Hospital",
    "address": "E8 Extension Bawadia Kalan, 200 Feet Main Road, Bawadia Kalan, Bhopal",
    "city": "Bhopal",
    "pinCode": "462026",
    "phoneNumber": "7880138800",
    "rating": 4.4,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 9,
    "name": "Dr. Neelima Agrawal (Agrawal Hospital)",
    "address": "C/o Agrawal Hospital, E-3/34, Arera Colony, Bhopal",
    "city": "Bhopal",
    "pinCode": "462016",
    "phoneNumber": "8490964609",
    "rating": 4.2,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 10,
    "name": "DIVYANKA CHILDREN HOSPITAL & MULTISPECIALITY UNIT",
    "address": "House No.261/262 New Minal Residency, Ayodhya Bypass Road, Ayodhya Nagar",
    "city": "Bhopal",
    "pinCode": "462041",
    "phoneNumber": "8401263026",
    "rating": 4.5,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 11,
    "name": "Gayatri Hospital And Trauma Centre",
    "address": "68, Bijli Colony, Bhopal Bypass Road, Anand Nagar, Bhopal",
    "city": "Bhopal",
    "pinCode": "462022",
    "phoneNumber": "7947125791",
    "rating": 4.0,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 12,
    "name": "Aadhaar Hospital Multispeciality Unit",
    "address": "Plot No 32, Radha Krishna Colony, Karond, Bhopal",
    "city": "Bhopal",
    "pinCode": "462038",
    "phoneNumber": "7947126361",
    "rating": 4.3,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 13,
    "name": "DEVSHREE HOSPITAL",
    "address": "Indore bhopal main road jawar jod, Jawar, Madhya Pradesh",
    "city": "Indore",
    "pinCode": "462001",
    "phoneNumber": "9893068717",
    "rating": 4.8,
    "longitude": 75.857727,
    "latitude": 22.719568
  },
  {
    "id": 14,
    "name": "Bansal Hospital Sagar",
    "address": "Sagar Rd, Shri Prabhakar Nagar, Makroniya, Madhya Pradesh",
    "city": "Bhopal",
    "pinCode": "470004",
    "phoneNumber": "7582472000",
    "rating": 4.7,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 15,
    "name": "Hamidia Hospital",
    "address": "Sultania Rd, Royal Market, Bhopal, Madhya Pradesh",
    "city": "Bhopal",
    "pinCode": "462001",
    "phoneNumber": "N/A",
    "rating": 3.5,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 16,
    "name": "Narmada Trauma Centre",
    "address": "E3/23, E-3, Arera Colony, Bhopal, Madhya Pradesh",
    "city": "Bhopal",
    "pinCode": "462016",
    "phoneNumber": "7554040000",
    "rating": 4.1,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 17,
    "name": "Life Line Hospital",
    "address": "Galla Mandi Rd, near Moti Baba Mandir, Nehru Colony, Sehore, Madhya Pradesh",
    "city": "Sehore",
    "pinCode": "466001",
    "phoneNumber": "7000606119",
    "rating": 4.3,
    "longitude": 77.0844,
    "latitude": 23.2032
  },
  {
    "id": 18,
    "name": "Roshan Hospital",
    "address": "7, A-B, Raisen Rd, Govind Garden, Sector B, Govindpura, Bhopal, Madhya Pradesh",
    "city": "Bhopal",
    "pinCode": "462023",
    "phoneNumber": "9111222234",
    "rating": 3.1,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 19,
    "name": "Bina people care hospital",
    "address": "56J3+9PJ, Nandan vatika, Khurai Rd, Chandrashekhar Ward, Bina, Madhya Pradesh",
    "city": "Bhopal",
    "pinCode": "470113",
    "phoneNumber": "8602064876",
    "rating": 4.9,
    "longitude": 77.412613,
    "latitude": 23.259933
  },
  {
    "id": 20,
    "name": "Kalyanika hospital",
    "address": "main road, near Nirmal bandhan marriage Hall Medical College, Tilli, Sagar, Madhya Pradesh",
    "city": "Bhopal",
    "pinCode": "470002",
    "phoneNumber": "N/A",
    "rating": 4.8,
    "longitude": 77.412613,
    "latitude": 23.259933
  }
];

const insertHospital = async () => {
  try {
    await Hospital.insertMany(sampleHospitals);
    console.log('Sample Hospitals inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting sample Hospitals:', error);
    mongoose.connection.close();
  }
};

insertHospital();