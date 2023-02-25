import cors from '@fastify/cors';
import { fastify } from 'fastify';
import swagger from '@fastify/swagger';
import { PrismaClient } from '@prisma/client';
import { Type, Static } from '@sinclair/typebox';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const prisma = new PrismaClient();

const app = fastify({
  ajv: {
    customOptions: {
      keywords: ['collectionFormat'],
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

app.register(swagger, {
  hideUntagged: true,
  openapi: {
    info: {
      title: 'Médicaments vétérinaire de France',
      description: `Une API permettant d'accéder aux données de la base de données des médicaments vétérinaires de France.`,
      version: '0.0.1',
    },
    externalDocs: {
      url: 'https://www.data.gouv.fr/fr/datasets/base-de-donnees-publique-des-medicaments-veterinaires-autorises-en-france-1/',
      description: `Plus d'informations ici`,
    },
  },
});

app.register(cors, { origin: true });

app.register(async (app) => {
  app.get('/swagger.json', async () => app.swagger());

  app.get('/', async (request, reply) => {
    reply.header('Content-Type', 'text/html');
    reply.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>French veterinary drugs API</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
            rel="stylesheet"
          />

          <style>
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div id="redoc-container"></div>
          <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0-rc.75/bundles/redoc.standalone.min.js"></script>
          <script src="https://cdn.jsdelivr.net/gh/wll8/redoc-try@1.4.1/dist/try.js"></script>
          <script>initTry('/swagger.json')</script>
        </body>
      </html>
    `);
  });
});

const DrugQuery = Type.Object({
  perPage: Type.Optional(
    Type.Number({
      default: 10,
      description: 'Nombre de médicaments à récupérer par page',
      maximum: 100,
    }),
  ),
  page: Type.Optional(
    Type.Number({
      default: 1,
      description: 'À partir de quelle page récupérer les médicament',
      minimum: 1,
    }),
  ),
  search: Type.Optional(
    Type.String({
      description: 'Recherche par nom de médicament',
    }),
  ),
});
type DrugQueryType = Static<typeof DrugQuery>;

const DrugResponse = Type.Object({
  meta: Type.Object({
    total: Type.Number(),
    perPage: Type.Number(),
    currentPage: Type.Number(),
    lastPage: Type.Number(),
    firstPage: Type.Number(),
  }),
  data: Type.Array(
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
      identifier: Type.Number(),
      authorizationNumber: Type.String(),
      authorizedSellingDate: Type.String(),
      natureId: Type.Number(),
      ownerId: Type.Number(),
      procedureTypeId: Type.Number(),
      authorizationStatusId: Type.Number(),
      medicalFormId: Type.Number(),
      excipientsQSPId: Type.Number(),
      createdAt: Type.String(),
      updatedAt: Type.String(),
    }),
  ),
});

const DrugDetailResponse = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  identifier: Type.Number(),
  authorizationNumber: Type.String(),
  authorizedSellingDate: Type.String(),
  natureId: Type.Number(),
  ownerId: Type.Number(),
  procedureTypeId: Type.Number(),
  authorizationStatusId: Type.Number(),
  medicalFormId: Type.Number(),
  excipientsQSPId: Type.Number(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  nature: Type.Object({
    id: Type.Number(),
    description: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
  owner: Type.Object({
    id: Type.Number(),
    description: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
  procedureType: Type.Object({
    id: Type.Number(),
    description: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
  authorizationStatus: Type.Object({
    id: Type.Number(),
    description: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
  medicalForm: Type.Object({
    id: Type.Number(),
    description: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
  excipientsQSP: Type.Object({
    id: Type.Number(),
    description: Type.String(),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
  administrationRoutes: Type.Array(
    Type.Object({
      id: Type.Number(),
      description: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String(),
    }),
  ),
  ATCVETCodes: Type.Array(
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String(),
    }),
  ),
  composition: Type.Array(
    Type.Object({
      quantity: Type.Optional(Type.Number()),
      unit: Type.Optional(Type.String()),
      drugId: Type.Number(),
      activeSubstanceId: Type.Number(),
      activeSubstance: Type.Object({
        id: Type.Number(),
        description: Type.String(),
        createdAt: Type.String(),
        updatedAt: Type.String(),
      }),
    }),
  ),
  deliveryConditions: Type.Array(
    Type.Object({
      id: Type.Number(),
      description: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String(),
    }),
  ),
  paragraph: Type.Array(
    Type.Object({
      id: Type.Number(),
      validationDate: Type.String(),
      RCPLink: Type.String(),
      createdAt: Type.String(),
      updatedAt: Type.String(),
      drugId: Type.Number(),
      paragraphs: Type.Array(
        Type.Object({
          id: Type.Number(),
          titleId: Type.Number(),
          content: Type.String(),
          createdAt: Type.String(),
          updatedAt: Type.String(),
          title: Type.Object({
            id: Type.Number(),
            description: Type.String(),
            createdAt: Type.String(),
            updatedAt: Type.String(),
          }),
          RCPParagraphs: Type.Object({
            id: Type.Number(),
            validationDate: Type.String(),
            RCPLink: Type.String(),
            createdAt: Type.String(),
            updatedAt: Type.String(),
            drugId: Type.Number(),
          }),
        }),
      ),
    }),
  ),
});

// Drugs
app.register(
  async (app) => {
    app.route<{ Querystring: DrugQueryType }>({
      method: 'GET',
      url: '',
      schema: {
        description: `Récupère la liste des médicaments vétérinaires`,
        summary: `Récupère la liste des médicaments vétérinaires`,
        tags: ['drugs'],
        querystring: DrugQuery,
        response: {
          200: DrugResponse,
        },
      },
      async handler(request) {
        const currentPage = request.query.page ?? 1;
        const page = currentPage - 1;
        const perPage = request.query.perPage ?? 10;
        const skip = page * perPage;

        const theSearch = `${request.query.search ?? ''}`;

        console.log({ theSearch });

        const total = await prisma.drug.count({
          where: { name: { contains: theSearch } },
        });
        const data = await prisma.drug.findMany({
          skip,
          take: perPage,
          where: { name: { contains: theSearch } },
        });

        const lastPage = Math.ceil(total / perPage);

        return {
          meta: {
            total,
            perPage,
            currentPage,
            lastPage,
            firstPage: 1,
          },
          data,
        };
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère un médicament vétérinaire par son identifiant`,
        summary: `Récupère un médicament vétérinaire par son identifiant`,
        tags: ['drugs'],
        params: {
          id: {
            type: 'number',
            description: 'Identifiant du médicament vétérinaire',
          },
        },
        response: {
          200: DrugDetailResponse,
        },
      },
      async handler(request) {
        const drug = await prisma.drug.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
          include: {
            nature: true,
            owner: true,
            procedureType: true,
            authorizationStatus: true,
            medicalForm: true,
            excipientsQSP: true,
            administrationRoutes: true,
            ATCVETCodes: true,
            composition: { include: { activeSubstance: true } },
            deliveryConditions: true,
            paragraph: {
              include: {
                paragraphs: { include: { title: true, RCPParagraphs: true } },
              },
            },
            primaryPackaging: true,
            saleVariants: true,
            speciesDestinations: true,
          },
        });

        return drug;
      },
    });
  },
  { prefix: '/drugs' },
);

// natures
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Natures de médicament (chimique, immunologique, homéopathique)`,
        summary: `Natures de médicament (chimique, immunologique, homéopathique)`,
        tags: ['natures'],
      },
      async handler() {
        const natures = await prisma.nature.findMany();

        return natures;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère une nature de médicament par son identifiant`,
        summary: `Récupère une nature de médicament par son identifiant`,
        tags: ['natures'],
        params: {
          id: {
            type: 'number',
            description: 'Identifiant de la nature de médicament',
          },
        },
      },
      async handler(request) {
        const nature = await prisma.nature.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return nature;
      },
    });
  },
  { prefix: '/natures' },
);

// owners
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Titulaires`,
        summary: `Titulaires`,
        tags: ['owners'],
      },
      async handler() {
        const natures = await prisma.nature.findMany();

        return natures;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère un titulaire de médicament par son identifiant`,
        summary: `Récupère un titulaire de médicament par son identifiant`,
        tags: ['owners'],
        params: {
          id: {
            type: 'number',
            description: 'Identifiant du titulaire de médicament',
          },
        },
      },
      async handler(request) {
        const owner = await prisma.owner.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return owner;
      },
    });
  },
  { prefix: '/owners' },
);

// procedureTypes
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Types de procédure (Nationale, Centralisée, Décentralisée, Reconnaissance mutuelle)`,
        summary: `Types de procédure (Nationale, Centralisée, Décentralisée, Reconnaissance mutuelle)`,
        tags: ['procedureTypes'],
      },
      async handler() {
        const procedureTypes = await prisma.procedureType.findMany();

        return procedureTypes;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère un type de procédure de médicament par son identifiant`,
        summary: `Récupère un type de procédure de médicament par son identifiant`,
        tags: ['procedureTypes'],
        params: {
          id: {
            type: 'number',
            description: 'Identifiant du type de procédure de médicament',
          },
        },
      },
      async handler(request) {
        const procedureType = await prisma.procedureType.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return procedureType;
      },
    });
  },
  { prefix: '/procedure-types' },
);

// authorizationStatus
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Statuts de l’autorisation`,
        summary: `Statuts de l’autorisation`,
        tags: ['authorizationStatus'],
      },
      async handler() {
        const authorizationStatus = await prisma.authorizationStatus.findMany();

        return authorizationStatus;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère un statut d'authorization de médicament par son identifiant`,
        summary: `Récupère un statut d'authorization de médicament par son identifiant`,
        tags: ['authorizationStatus'],
        params: {
          id: {
            type: 'number',
            description: "Identifiant du statut d'authorization de médicament",
          },
        },
      },
      async handler(request) {
        const authorizationStatus = await prisma.authorizationStatus.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return authorizationStatus;
      },
    });
  },
  { prefix: '/authorizationStatus' },
);

// medicalForms
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Formes pharmaceutiques`,
        summary: `Formes pharmaceutiques`,
        tags: ['medicalForms'],
      },
      async handler() {
        const medicalForms = await prisma.medicalForm.findMany();

        return medicalForms;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère une forme pharmaceutique de médicament par son identifiant`,
        summary: `Récupère une forme pharmaceutique de médicament par son identifiant`,
        tags: ['medicalForms'],
        params: {
          id: {
            type: 'number',
            description: "Identifiant de la forme pharmaceutique d'un médicament",
          },
        },
      },
      async handler(request) {
        const medicalForm = await prisma.medicalForm.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return medicalForm;
      },
    });
  },
  { prefix: '/medical-forms' },
);

// speciesDestination
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Espèces de destination`,
        summary: `Espèces de destination`,
        tags: ['speciesDestination'],
      },
      async handler() {
        const speciesDestination = await prisma.speciesDestination.findMany();

        return speciesDestination;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère un espèces de destination de médicament par son identifiant`,
        summary: `Récupère un espèces de destination de médicament par son identifiant`,
        tags: ['speciesDestination'],
        params: {
          id: {
            type: 'number',
            description: 'Identifiant du espèces de destination de médicament',
          },
        },
      },
      async handler(request) {
        const speciesDestination = await prisma.speciesDestination.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return speciesDestination;
      },
    });
  },
  { prefix: '/species-destination' },
);

// activeSubstances
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Substances actives`,
        summary: `Substances actives`,
        tags: ['activeSubstances'],
      },
      async handler() {
        const activeSubstances = await prisma.activeSubstance.findMany();

        return activeSubstances;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère une Substances actives de médicament par son identifiant`,
        summary: `Récupère une Substances actives de médicament par son identifiant`,
        tags: ['activeSubstances'],
        params: {
          id: {
            type: 'number',
            description: 'Identifiant de la Substances actives du médicament',
          },
        },
      },
      async handler(request) {
        const activeSubstance = await prisma.activeSubstance.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return activeSubstance;
      },
    });
  },
  { prefix: '/active-substances' },
);

// administrationRoutes
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Voies d’administration`,
        summary: `Voies d’administration`,
        tags: ['administrationRoutes'],
      },
      async handler() {
        const administrationRoutes = await prisma.administrationRoute.findMany();

        return administrationRoutes;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère un titulaire de médicament par son identifiant`,
        summary: `Récupère un titulaire de médicament par son identifiant`,
        tags: ['administrationRoutes'],
        params: {
          id: {
            type: 'number',
            description: 'Identifiant du titulaire de médicament',
          },
        },
      },
      async handler(request) {
        const administrationRoute = await prisma.administrationRoute.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return administrationRoute;
      },
    });
  },
  { prefix: '/administration-routes' },
);

// deliveryConditions
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Titulaires`,
        summary: `Titulaires`,
        tags: ['deliveryConditions'],
      },
      async handler() {
        const deliveryConditions = await prisma.deliveryCondition.findMany();

        return deliveryConditions;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère une Conditions de délivrance d'un médicament par son identifiant`,
        summary: `Récupère une Conditions de délivrance d'un médicament par son identifiant`,
        tags: ['deliveryConditions'],
        params: {
          id: {
            type: 'number',
            description: "Identifiant d'une Conditions de délivrance d'un médicament",
          },
        },
      },
      async handler(request) {
        const deliveryCondition = await prisma.deliveryCondition.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return deliveryCondition;
      },
    });
  },
  { prefix: '/delivery-conditions' },
);

// excipientsQSP
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Excipients QSP`,
        summary: `Excipients QSP`,
        tags: ['excipientsQSP'],
      },
      async handler() {
        const excipientsQSP = await prisma.excipientQSP.findMany();

        return excipientsQSP;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère un de l'Excipients QSP d'un médicament par son identifiant`,
        summary: `Récupère un de l'Excipients QSP d'un médicament par son identifiant`,
        tags: ['excipientsQSP'],
        params: {
          id: {
            type: 'number',
            description: "Identifiant de l'Excipients QSP d'un médicament",
          },
        },
      },
      async handler(request) {
        const excipientQSP = await prisma.excipientQSP.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return excipientQSP;
      },
    });
  },
  { prefix: '/excipients-qsp' },
);

// paragraphsTitles
app.register(
  async (app) => {
    app.route({
      method: 'GET',
      url: '',
      schema: {
        description: `Titres des paragraphes du Résumé des Caractéristiques du Produit (RCP)`,
        summary: `Titres des paragraphes du Résumé des Caractéristiques du Produit (RCP)`,
        tags: ['paragraphsTitles'],
      },
      async handler() {
        const paragraphTitles = await prisma.paragraphTitle.findMany();

        return paragraphTitles;
      },
    });

    app.route<{ Params: { id: number } }>({
      method: 'GET',
      url: '/:id',
      schema: {
        description: `Récupère un titre de paragraphe de médicament par son identifiant`,
        summary: `Récupère un titre de paragraphe de médicament par son identifiant`,
        tags: ['paragraphsTitles'],
        params: {
          id: {
            type: 'number',
            description: "Identifiant d'un titre de paragraphe de médicament",
          },
        },
      },
      async handler(request) {
        const paragraphTitle = await prisma.paragraphTitle.findUniqueOrThrow({
          where: {
            id: request.params.id,
          },
        });

        return paragraphTitle;
      },
    });
  },
  { prefix: '/paragraphs-titles' },
);

app
  .listen({
    host: '0.0.0.0',
    port: 8080,
  })
  .then(console.log);
