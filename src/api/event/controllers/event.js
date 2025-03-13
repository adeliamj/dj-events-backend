'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const slugify = require('slugify').default;
// const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = createCoreController('api::event.event', ({ strapi }) => ({
  // Override the create method to add custom logic
  async create(ctx) {
    const { name, performers, venue, address, date, time, description } = ctx.request.body.data;

    if (!name || !performers || !venue || !address || !date || !time || !description) {
      return ctx.badRequest('Semua field harus diisi!');
    }

    // Pastikan pengguna terautentikasi
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Anda harus login untuk membuat event');
    }

    // Buat slug dari nama event
    const slug = slugify(name, { lower: true });

    // Simpan event baru dengan relasi ke user
    const newEvent = await strapi.entityService.create('api::event.event', {
      data: {
        name,
        performers,
        venue,
        address,
        date,
        time,
        description,
        slug,
        user: user.id,  // Hubungkan event ke user yang membuatnya
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

  // create event with linked user
  // async create(ctx) {
  //   let entity;
  //   if (ctx.is('multipart')) {
  //     const { data, files } = parseMultipartData(ctx);
  //     data.author = ctx.state.user.id;
  //     entity = await strapi.services.events.create(data, { files });
  //   } else {
  //     ctx.request.body.author = ctx.state.user.id;
  //     entity = await strapi.services.events.create(ctx.request.body);
  //   }
  //   return sanitizeEntity(entity, { model: strapi.models.events });
  // },

  // // update user event
  // async update(ctx) {
  //   const { id } = ctx.params;

  //   let entity;

  //   const [events] = await strapi.services.events.find({
  //     id: ctx.params.id,
  //     'user.id': ctx.state.user.id,
  //   });

  //   if (!events) {
  //     return ctx.unauthorized(`You can't update this entry`);
  //   }

  //   if (ctx.is('multipart')) {
  //     const { data, files } = parseMultipartData(ctx);
  //     entity = await strapi.services.events.update({ id }, data, {
  //       files,
  //     });
  //   } else {
  //     entity = await strapi.services.events.update({ id }, ctx.request.body);
  //   }

  //   return sanitizeEntity(entity, { model: strapi.models.events });
  // },

  // // delete a user event
  // async delete(ctx) {
  //   const { id } = ctx.params;

  //   let entity;

  //   const [events] = await strapi.services.events.find({
  //     id: ctx.params.id,
  //     'user.id': ctx.state.user.id,
  //   });

  //   if (!events) {
  //     return ctx.unauthorized(`You can't update this entry`);
  //   }

  //   if (ctx.is('multipart')) {
  //     const { data, files } = parseMultipartData(ctx);
  //     entity = await strapi.services.events.update({ id }, data, {
  //       files,
  //     });
  //   } else {
  //     entity = await strapi.services.events.update({ id }, ctx.request.body);
  //   }

  //   return sanitizeEntity(entity, { model: strapi.models.events });
  // },

  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('No user found');
    }

    const events = await strapi.entityService.findMany('api::event.event', {
      filters: { user: user.id },
      populate: '*',
    });

    if (!events || events.length === 0) {
      return ctx.notFound('No events found for this user');
    }

    return events;
  },

  async count(ctx) {
    const count = await strapi.entityService.count('api::event.event');
    return this.transformResponse({ count });
  }

}));
