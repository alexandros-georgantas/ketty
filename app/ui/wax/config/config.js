import { DefaultSchema } from 'wax-prosemirror-core'

import {
  InlineAnnotationsService,
  AnnotationToolGroupService,
  ImageService,
  ImageToolGroupService,
  LinkService,
  ListsService,
  ListToolGroupService,
  // TablesService,
  // TableToolGroupService,
  BaseService,
  BaseToolGroupService,
  DisplayBlockLevelService,
  DisplayToolGroupService,
  TextBlockLevelService,
  TextToolGroupService,
  SpecialCharactersService,
  SpecialCharactersToolGroupService,
  BlockDropDownToolGroupService,
  FindAndReplaceService,
  // FindAndReplaceToolGroupService,
  FullScreenService,
  FullScreenToolGroupService,
  TitleToolGroupService,
} from 'wax-prosemirror-services'

import charactersList from './charactersList'

export default {
  MenuService: [
    {
      templateArea: 'mainMenuToolBar',
      toolGroups: [
        { name: 'Base', exclude: ['Save'] },
        'BlockDropDown',
        'TitleTool',
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

  services: [
    new InlineAnnotationsService(),
    new TitleToolGroupService(),
    new AnnotationToolGroupService(),
    new ImageService(),
    new ImageToolGroupService(),
    new LinkService(),
    new ListsService(),
    new ListToolGroupService(),
    // new TablesService(),
    // new TableToolGroupService(),
    new BaseService(),
    new BaseToolGroupService(),
    new DisplayBlockLevelService(),
    new DisplayToolGroupService(),
    new TextBlockLevelService(),
    new TextToolGroupService(),
    new SpecialCharactersService(),
    new SpecialCharactersToolGroupService(),
    new BlockDropDownToolGroupService(),
    new FindAndReplaceService(),
    // new FindAndReplaceToolGroupService(),
    new FullScreenService(),
    new FullScreenToolGroupService(),
  ],
}
