import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated, nobody } from '@/access'
import { submitContactEndpoint } from '@/endpoints/submitContact'
import { auditCollection } from '@/hooks/auditLog'

const audit = auditCollection('contact-submissions')

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Contact Submission', plural: 'Contact Submissions' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'organization', 'email', 'status', 'createdAt'],
    group: 'Inbox',
  },
  access: {
    // Visitors never write here directly: the frontend server forwards
    // validated submissions through the authenticated endpoint below.
    create: nobody,
    read: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  endpoints: [submitContactEndpoint],
  hooks: {
    afterChange: audit.afterChange,
    afterDelete: audit.afterDelete,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Done', value: 'done' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'fullName', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'organization', type: 'text', required: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, admin: { readOnly: true } },
        { name: 'phone', type: 'text', required: true, admin: { readOnly: true } },
      ],
    },
    { name: 'interest', type: 'text', admin: { readOnly: true } },
    { name: 'message', type: 'textarea', admin: { readOnly: true } },
    { name: 'internalNotes', type: 'textarea' },
    {
      name: 'meta',
      type: 'group',
      admin: { readOnly: true, position: 'sidebar' },
      fields: [
        { name: 'ip', type: 'text' },
        { name: 'userAgent', type: 'text' },
      ],
    },
  ],
}
