const { prisma } = require("../prisma");

const saveWizard = async (userId, data) => {
  return prisma.wizardState.upsert({
    where: { userId },
    update: {
      step: data.step,

      defunt: {
        upsert: {
          create: data.defunt,
          update: data.defunt
        }
      },

      declarant: {
        upsert: {
          create: data.declarant,
          update: data.declarant
        }
      },

      certs: {
        upsert: {
          create: data.certs,
          update: data.certs
        }
      },

      heirs: {
        deleteMany: {},
        create: data.heirs
      },

      assets: {
        deleteMany: {},
        create: data.assets
      }
    },

    create: {
      userId,
      step: data.step,
      defunt: { create: data.defunt },
      declarant: { create: data.declarant },
      certs: { create: data.certs },
      heirs: { create: data.heirs },
      assets: { create: data.assets }
    }
  });
};

module.exports = {
  saveWizard
};