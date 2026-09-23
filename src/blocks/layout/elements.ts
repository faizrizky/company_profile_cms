import type { Block, Field } from 'payload'

import { hrefField } from '@/fields/link'
import { imageField } from '@/fields/section'

/**
 * Small building blocks placed inside a Layout Section's columns (visual editor).
 * Every visual option is a design token (never a free CSS value), so whatever
 * editors build stays on-brand and responsive.
 */

const align: Field = {
  name: 'align',
  type: 'select',
  defaultValue: 'left',
  options: [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ],
}

export const BadgeElement: Block = {
  slug: 'badge',
  interfaceName: 'BadgeElement',
  fields: [{ name: 'text', type: 'text', required: true, maxLength: 80 }, align],
}

export const HeadingElement: Block = {
  slug: 'heading',
  interfaceName: 'HeadingElement',
  fields: [
    { name: 'text', type: 'textarea', required: true, maxLength: 200, admin: { rows: 2 } },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'h2',
      options: ['h1', 'h2', 'h3', 'h4'].map((v) => ({ label: v.toUpperCase(), value: v })),
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'lg',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra large', value: 'xl' },
      ],
    },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'accent',
      options: [
        { label: 'Accent (light blue)', value: 'accent' },
        { label: 'White', value: 'white' },
      ],
    },
    align,
  ],
}

export const ParagraphElement: Block = {
  slug: 'paragraph',
  interfaceName: 'ParagraphElement',
  fields: [
    { name: 'text', type: 'textarea', required: true, maxLength: 2000, admin: { rows: 4 } },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'base',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Normal', value: 'base' },
        { label: 'Large', value: 'lg' },
      ],
    },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'White', value: 'default' },
        { label: 'Muted', value: 'muted' },
      ],
    },
    align,
  ],
}

export const ImageElement: Block = {
  slug: 'image',
  interfaceName: 'ImageElement',
  fields: [
    imageField('image', { required: true }),
    {
      name: 'aspect',
      type: 'select',
      defaultValue: 'video',
      options: [
        { label: '16:9', value: 'video' },
        { label: '4:3', value: 'landscape' },
        { label: '1:1', value: 'square' },
        { label: '3:4', value: 'portrait' },
      ],
    },
    { name: 'framed', type: 'checkbox', defaultValue: true, label: 'Glow frame' },
    { name: 'caption', type: 'text', maxLength: 200 },
  ],
}

export const ButtonElement: Block = {
  slug: 'button',
  interfaceName: 'ButtonElement',
  fields: [
    { name: 'label', type: 'text', required: true, maxLength: 80 },
    hrefField(),
    {
      name: 'style',
      type: 'select',
      defaultValue: 'fill',
      options: [
        { label: 'Fill', value: 'fill' },
        { label: 'Outline', value: 'stroke' },
      ],
    },
    align,
  ],
}

export const CardElement: Block = {
  slug: 'card',
  interfaceName: 'CardElement',
  fields: [
    imageField('icon'),
    { name: 'title', type: 'text', required: true, maxLength: 120 },
    { name: 'description', type: 'textarea', maxLength: 500 },
    hrefField({ required: false, admin: { description: 'Opsional. Kartu jadi bisa diklik.' } }),
  ],
}

export const SpacerElement: Block = {
  slug: 'spacer',
  interfaceName: 'SpacerElement',
  fields: [
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra large', value: 'xl' },
      ],
    },
  ],
}

export const elementBlocks = [
  BadgeElement,
  HeadingElement,
  ParagraphElement,
  ImageElement,
  ButtonElement,
  CardElement,
  SpacerElement,
]
