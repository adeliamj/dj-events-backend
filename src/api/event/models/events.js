import slugify from 'slugify';

export default {
    lifecycles: {
        beforeCreate: async (data) => {
            console.log("Data sebelum slugify:", data); //Log data sebelum perubahan
            if (data.name) {
                data.slug = slugify(data.name, { lower: true });
                console.log("Slug setelah slugify:", data.slug); //Log slug yang dihasilkan
            } else {
                console.log("Field 'name' tidak ada atau kosong");
            }
        },
        beforeUpdate: async (params, data) => {
            console.log("Data sebelum slugify:", data); //Log data sebelum perubahan
            if (data.name) {
                data.slug = slugify(data.name, { lower: true });
                console.log("Slug setelah slugify:", data.slug); //Log slug yang dihasilkan
            } else {
                console.log("Field 'name' tidak ada atau kosong");
            }
        },
    },
};
