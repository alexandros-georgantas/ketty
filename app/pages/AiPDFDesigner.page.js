import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import {
  GET_SPECIFIC_TEMPLATES,
  EXPORT_BOOK,
  GET_PAGED_PREVIEWER_LINK,
  GET_ENTIRE_BOOK,
  GET_BOOK_COMPONENT,
} from '../graphql'
import AiPDFDesigner from '../ui/AiPDFDesigner/AiPDFDesigner'
import { CssAssistantContext } from '../ui/AiPDFDesigner/hooks/CssAssistantContext'

const defaultTemplate = 'vanilla'

export const defaultProfile = {
  label: 'New export',
  value: 'new-export',
  format: 'pdf',
  size: '8.5x11',
  content: ['includeTitlePage', 'includeCopyrights', 'includeTOC'],
  template: null,
  isbn: null,
}

const getFormatTarget = format => (format === 'pdf' ? 'pagedjs' : 'epub')

const AiPDFDesignerPage = () => {
  const params = useParams()
  const { setPassedContent } = useContext(CssAssistantContext)
  const { bookId } = params
  const [bookTitle, setBookTitle] = useState('')

  const { data: bookQueryData } = useQuery(GET_ENTIRE_BOOK, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    variables: {
      id: bookId,
    },
  })

  const [getBookChapter] = useLazyQuery(GET_BOOK_COMPONENT, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
  })

  const [getPagedLink] = useLazyQuery(GET_PAGED_PREVIEWER_LINK, {
    onCompleted: ({ getPagedPreviewerLink: { link } }) => {
      // link of the html preview
      // eslint-disable-next-line no-console
      console.log(link)
    },
  })

  const [createPreview] = useMutation(EXPORT_BOOK, {
    onCompleted: ({ exportBook }) => {
      const { path } = exportBook
      const hash = path.split('/')

      getPagedLink({
        variables: {
          hash: hash[0],
        },
      })
    },
  })

  // eslint-disable-next-line no-unused-vars
  const { data: templatesData } = useQuery(GET_SPECIFIC_TEMPLATES, {
    fetchPolicy: 'cache-first',
    variables: {
      where: {
        target: getFormatTarget(defaultProfile.format),
        trimSize: defaultProfile.size,
      },
    },
    onCompleted: res => {
      // use vanilla template by default
      const vanillaTemplate = res?.getSpecificTemplates.find(
        template => template.name === defaultTemplate,
      )

      const previewData = {
        bookId,
        previewer: 'pagedjs',
        templateId: vanillaTemplate.id,
        additionalExportOptions: {
          includeTOC: defaultProfile.content.includes('includeTOC'),
          includeCopyrights:
            defaultProfile.content.includes('includeCopyrights'),
          includeTitlePage: defaultProfile.content.includes('includeTitlePage'),
        },
      }

      createPreview({
        variables: {
          input: previewData,
        },
      })
    },
  })

  useEffect(() => {
    if (bookQueryData?.getBook?.divisions[1]) {
      setBookTitle(bookQueryData?.getBook.title)
      // templatesData && console.log(templatesData)

      const chaptersIds = bookQueryData.getBook.divisions[1].bookComponents.map(
        division => division.id,
      )

      setPassedContent('')
      Promise.all(
        chaptersIds.map((chapterId, i) =>
          getBookChapter({ variables: { id: chapterId } })
            .then(
              ({ data: chapter }) =>
                `<div class="chapter chapter-${i + 1}">${
                  chapter.getBookComponent.content
                }</div>`,
            )
            .catch(e => {
              throw new Error(e)
            }),
        ),
      ).then(chaptersContent => {
        setPassedContent(chaptersContent.join(''))
      })
    }
  }, [bookQueryData])

  return <AiPDFDesigner bookTitle={bookTitle} />
}

export default AiPDFDesignerPage
