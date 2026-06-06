const csv = require('csv-parser');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Location = require('../models/Location');

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

exports.uploadCSV = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const results = [];
    const errors = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          try {
            results.push({
              name: row.name,
              city: row.city,
              state: row.state || '',
              latitude: parseFloat(row.latitude),
              longitude: parseFloat(row.longitude),
              populationDensity: parseFloat(row.populationDensity) || 50,
              trafficVolume: parseFloat(row.trafficVolume) || 50,
              commercialScore: parseFloat(row.commercialScore) || 50,
              evScore: parseFloat(row.evScore) || 30,
              hasExistingStation: row.hasExistingStation === 'true',
              stationType: row.stationType || 'none',
              routeCoverage: parseFloat(row.routeCoverage) || 0,
            });
          } catch (e) {
            errors.push({ row, error: e.message });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Upload raw file to S3
    if (process.env.AWS_S3_BUCKET) {
      const fileContent = fs.readFileSync(req.file.path);
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `uploads/${Date.now()}-${req.file.originalname}`,
          Body: fileContent,
          ContentType: 'text/csv',
        })
      );
    }

    const ops = results.map((loc) => ({
      updateOne: {
        filter: { name: loc.name, city: loc.city },
        update: { $set: loc },
        upsert: true,
      },
    }));

    const result = await Location.bulkWrite(ops);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Processed ${results.length} locations`,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      errors: errors.length,
    });
  } catch (err) {
    next(err);
  }
};
