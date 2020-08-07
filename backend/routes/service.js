const express = require("express");
const { models } = require("../sequelize");
const extractFiles = require("../middlewares/files");
const files = require("../middlewares/files");

const router = express.Router();

// {TODO: add exception handling}
router.post("", extractFiles, async (req, res) => {
  const { body, files } = req;

  const newService = await models.service.create({
    category: body.category,
    name: body.name,
    estimateUnit: body.estimateUnit,
    priceEstimate: body.priceEstimate,
    description: body.description,
    contact: body.contactNumber,
  });

  locations = body.locations.split(",");
  // add all the locations
  // associate service with all the locations
  for (let i = 0; i < locations.length; ++i) {
    let loc = await models.location.findByPk(locations[i]);
    // create the location if it's not already present
    if (!loc) {
      loc = await models.location.create({ name: locations[i] });
    }
    newService.addLocation(loc);
  }

  // associate all services with the image urls
  for (let i = 0; i < files.length; ++i) {
    await newService.createServiceImage({ url: files[i].path });
  }

  res.status(200).json({
    message: "Service Created",
  });
});

module.exports = router;
