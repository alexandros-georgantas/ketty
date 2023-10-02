import { DefaultSchema } from 'wax-prosemirror-core'

import {
  InlineAnnotationsService,
  ImageService,
  LinkService,
  ListsService,
  BaseService,
  DisplayBlockLevelService,
  TextBlockLevelService,
  SpecialCharactersService,
  BlockDropDownToolGroupService,
  FindAndReplaceService,
  // FindAndReplaceToolGroupService,
  FullScreenService,
  disallowPasteImagesPlugin,
} from 'wax-prosemirror-services'

import charactersList from './charactersList'

export default {
  MenuService: [
    {
      templateArea: 'mainMenuToolBar',
      toolGroups: [
        { name: 'Base', exclude: ['Save'] },
        'BlockDropDown',
        { name: 'Lists', exclude: ['JoinUp'] },
        // {
        //   name: 'Text',
        //   exclude: [
        //     'ExtractPoetry',
        //     'ExtractProse',
        //     'ParagraphContinued',
        //     'Subscript',
        //     'SourceNote',
        //     'Paragraph',
        //   ],
        // },
        'Images',
        {
          name: 'Annotations',
          exclude: [
            'Code',
            'SmallCaps',
            'StrikeThrough',
            'Subscript',
            'Superscript',
          ],
        },
        'SpecialCharacters',
        'FindAndReplaceTool',
        'FullScreen',
      ],
    },
  ],

  SchemaService: DefaultSchema,
  SpecialCharactersService: charactersList,
  PmPlugins: [
    disallowPasteImagesPlugin(() =>
      onInfoModal(
        `Pasting external images is not supported. Please use platform's Asset Manager infrastructure`,
      ),
    ),
  ],

  services: [
    new InlineAnnotationsService(),
    new ImageService(),
    new LinkService(),
    new ListsService(),
    new BaseService(),
    new DisplayBlockLevelService(),
    new TextBlockLevelService(),
    new SpecialCharactersService(),
    new BlockDropDownToolGroupService(),
    new FindAndReplaceService(),
    // new FindAndReplaceToolGroupService(),
    new FullScreenService(),
  ],
}
