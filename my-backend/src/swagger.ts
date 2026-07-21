import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nepali Restaurant & Bar API',
      version: '1.0.0',
      description: 'Backend API for Nepali Restaurant & Bar management system. Handles menu, events, gallery, reservations, messages, staff, offers, and site configuration.',
      contact: {
        name: 'Nepali Restaurant & Bar',
        url: 'https://nepalirestaurant.iq',
      },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'adminToken',
          description: 'HTTP-only JWT cookie set on login. Required for admin endpoints.',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Not found' },
            details: {
              type: 'array',
              items: { type: 'string' },
              description: 'Validation error details',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 42 },
            totalPages: { type: 'integer', example: 3 },
          },
        },
        MenuItem: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Dal Bhat Set' },
            category: { type: 'string', enum: ['Nepali', 'Indian', 'Chinese', 'Japanese', 'BBQ & Grill', 'Drinks & Bar', 'Desserts'] },
            description: { type: 'string' },
            price: { type: 'string', example: 'IQD 8,500' },
            dietary: { type: 'array', items: { type: 'string' } },
            image: { type: 'string', format: 'uri' },
            featured: { type: 'boolean' },
            visible: { type: 'boolean' },
            sortOrder: { type: 'integer' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            date: { type: 'string', example: 'Jun 14' },
            time: { type: 'string', example: '8:00 PM' },
            title: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string', format: 'uri' },
            type: { type: 'string' },
            active: { type: 'boolean' },
          },
        },
        GalleryImage: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            category: { type: 'string' },
            title: { type: 'string' },
            image: { type: 'string', format: 'uri' },
            order: { type: 'integer' },
            visible: { type: 'boolean' },
          },
        },
        Staff: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
            department: { type: 'string' },
            bio: { type: 'string' },
            image: { type: 'string', format: 'uri' },
            visible: { type: 'boolean' },
            sortOrder: { type: 'integer' },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            date: { type: 'string' },
            time: { type: 'string' },
            guests: { type: 'integer' },
            occasion: { type: 'string' },
            requests: { type: 'string' },
            remarks: { type: 'string' },
            status: { type: 'string', enum: ['Confirmed', 'Pending', 'Cancelled', 'Contacted'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Message: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            subject: { type: 'string' },
            message: { type: 'string' },
            contactType: { type: 'string', enum: ['feedback', 'enquiry', 'other'] },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            verified: { type: 'boolean' },
            read: { type: 'boolean' },
            replied: { type: 'boolean' },
            reply: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Offer: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            pct: { type: 'string', example: '20%' },
            unit: { type: 'string', example: 'OFF' },
            title: { type: 'string' },
            description: { type: 'string' },
            validity: { type: 'string' },
            cta: { type: 'string' },
            active: { type: 'boolean' },
            sortOrder: { type: 'integer' },
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            admin: { type: 'string' },
            action: { type: 'string' },
            resource: { type: 'string' },
            resourceId: { type: 'string' },
            summary: { type: 'string' },
            details: { type: 'object' },
            ip: { type: 'string' },
            userAgent: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        Config: {
          type: 'object',
          properties: {
            acceptingReservations: { type: 'boolean' },
            maxGuests: { type: 'integer' },
            maxDaysAhead: { type: 'integer' },
            slotIntervalMinutes: { type: 'integer' },
            hours: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  open: { type: 'string' },
                  close: { type: 'string' },
                  closed: { type: 'boolean' },
                },
              },
            },
            phoneOne: { type: 'string' },
            phoneTwo: { type: 'string' },
            location: { type: 'string' },
            socialInstagram: { type: 'string' },
            socialFacebook: { type: 'string' },
            showOffers: { type: 'boolean' },
            eventTypes: { type: 'array', items: { type: 'string' } },
            menuCategories: { type: 'array', items: { type: 'string' } },
            galleryCategories: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    paths: {
      // ─── Auth ───
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Admin login',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } } },
          },
          responses: { '200': { description: 'Login successful' }, '401': { description: 'Invalid credentials' } },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Admin logout',
          responses: { '200': { description: 'Logged out' } },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current admin',
          security: [{ cookieAuth: [] }],
          responses: { '200': { description: 'Admin profile' }, '401': { description: 'Not authenticated' } },
        },
      },

      // ─── Menu ───
      '/api/menu': {
        get: {
          tags: ['Menu'],
          summary: 'List menu items (admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'category', schema: { type: 'string' } },
            { in: 'query', name: 'featured', schema: { type: 'string', enum: ['true', 'false'] } },
            { in: 'query', name: 'visible', schema: { type: 'string', enum: ['true', 'false'] } },
            { in: 'query', name: 'sort', schema: { type: 'string', example: '-createdAt' } },
          ],
          responses: { '200': { description: 'Paginated menu items' } },
        },
        post: {
          tags: ['Menu'],
          summary: 'Create menu item',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuItem' } } } },
          responses: { '201': { description: 'Created' }, '400': { description: 'Validation error' } },
        },
      },
      '/api/menu/public': {
        get: {
          tags: ['Menu'],
          summary: 'List public menu items (visible only)',
          parameters: [
            { in: 'query', name: 'category', schema: { type: 'string' } },
            { in: 'query', name: 'featured', schema: { type: 'string', enum: ['true', 'false'] } },
          ],
          responses: { '200': { description: 'Public menu items' } },
        },
      },
      '/api/menu/{id}': {
        get: {
          tags: ['Menu'],
          summary: 'Get menu item by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Menu item' }, '404': { description: 'Not found' } },
        },
        put: {
          tags: ['Menu'],
          summary: 'Update menu item',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/MenuItem' } } } },
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Menu'],
          summary: 'Delete menu item',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/menu/bulk': {
        post: {
          tags: ['Menu'],
          summary: 'Bulk create menu items',
          security: [{ cookieAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' } } } } },
          responses: { '201': { description: 'Items created' } },
        },
      },

      // ─── Events ───
      '/api/events': {
        get: {
          tags: ['Events'],
          summary: 'List events (admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'type', schema: { type: 'string' } },
            { in: 'query', name: 'active', schema: { type: 'string', enum: ['true', 'false'] } },
          ],
          responses: { '200': { description: 'Paginated events' } },
        },
        post: {
          tags: ['Events'],
          summary: 'Create event',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } } },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/events/public': {
        get: {
          tags: ['Events'],
          summary: 'List public events (active only)',
          responses: { '200': { description: 'Active events' } },
        },
      },
      '/api/events/{id}': {
        get: {
          tags: ['Events'],
          summary: 'Get event by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Event' }, '404': { description: 'Not found' } },
        },
        put: {
          tags: ['Events'],
          summary: 'Update event',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Events'],
          summary: 'Delete event',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },

      // ─── Gallery ───
      '/api/gallery': {
        get: {
          tags: ['Gallery'],
          summary: 'List gallery images',
          parameters: [
            { in: 'query', name: 'category', schema: { type: 'string' } },
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'Gallery images' } },
        },
        post: {
          tags: ['Gallery'],
          summary: 'Add gallery image',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GalleryImage' } } } },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/gallery/{id}': {
        delete: {
          tags: ['Gallery'],
          summary: 'Delete gallery image',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },

      // ─── Staff ───
      '/api/staff': {
        get: {
          tags: ['Staff'],
          summary: 'List staff (admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'department', schema: { type: 'string' } },
            { in: 'query', name: 'visible', schema: { type: 'string', enum: ['true', 'false'] } },
          ],
          responses: { '200': { description: 'Paginated staff' } },
        },
        post: {
          tags: ['Staff'],
          summary: 'Create staff member',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Staff' } } } },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/staff/public': {
        get: {
          tags: ['Staff'],
          summary: 'List public staff (visible only)',
          responses: { '200': { description: 'Public staff' } },
        },
      },
      '/api/staff/{id}': {
        put: {
          tags: ['Staff'],
          summary: 'Update staff member',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Staff'],
          summary: 'Delete staff member',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },

      // ─── Reservations ───
      '/api/reservations': {
        get: {
          tags: ['Reservations'],
          summary: 'List reservations (admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['Confirmed', 'Pending', 'Cancelled', 'Contacted', 'all'] } },
            { in: 'query', name: 'date', schema: { type: 'string' } },
            { in: 'query', name: 'dateFrom', schema: { type: 'string' } },
            { in: 'query', name: 'dateTo', schema: { type: 'string' } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Paginated reservations' } },
        },
        post: {
          tags: ['Reservations'],
          summary: 'Create reservation (public)',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Reservation' } } } },
          responses: { '201': { description: 'Created' }, '400': { description: 'Validation error or reCAPTCHA failed' } },
        },
      },
      '/api/reservations/export': {
        get: {
          tags: ['Reservations'],
          summary: 'Export reservations as CSV',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'status', schema: { type: 'string' } },
            { in: 'query', name: 'dateFrom', schema: { type: 'string' } },
            { in: 'query', name: 'dateTo', schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'CSV file' }, '400': { description: 'Too many records (max 10,000)' } },
        },
      },
      '/api/reservations/{id}': {
        get: {
          tags: ['Reservations'],
          summary: 'Get reservation by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Reservation' }, '404': { description: 'Not found' } },
        },
        put: {
          tags: ['Reservations'],
          summary: 'Update reservation',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Reservations'],
          summary: 'Delete reservation',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },

      // ─── Messages ───
      '/api/messages': {
        get: {
          tags: ['Messages'],
          summary: 'List messages (admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'contactType', schema: { type: 'string', enum: ['feedback', 'enquiry', 'other'] } },
            { in: 'query', name: 'verified', schema: { type: 'string', enum: ['true', 'false'] } },
            { in: 'query', name: 'read', schema: { type: 'string', enum: ['true', 'false'] } },
          ],
          responses: { '200': { description: 'Paginated messages' } },
        },
        post: {
          tags: ['Messages'],
          summary: 'Create message (public)',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/messages/{id}': {
        get: {
          tags: ['Messages'],
          summary: 'Get message by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Message' }, '404': { description: 'Not found' } },
        },
        put: {
          tags: ['Messages'],
          summary: 'Update message (mark read/verified/reply)',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Messages'],
          summary: 'Delete message',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },

      // ─── Offers ───
      '/api/offers': {
        get: {
          tags: ['Offers'],
          summary: 'List offers (admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'active', schema: { type: 'string', enum: ['true', 'false'] } },
          ],
          responses: { '200': { description: 'Paginated offers' } },
        },
        post: {
          tags: ['Offers'],
          summary: 'Create offer',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Offer' } } } },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/offers/public': {
        get: {
          tags: ['Offers'],
          summary: 'List public offers (active only)',
          responses: { '200': { description: 'Active offers' } },
        },
      },
      '/api/offers/{id}': {
        get: {
          tags: ['Offers'],
          summary: 'Get offer by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Offer' }, '404': { description: 'Not found' } },
        },
        put: {
          tags: ['Offers'],
          summary: 'Update offer',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Offers'],
          summary: 'Delete offer',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },

      // ─── Audit Log ───
      '/api/audit-log': {
        get: {
          tags: ['Audit Log'],
          summary: 'List audit log entries',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
            { in: 'query', name: 'action', schema: { type: 'string' } },
            { in: 'query', name: 'resource', schema: { type: 'string' } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Paginated audit logs' } },
        },
      },
      '/api/audit-log/export': {
        get: {
          tags: ['Audit Log'],
          summary: 'Export audit log as CSV',
          security: [{ cookieAuth: [] }],
          parameters: [
            { in: 'query', name: 'action', schema: { type: 'string' } },
            { in: 'query', name: 'resource', schema: { type: 'string' } },
            { in: 'query', name: 'from', schema: { type: 'string', format: 'date-time' } },
            { in: 'query', name: 'to', schema: { type: 'string', format: 'date-time' } },
          ],
          responses: { '200': { description: 'CSV file' }, '400': { description: 'Too many records (max 10,000)' } },
        },
      },
      '/api/audit-log/{id}': {
        get: {
          tags: ['Audit Log'],
          summary: 'Get audit log entry',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Audit log entry' }, '404': { description: 'Not found' } },
        },
      },

      // ─── Upload ───
      '/api/upload': {
        post: {
          tags: ['Upload'],
          summary: 'Upload image to Cloudinary',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' }, tags: { type: 'string' } } } } },
          },
          responses: { '200': { description: 'Uploaded image info' } },
        },
        delete: {
          tags: ['Upload'],
          summary: 'Delete image from Cloudinary',
          security: [{ cookieAuth: [] }],
          parameters: [{ in: 'query', name: 'publicId', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },

      // ─── Config ───
      '/api/config': {
        get: {
          tags: ['Config'],
          summary: 'Get site configuration (public)',
          responses: { '200': { description: 'Config object', content: { 'application/json': { schema: { $ref: '#/components/schemas/Config' } } } } },
        },
        post: {
          tags: ['Config'],
          summary: 'Update site configuration',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Config' } } } },
          responses: { '200': { description: 'Updated config' } },
        },
      },

      // ─── Health ───
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: { '200': { description: 'Server is running' } },
        },
      },
    },
  },
  apis: [],
}

export const swaggerSpec = swaggerJsdoc(options)
