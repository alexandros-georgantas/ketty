import { DefaultSchema } from 'wax-prosemirror-core'

import {
  InlineAnnotationsService,
  AnnotationToolGroupService,
  ImageService,
  ImageToolGroupService,
  LinkService,
  ListsService,
  ListToolGroupService,
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
  FullScreenService,
  FullScreenToolGroupService,
  TitleToolGroupService,
  disallowPasteImagesPlugin,
} from 'wax-prosemirror-services'

import { TablesService, tableEditing, columnResizing } from 'wax-table-service'

import charactersList from './charactersList'

import { onInfoModal } from '../../../helpers/commonModals'

export default {
  MenuService: [
    {
      templateArea: 'mainMenuToolBar',
      toolGroups: [
        { name: 'Base', exclude: ['Save'] },
        'BlockDropDown',
        'TitleTool',
        'Tables',
        { name: 'Lists', exclude: ['JoinUp'] },
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
    tableEditing(),
    columnResizing(),
    disallowPasteImagesPlugin(() =>
      onInfoModal(
        `Pasting external images is not supported. Please use platform's Asset Manager infrastructure`,
      ),
    ),
  ],

  services: [
    new InlineAnnotationsService(),
    new TitleToolGroupService(),
    new AnnotationToolGroupService(),
    new ImageService(),
    new ImageToolGroupService(),
    new LinkService(),
    new ListsService(),
    new ListToolGroupService(),
    new TablesService(),
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
    new FullScreenService(),
    new FullScreenToolGroupService(),
  ],
}
