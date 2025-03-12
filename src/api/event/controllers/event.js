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

    if (!name || !performers || !venue || !address || !date || !time || !description) {
      return ctx.badRequest('Semua field harus diisi!');
    }

    // Buat slug dari nama event
    const slug = slugify(name, { lower: true });

    // Simpan event baru dengan slug
    const newEvent = await strapi.entityService.create('api::event.event', {
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

    return this.transformResponse(newEvent);
  },

  // Tambahkan fungsi update (PUT)
  async update(ctx) {
    const { id } = ctx.params;
    const { name, performers, venue, address, date, time, description } = ctx.request.body.data;

    // Periksa apakah event ada
    const existingEvent = await strapi.entityService.findOne('api::event.event', id);
    if (!existingEvent) {
      return ctx.notFound('Event tidak ditemukan');
    }

    // Buat slug baru jika nama diubah
    let slug = existingEvent.slug;
    if (name && name !== existingEvent.name) {
      slug = slugify(name, { lower: true });
    }

    // Update event
    const updatedEvent = await strapi.entityService.update('api::event.event', id, {
      data: {
        name,
        performers,
        venue,
        address,
        date,
        time,
        description,
        slug,
      },
    });

    return this.transformResponse(updatedEvent);
  },

  // Tambahkan fungsi delete (DELETE)
  async delete(ctx) {
    const { id } = ctx.params;

    // Check if the event exists
    const event = await strapi.entityService.findOne('api::event.event', id);
    if (!event) {
      return ctx.notFound('Event tidak ditemukan');
    }

    // Delete the event
    await strapi.entityService.delete('api::event.event', id);

    return this.transformResponse({ message: 'Event berhasil dihapus' });
  },
}));
