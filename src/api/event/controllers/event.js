'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const slugify = require('slugify').default;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({
  // Override the create method to add custom logic
  async create(ctx) {
    const { name, performers, venue, address, date, time, description } = ctx.request.body.data;

    // Buat slug dari nama event
    const slug = slugify(name, { lower: true });

    // Simpan event baru dengan slug
    const newEvent = await strapi.services['api::event.event'].create({
      data: {
        name,
        performers,
        venue,
        address,
        date,
        time,
        description,
        slug, // Pastikan slug disertakan
      },
    });

    // Kembalikan event dengan slug
    return this.transformResponse(newEvent);
  },
}));
