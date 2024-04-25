/* eslint-disable import/no-extraneous-dependencies */
import {
  InlineAnnotationsService,
  LinkService,
  ListsService,
  MathService,
  SpecialCharactersService,
  DisplayBlockLevelService,
  TextBlockLevelService,
  BlockDropDownToolGroupService,
} from 'wax-prosemirror-services'

import { DefaultSchema } from 'wax-prosemirror-core'

export default {
  MenuService: [
    {
      templateArea: 'topBar',
      toolGroups: [
        {
          name: 'Display',
          include: ['Title', 'Heading2', 'Heading3'],
        },
        {
          name: 'Text',
          include: ['Paragraph'],
        },
        {
          name: 'Annotations',
          // include: ['Strong', 'Emphasis', 'Link'],
          exclude: [
            'Code',
            'StrikeThrough',
            'Underline',
            'SmallCaps',
            'Superscript',
            'Subscript',
          ],
        },
        {
          name: 'Lists',
          exclude: ['JoinUp', 'Lift'],
        },
      ],
    },
  ],

  SchemaService: DefaultSchema,

  ImageService: { showAlt: true },

  services: [
    new LinkService(),
    new ListsService(),
    new InlineAnnotationsService(),
    new MathService(),
    new SpecialCharactersService(),
    new DisplayBlockLevelService(),
    new TextBlockLevelService(),
    new BlockDropDownToolGroupService(),
  ],
}
