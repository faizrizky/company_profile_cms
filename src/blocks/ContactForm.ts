import type { Block } from 'payload'

import { backgroundFields } from '@/fields/section'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: [
    { name: 'eyebrow', type: 'text', maxLength: 60 },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 160 },
        { name: 'titleMobile', type: 'text', maxLength: 160, label: 'Title (mobile)' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'description', type: 'textarea', maxLength: 300 },
        { name: 'descriptionMobile', type: 'textarea', maxLength: 300, label: 'Description (mobile)' },
      ],
    },
    ...backgroundFields(),
    { name: 'submitLabel', type: 'text', defaultValue: 'Request Consultation', maxLength: 60 },
    { name: 'responseNote', type: 'text', defaultValue: 'Response within 1–2 business days.', maxLength: 120 },
    {
      name: 'interestOptions',
      type: 'text',
      hasMany: true,
      maxRows: 20,
      admin: { description: 'Pilihan dropdown "Consultation Interest".' },
    },
    { name: 'whatsappText', type: 'textarea', maxLength: 200, admin: { rows: 2 } },
    { name: 'successMessage', type: 'text', defaultValue: 'Thank you! Our team will contact you shortly.', maxLength: 200 },
  ],
}
