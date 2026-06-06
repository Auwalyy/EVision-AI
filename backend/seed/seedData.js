require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Location = require('../models/Location');
const Recommendation = require('../models/Recommendation');
const { scoreLocation } = require('../utils/scoringEngine');

const locations = [
  // ── LAGOS ──────────────────────────────────────────────────────────────────
  { name: 'Victoria Island', city: 'Lagos', state: 'Lagos', latitude: 6.4281, longitude: 3.4219, populationDensity: 88, trafficVolume: 95, commercialScore: 97, evScore: 72, hasExistingStation: true, stationType: 'dcfast', routeCoverage: 60, nearbyPOIs: ['Banks', 'Hotels', 'Offices'] },
  { name: 'Lekki Phase 1', city: 'Lagos', state: 'Lagos', latitude: 6.4335, longitude: 3.4737, populationDensity: 82, trafficVolume: 90, commercialScore: 88, evScore: 68, hasExistingStation: false, routeCoverage: 30, nearbyPOIs: ['Shopping Malls', 'Restaurants'] },
  { name: 'Ikeja', city: 'Lagos', state: 'Lagos', latitude: 6.6018, longitude: 3.3515, populationDensity: 91, trafficVolume: 93, commercialScore: 85, evScore: 60, hasExistingStation: true, stationType: 'level2', routeCoverage: 50, nearbyPOIs: ['Airport', 'GRA', 'Computer Village'] },
  { name: 'Surulere', city: 'Lagos', state: 'Lagos', latitude: 6.5034, longitude: 3.3534, populationDensity: 94, trafficVolume: 80, commercialScore: 72, evScore: 45, hasExistingStation: false, routeCoverage: 20 },
  { name: 'Yaba', city: 'Lagos', state: 'Lagos', latitude: 6.5095, longitude: 3.3711, populationDensity: 90, trafficVolume: 82, commercialScore: 75, evScore: 55, hasExistingStation: false, routeCoverage: 25, nearbyPOIs: ['Unilag', 'Tech Hubs'] },
  { name: 'Ikoyi', city: 'Lagos', state: 'Lagos', latitude: 6.4550, longitude: 3.4372, populationDensity: 65, trafficVolume: 78, commercialScore: 90, evScore: 80, hasExistingStation: false, routeCoverage: 40, nearbyPOIs: ['Embassies', 'Luxury Hotels'] },
  { name: 'Ajah', city: 'Lagos', state: 'Lagos', latitude: 6.4700, longitude: 3.5800, populationDensity: 75, trafficVolume: 70, commercialScore: 65, evScore: 40, hasExistingStation: false, routeCoverage: 10 },
  { name: 'Oshodi', city: 'Lagos', state: 'Lagos', latitude: 6.5574, longitude: 3.3490, populationDensity: 96, trafficVolume: 95, commercialScore: 80, evScore: 38, hasExistingStation: false, routeCoverage: 15, nearbyPOIs: ['Transport Hub', 'Markets'] },
  { name: 'Apapa', city: 'Lagos', state: 'Lagos', latitude: 6.4490, longitude: 3.3590, populationDensity: 70, trafficVolume: 88, commercialScore: 82, evScore: 42, hasExistingStation: false, routeCoverage: 20, nearbyPOIs: ['Port', 'Logistics Hubs'] },
  { name: 'Epe', city: 'Lagos', state: 'Lagos', latitude: 6.5874, longitude: 3.9765, populationDensity: 40, trafficVolume: 45, commercialScore: 40, evScore: 20, hasExistingStation: false, routeCoverage: 5 },
  { name: 'Badagry', city: 'Lagos', state: 'Lagos', latitude: 6.4167, longitude: 2.8833, populationDensity: 45, trafficVolume: 48, commercialScore: 35, evScore: 18, hasExistingStation: false, routeCoverage: 5 },
  { name: 'Lekki Phase 2', city: 'Lagos', state: 'Lagos', latitude: 6.4500, longitude: 3.5300, populationDensity: 70, trafficVolume: 72, commercialScore: 70, evScore: 50, hasExistingStation: false, routeCoverage: 20 },
  { name: 'Gbagada', city: 'Lagos', state: 'Lagos', latitude: 6.5500, longitude: 3.3800, populationDensity: 85, trafficVolume: 75, commercialScore: 68, evScore: 44, hasExistingStation: false, routeCoverage: 18 },
  { name: 'Marina', city: 'Lagos', state: 'Lagos', latitude: 6.4510, longitude: 3.3900, populationDensity: 60, trafficVolume: 85, commercialScore: 92, evScore: 65, hasExistingStation: false, routeCoverage: 35, nearbyPOIs: ['CBN', 'Stock Exchange'] },

  // ── ABUJA ──────────────────────────────────────────────────────────────────
  { name: 'Maitama', city: 'Abuja', state: 'FCT', latitude: 9.0820, longitude: 7.4836, populationDensity: 60, trafficVolume: 72, commercialScore: 88, evScore: 75, hasExistingStation: true, stationType: 'dcfast', routeCoverage: 55, nearbyPOIs: ['Embassies', 'Ministries'] },
  { name: 'Wuse 2', city: 'Abuja', state: 'FCT', latitude: 9.0670, longitude: 7.4833, populationDensity: 65, trafficVolume: 78, commercialScore: 90, evScore: 72, hasExistingStation: false, routeCoverage: 40, nearbyPOIs: ['Shops', 'Banks', 'Offices'] },
  { name: 'Garki', city: 'Abuja', state: 'FCT', latitude: 9.0556, longitude: 7.4834, populationDensity: 70, trafficVolume: 80, commercialScore: 82, evScore: 65, hasExistingStation: false, routeCoverage: 35 },
  { name: 'Asokoro', city: 'Abuja', state: 'FCT', latitude: 9.0327, longitude: 7.5248, populationDensity: 55, trafficVolume: 68, commercialScore: 78, evScore: 70, hasExistingStation: false, routeCoverage: 30, nearbyPOIs: ['State House', 'Diplomatic Zone'] },
  { name: 'Gwarinpa', city: 'Abuja', state: 'FCT', latitude: 9.1200, longitude: 7.4200, populationDensity: 80, trafficVolume: 65, commercialScore: 60, evScore: 50, hasExistingStation: false, routeCoverage: 20 },
  { name: 'Central Business District', city: 'Abuja', state: 'FCT', latitude: 9.0575, longitude: 7.4951, populationDensity: 50, trafficVolume: 85, commercialScore: 95, evScore: 80, hasExistingStation: true, stationType: 'level2', routeCoverage: 60 },
  { name: 'Kubwa', city: 'Abuja', state: 'FCT', latitude: 9.1539, longitude: 7.3226, populationDensity: 82, trafficVolume: 60, commercialScore: 55, evScore: 35, hasExistingStation: false, routeCoverage: 10 },
  { name: 'Nyanya', city: 'Abuja', state: 'FCT', latitude: 9.0167, longitude: 7.5500, populationDensity: 85, trafficVolume: 70, commercialScore: 58, evScore: 32, hasExistingStation: false, routeCoverage: 8 },
  { name: 'Jabi', city: 'Abuja', state: 'FCT', latitude: 9.0723, longitude: 7.4415, populationDensity: 62, trafficVolume: 75, commercialScore: 85, evScore: 68, hasExistingStation: false, routeCoverage: 38, nearbyPOIs: ['Jabi Mall', 'Lake'] },
  { name: 'Utako', city: 'Abuja', state: 'FCT', latitude: 9.0812, longitude: 7.4596, populationDensity: 65, trafficVolume: 72, commercialScore: 80, evScore: 62, hasExistingStation: false, routeCoverage: 32 },
  { name: 'Kado', city: 'Abuja', state: 'FCT', latitude: 9.0900, longitude: 7.4100, populationDensity: 58, trafficVolume: 60, commercialScore: 65, evScore: 55, hasExistingStation: false, routeCoverage: 22 },
  { name: 'Lugbe', city: 'Abuja', state: 'FCT', latitude: 8.9800, longitude: 7.3900, populationDensity: 72, trafficVolume: 55, commercialScore: 50, evScore: 28, hasExistingStation: false, routeCoverage: 12, nearbyPOIs: ['Airport Road'] },

  // ── PORT HARCOURT ──────────────────────────────────────────────────────────
  { name: 'GRA Phase 2', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8242, longitude: 7.0336, populationDensity: 65, trafficVolume: 78, commercialScore: 88, evScore: 62, hasExistingStation: true, stationType: 'level2', routeCoverage: 45 },
  { name: 'Trans Amadi', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8500, longitude: 7.0200, populationDensity: 58, trafficVolume: 85, commercialScore: 90, evScore: 58, hasExistingStation: false, routeCoverage: 30, nearbyPOIs: ['Industries', 'Oil Companies'] },
  { name: 'Rumuola', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8800, longitude: 7.0100, populationDensity: 75, trafficVolume: 70, commercialScore: 72, evScore: 48, hasExistingStation: false, routeCoverage: 20 },
  { name: 'Diobu', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8200, longitude: 7.0000, populationDensity: 88, trafficVolume: 72, commercialScore: 68, evScore: 40, hasExistingStation: false, routeCoverage: 15 },
  { name: 'Mile 1', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8100, longitude: 7.0150, populationDensity: 92, trafficVolume: 88, commercialScore: 82, evScore: 38, hasExistingStation: false, routeCoverage: 18, nearbyPOIs: ['Markets', 'Terminals'] },
  { name: 'Eleme', city: 'Port Harcourt', state: 'Rivers', latitude: 4.7833, longitude: 7.1500, populationDensity: 50, trafficVolume: 65, commercialScore: 75, evScore: 45, hasExistingStation: false, routeCoverage: 10, nearbyPOIs: ['Refinery', 'Petrochemicals'] },
  { name: 'Rumuokoro', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8700, longitude: 7.0500, populationDensity: 78, trafficVolume: 68, commercialScore: 65, evScore: 42, hasExistingStation: false, routeCoverage: 12 },
  { name: 'Peter Odili Road', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8400, longitude: 7.0400, populationDensity: 70, trafficVolume: 80, commercialScore: 78, evScore: 52, hasExistingStation: false, routeCoverage: 28, nearbyPOIs: ['Government Offices'] },
  { name: 'Old GRA', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8150, longitude: 7.0250, populationDensity: 55, trafficVolume: 70, commercialScore: 80, evScore: 60, hasExistingStation: false, routeCoverage: 35 },
  { name: 'Woji', city: 'Port Harcourt', state: 'Rivers', latitude: 4.8600, longitude: 7.0600, populationDensity: 72, trafficVolume: 62, commercialScore: 60, evScore: 38, hasExistingStation: false, routeCoverage: 8 },

  // ── KANO ──────────────────────────────────────────────────────────────────
  { name: 'Sabon Gari', city: 'Kano', state: 'Kano', latitude: 12.0022, longitude: 8.5196, populationDensity: 95, trafficVolume: 88, commercialScore: 85, evScore: 30, hasExistingStation: false, routeCoverage: 15, nearbyPOIs: ['Markets', 'Hotels'] },
  { name: 'Kano City Centre', city: 'Kano', state: 'Kano', latitude: 12.0454, longitude: 8.5278, populationDensity: 90, trafficVolume: 85, commercialScore: 88, evScore: 28, hasExistingStation: true, stationType: 'level1', routeCoverage: 20 },
  { name: 'Nassarawa', city: 'Kano', state: 'Kano', latitude: 12.0200, longitude: 8.5500, populationDensity: 80, trafficVolume: 75, commercialScore: 78, evScore: 32, hasExistingStation: false, routeCoverage: 12 },
  { name: 'Fagge', city: 'Kano', state: 'Kano', latitude: 12.0300, longitude: 8.5200, populationDensity: 88, trafficVolume: 82, commercialScore: 80, evScore: 30, hasExistingStation: false, routeCoverage: 10 },
  { name: 'BUK Road', city: 'Kano', state: 'Kano', latitude: 12.0073, longitude: 8.4732, populationDensity: 70, trafficVolume: 65, commercialScore: 60, evScore: 35, hasExistingStation: false, routeCoverage: 8, nearbyPOIs: ['University', 'Hospitals'] },
  { name: 'Kano Airport Area', city: 'Kano', state: 'Kano', latitude: 12.0476, longitude: 8.5240, populationDensity: 45, trafficVolume: 70, commercialScore: 72, evScore: 40, hasExistingStation: false, routeCoverage: 25, nearbyPOIs: ['Airport', 'Hotels'] },
  { name: 'Challawa', city: 'Kano', state: 'Kano', latitude: 12.0600, longitude: 8.4900, populationDensity: 60, trafficVolume: 68, commercialScore: 70, evScore: 28, hasExistingStation: false, routeCoverage: 6, nearbyPOIs: ['Industrial Estate'] },
  { name: 'Bompai', city: 'Kano', state: 'Kano', latitude: 12.0700, longitude: 8.5300, populationDensity: 55, trafficVolume: 65, commercialScore: 68, evScore: 26, hasExistingStation: false, routeCoverage: 5, nearbyPOIs: ['Industrial Area'] },
  { name: 'Gwale', city: 'Kano', state: 'Kano', latitude: 11.9900, longitude: 8.5100, populationDensity: 85, trafficVolume: 70, commercialScore: 65, evScore: 22, hasExistingStation: false, routeCoverage: 8 },
  { name: 'Tarauni', city: 'Kano', state: 'Kano', latitude: 12.0100, longitude: 8.5700, populationDensity: 82, trafficVolume: 62, commercialScore: 58, evScore: 20, hasExistingStation: false, routeCoverage: 5 },
  { name: 'Dala', city: 'Kano', state: 'Kano', latitude: 12.0350, longitude: 8.4800, populationDensity: 78, trafficVolume: 60, commercialScore: 60, evScore: 22, hasExistingStation: false, routeCoverage: 6 },
  { name: 'Hotoro', city: 'Kano', state: 'Kano', latitude: 12.0500, longitude: 8.5600, populationDensity: 72, trafficVolume: 58, commercialScore: 55, evScore: 18, hasExistingStation: false, routeCoverage: 4 },

  // ── IBADAN ─────────────────────────────────────────────────────────────────
  { name: 'Bodija', city: 'Ibadan', state: 'Oyo', latitude: 7.4167, longitude: 3.9000, populationDensity: 82, trafficVolume: 75, commercialScore: 78, evScore: 38, hasExistingStation: false, routeCoverage: 18, nearbyPOIs: ['Market', 'Estates'] },
  { name: 'Challenge', city: 'Ibadan', state: 'Oyo', latitude: 7.3775, longitude: 3.9470, populationDensity: 88, trafficVolume: 82, commercialScore: 80, evScore: 35, hasExistingStation: false, routeCoverage: 12 },
  { name: 'UI Road', city: 'Ibadan', state: 'Oyo', latitude: 7.4460, longitude: 3.9020, populationDensity: 70, trafficVolume: 68, commercialScore: 65, evScore: 42, hasExistingStation: false, routeCoverage: 20, nearbyPOIs: ['University', 'Teaching Hospital'] },
  { name: 'Dugbe', city: 'Ibadan', state: 'Oyo', latitude: 7.3822, longitude: 3.9068, populationDensity: 85, trafficVolume: 88, commercialScore: 90, evScore: 32, hasExistingStation: true, stationType: 'level1', routeCoverage: 25, nearbyPOIs: ['CBD', 'Banks'] },
  { name: 'Ring Road', city: 'Ibadan', state: 'Oyo', latitude: 7.3900, longitude: 3.9100, populationDensity: 78, trafficVolume: 80, commercialScore: 75, evScore: 30, hasExistingStation: false, routeCoverage: 15 },

  // ── KADUNA ─────────────────────────────────────────────────────────────────
  { name: 'Ungwan Rimi', city: 'Kaduna', state: 'Kaduna', latitude: 10.5222, longitude: 7.4383, populationDensity: 72, trafficVolume: 70, commercialScore: 78, evScore: 35, hasExistingStation: false, routeCoverage: 15, nearbyPOIs: ['GRA', 'Government Offices'] },
  { name: 'Kawo', city: 'Kaduna', state: 'Kaduna', latitude: 10.5500, longitude: 7.4500, populationDensity: 80, trafficVolume: 72, commercialScore: 65, evScore: 28, hasExistingStation: false, routeCoverage: 10 },
  { name: 'Barnawa', city: 'Kaduna', state: 'Kaduna', latitude: 10.4800, longitude: 7.4200, populationDensity: 75, trafficVolume: 65, commercialScore: 60, evScore: 25, hasExistingStation: false, routeCoverage: 8 },
  { name: 'Kaduna CBD', city: 'Kaduna', state: 'Kaduna', latitude: 10.5205, longitude: 7.4415, populationDensity: 65, trafficVolume: 80, commercialScore: 88, evScore: 40, hasExistingStation: true, stationType: 'level2', routeCoverage: 30, nearbyPOIs: ['Markets', 'Banks'] },

  // ── ENUGU ──────────────────────────────────────────────────────────────────
  { name: 'GRA Enugu', city: 'Enugu', state: 'Enugu', latitude: 6.4483, longitude: 7.5134, populationDensity: 60, trafficVolume: 65, commercialScore: 75, evScore: 42, hasExistingStation: false, routeCoverage: 22, nearbyPOIs: ['Government Buildings', 'Estates'] },
  { name: 'Ogui Road', city: 'Enugu', state: 'Enugu', latitude: 6.4600, longitude: 7.5200, populationDensity: 75, trafficVolume: 72, commercialScore: 70, evScore: 35, hasExistingStation: false, routeCoverage: 14 },
  { name: 'Independence Layout', city: 'Enugu', state: 'Enugu', latitude: 6.4400, longitude: 7.5000, populationDensity: 65, trafficVolume: 68, commercialScore: 72, evScore: 40, hasExistingStation: false, routeCoverage: 18 },
  { name: 'Enugu CBD', city: 'Enugu', state: 'Enugu', latitude: 6.4527, longitude: 7.5107, populationDensity: 58, trafficVolume: 78, commercialScore: 85, evScore: 38, hasExistingStation: true, stationType: 'level1', routeCoverage: 28 },

  // ── JOS ────────────────────────────────────────────────────────────────────
  { name: 'Rayfield', city: 'Jos', state: 'Plateau', latitude: 9.8808, longitude: 8.8583, populationDensity: 55, trafficVolume: 58, commercialScore: 65, evScore: 30, hasExistingStation: false, routeCoverage: 12, nearbyPOIs: ['Estates', 'Hotels'] },
  { name: 'Jos CBD', city: 'Jos', state: 'Plateau', latitude: 9.9167, longitude: 8.8833, populationDensity: 68, trafficVolume: 72, commercialScore: 80, evScore: 32, hasExistingStation: false, routeCoverage: 18, nearbyPOIs: ['Markets', 'Banks'] },
  { name: 'Tudun Wada', city: 'Jos', state: 'Plateau', latitude: 9.9300, longitude: 8.8900, populationDensity: 78, trafficVolume: 65, commercialScore: 60, evScore: 25, hasExistingStation: false, routeCoverage: 8 },

  // ── MAIDUGURI ──────────────────────────────────────────────────────────────
  { name: 'Maiduguri CBD', city: 'Maiduguri', state: 'Borno', latitude: 11.8311, longitude: 13.1509, populationDensity: 70, trafficVolume: 68, commercialScore: 72, evScore: 18, hasExistingStation: false, routeCoverage: 10, nearbyPOIs: ['Market', 'Government Offices'] },
  { name: 'GRA Maiduguri', city: 'Maiduguri', state: 'Borno', latitude: 11.8450, longitude: 13.1600, populationDensity: 48, trafficVolume: 55, commercialScore: 60, evScore: 20, hasExistingStation: false, routeCoverage: 8 },
  { name: 'Customs Road', city: 'Maiduguri', state: 'Borno', latitude: 11.8200, longitude: 13.1400, populationDensity: 62, trafficVolume: 60, commercialScore: 65, evScore: 15, hasExistingStation: false, routeCoverage: 5 },

  // ── ABEOKUTA ───────────────────────────────────────────────────────────────
  { name: 'Kuto', city: 'Abeokuta', state: 'Ogun', latitude: 7.1557, longitude: 3.3451, populationDensity: 72, trafficVolume: 70, commercialScore: 75, evScore: 32, hasExistingStation: false, routeCoverage: 14, nearbyPOIs: ['Market', 'Bus Terminal'] },
  { name: 'Sapon', city: 'Abeokuta', state: 'Ogun', latitude: 7.1700, longitude: 3.3600, populationDensity: 78, trafficVolume: 65, commercialScore: 65, evScore: 28, hasExistingStation: false, routeCoverage: 10 },
  { name: 'Lafenwa', city: 'Abeokuta', state: 'Ogun', latitude: 7.1400, longitude: 3.3200, populationDensity: 80, trafficVolume: 68, commercialScore: 62, evScore: 25, hasExistingStation: false, routeCoverage: 8 },
  { name: 'Abeokuta CBD', city: 'Abeokuta', state: 'Ogun', latitude: 7.1608, longitude: 3.3476, populationDensity: 62, trafficVolume: 75, commercialScore: 82, evScore: 35, hasExistingStation: false, routeCoverage: 20 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/evision_ai');
    console.log('Connected to MongoDB');

    await Location.deleteMany({});
    await Recommendation.deleteMany({});
    console.log('Cleared existing data');

    const createdLocations = await Location.insertMany(locations);
    console.log(`Inserted ${createdLocations.length} locations`);

    // Generate recommendations for ALL locations (existing stations included)
    const recommendations = createdLocations.map((loc) => ({
      locationId: loc._id,
      ...scoreLocation(loc),
    }));

    await Recommendation.insertMany(recommendations);
    console.log(`Generated ${recommendations.length} recommendations`);

    console.log('\n✅ Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
