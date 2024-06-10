/* stylelint-disable declaration-no-important */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import styled from 'styled-components'
import { rotate360 } from '@coko/client'
import {
  CloseOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  FileMarkdownOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Upload } from 'antd'
import { keys } from 'lodash'
import {
  GET_DOCUMENTS,
  CREATE_DOCUMENT,
  DELETE_DOCUMENT,
} from '../graphql/knowledgeBase.queries'
import Each from '../ui/common/Each'
import { Button, Checkbox } from '../ui'
import UploadHiddenDropZone from '../ui/knowledgeBase/Upload'

const xlFileExtensions = [
  '.xls',
  '.xlsb',
  '.xlsm',
  '.xlsx',
  '.xlt',
  '.xltm',
  '.xltx',
]

const fileIcons = {
  md: { icon: FileMarkdownOutlined, color: '#625286' },
  docx: { icon: FileWordOutlined, color: '#3054a0' },
  pdf: { icon: FilePdfOutlined, color: '#b82727' },
  xmls: { icon: FileExcelOutlined, color: '#429d50' },
  xls: { icon: FileExcelOutlined, color: '#429d50' },
}
// #region STYLED COMPONENTS ----------------------------------------------------

const Spinner = styled.div`
  align-items: center;
  display: flex;
  height: 20px;
  justify-content: center;
  width: 40px;

  &::after {
    animation: ${rotate360} 1s linear infinite;
    border: 2px solid #00495c;
    border-color: #00495c transparent;
    border-radius: 50%;
    border-width: 1px;
    /* stylelint-disable-next-line string-quotes */
    content: ' ';
    display: block;
    height: 20px;
    margin: 1px;
    width: 20px;
  }
`

const Root = styled.div`
  --scrollbar: gainsboro;

  display: flex;
  height: 100%;
  overflow: hidden;
  padding: 0;

  * {
    ::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--scrollbar);
      border-radius: 5px;
      width: 5px;
    }

    ::-webkit-scrollbar-track {
      background: #fff0;
      padding: 5px;
    }
  }

  .ant-spin-container,
  .ant-spin-nested-loading {
    height: 100%;
  }
`

const Header = styled.div`
  align-items: center;
  border-bottom: 1px solid gainsboro;
  display: flex;
  padding: 0 30px 0 0;
  white-space: nowrap;

  h2 {
    color: #999;
    font-size: 28px;
    margin: 0;
    padding: 24px 30px;
    width: 100%;
  }
`

const FilesHeading = styled(Header)`
  font-size: 11px;
  gap: 8px;
  justify-content: space-between;
  padding: 5px 10px 5px 31px;
  text-rendering: optimizeLegibility;
  text-transform: uppercase;

  p {
    margin: 0 30px 0 0;
  }
`

const FilesList = styled(UploadHiddenDropZone)`
  background-color: #f8f8f8;
  height: 100%;
  margin: 0;
  overflow-y: scroll;
  padding: 0;
  position: relative;
  width: 100%;
`

const FileMapRoot = styled.li`
  align-items: center;
  background-color: #ffffff3b;
  border-bottom: 1px solid #0002;
  cursor: pointer;
  display: flex;
  gap: 10px;
  height: fit-content;
  justify-content: space-between;
  padding: 10px 31px;
  transition: transform 0.3s;
  user-select: none;
  width: 100%;
  word-break: break-all;

  svg {
    height: 16px;
    width: 16px;
  }

  > div {
    display: flex;
    gap: 15px;

    > span > svg {
      color: ${p => p.$color};
      height: 40px;
      width: 40px;
    }
  }

  > span {
    align-items: center;
    display: flex;
    gap: 10px;

    > p {
      color: var(--color-blue);
      margin: 0;
    }
  }

  > img {
    filter: grayscale(20%);
    margin-bottom: 10px;
    opacity: 0.85;
    width: 50px;
  }
`

const ActionsSidebar = styled.div`
  border-left: 1px solid gainsboro;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 25%;

  > :first-child {
    background: #f8f8f8;
    border-bottom: 1px solid gainsboro;
    font-size: 11px;
    padding: 9px 15px;
  }
`

const StyledButton = styled(Button)`
  border-bottom: 1px solid gainsboro;
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${p => (p.disabled ? 0.4 : 1)};
  padding: 0.8rem;
`

const UploadButton = styled(Button)`
  border: none;
  outline: none;
  padding: 0;
  text-decoration: underline;
`

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
`

// #endregion STYLED COMPONENTS ----------------------------------------------------
const FilesToUploadMap = ({
  filesToUpload,
  fileBeingUploaded,
  handleUpload,
  setFilesToUpload,
}) => {
  return (
    <Each
      condition={filesToUpload.length > 0}
      of={filesToUpload.filter(Boolean)}
      render={file => (
        <FileMapRoot
          style={{
            filter: 'grayscale(100%)',
            opacity: 0.5,
            background: '#f2f2f2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox disabled />
            {fileBeingUploaded === file.name ? <Spinner /> : <FileOutlined />}
            <p>
              {fileBeingUploaded === file.name
                ? `${file.name || fileBeingUploaded}`
                : `${file.name || fileBeingUploaded} (pending)`}
            </p>
          </div>
          {fileBeingUploaded !== file.name ? (
            <span>
              <UploadOutlined onClick={async () => handleUpload(file)} />
              <CloseOutlined
                onClick={() =>
                  setFilesToUpload(
                    filesToUpload.filter(f => f.uid !== file.uid),
                  )
                }
              />
            </span>
          ) : (
            <span>uploading...</span>
          )}
        </FileMapRoot>
      )}
    />
  )
}

const FilesMap = ({ documents, remove, selectedFiles, setSelectedFiles }) => {
  const select = id => {
    setSelectedFiles(prev => {
      const temp = [...prev]
      !selectedFiles.includes(id)
        ? temp.push(id)
        : temp.splice(selectedFiles.indexOf(id), 1)
      return temp
    })
  }

  const handleRemove = (e, id) => {
    e.stopPropagation()
    e.preventDefault()
    setSelectedFiles(prev => {
      const temp = [...prev]
      temp.splice(selectedFiles.indexOf(id), 1)
      return temp
    })
    remove({ variables: { id } })
  }

  return (
    <Each
      condition={documents?.length > 0}
      of={documents || []}
      render={({ id, extension, name }) => {
        const ext = xlFileExtensions.includes(extension) ? 'xls' : extension
        const { icon, color } = fileIcons[ext]

        const FileIcon = icon

        return (
          <FileMapRoot $color={color} onClick={() => select(id)} title={name}>
            <div style={{ display: 'flex' }}>
              <Checkbox checked={selectedFiles.includes(id)} />
              <FileIcon />
              <span>
                <p>{name}</p>
              </span>
            </div>
            <span>
              <DeleteOutlined
                onClick={e => handleRemove(e, id)}
                title="Delete file"
              />
            </span>
          </FileMapRoot>
        )
      }}
    />
  )
}

export const KnowledgeBasePage = () => {
  // #region REACT Hooks ------------------
  const [docs, setDocs] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [filesToUpload, setFilesToUpload] = useState([])
  const [fileBeingUploaded, setFileBeingUploaded] = useState([])

  useEffect(() => {
    getDocuments()
  }, [])

  // #endregion REACT Hooks ---------------

  // #region GQL Hooks --------------------
  const [getDocuments] = useLazyQuery(GET_DOCUMENTS, {
    onCompleted: data => data?.getDocuments && setDocs(data.getDocuments),
  })

  const [createDocument] = useMutation(CREATE_DOCUMENT, {
    refetchQueries: [GET_DOCUMENTS],
    onError: console.error,
  })

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    refetchQueries: [GET_DOCUMENTS],
  })
  // #endregion GQL Hooks -----------------

  // #region Handlers ---------------------

  const scrollToTopOfFilesList = () => {
    document
      .querySelectorAll('.ant-upload-wrapper')[1] // [1] as long as the other Upload exists on header
      .scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const handleFileChange = ({ file }) => {
    setFilesToUpload(prevFiles => [...prevFiles, file])
    scrollToTopOfFilesList()
  }

  const handleUpload = async file => {
    setFileBeingUploaded(file.name)
    await createDocument({ variables: { file } })
    setFilesToUpload(currentFiles =>
      currentFiles.filter(f => f.uid !== file.uid),
    )
    setFileBeingUploaded('')
  }

  const bulkActions = {
    async upload() {
      try {
        // eslint-disable-next-line no-restricted-syntax
        for await (const file of filesToUpload) {
          await handleUpload(file)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async delete() {
      if (selectedFiles.length < 1) return

      try {
        await Promise.all(
          selectedFiles.map(async id => {
            deleteDocument({ variables: { id } })
          }),
        )
      } catch (error) {
        console.error(error)
      } finally {
        setSelectedFiles([])
      }
    },
    select() {
      selectedFiles.length === docs.length
        ? setSelectedFiles([])
        : setSelectedFiles(docs.map(({ id }) => id))
    },
  }

  const filesToAccept = keys(fileIcons)
    .map(k => `.${k}`)
    .concat(xlFileExtensions)
    .join(',')

  const noFilesNotUploads =
    fileBeingUploaded.length < 1 && docs.length < 1 && filesToUpload.length < 1
  // #endregion Handlers --------------------

  return (
    <Root>
      <MainSection>
        <Header>
          <h2>Knowledge Base</h2>
          Drop your files below or
          <Upload
            accept={filesToAccept}
            customRequest={handleFileChange}
            multiple
            showUploadList={false}
            style={{ paddingRight: '30px' }}
          >
            <UploadButton>
              <p style={{ marginLeft: '1ch' }}>Browse</p>
            </UploadButton>
          </Upload>
        </Header>
        <FilesHeading>
          <Checkbox
            checked={docs.length > 0 && selectedFiles.length === docs.length}
            disabled={docs.length < 1}
            indeterminate={
              selectedFiles.length > 0 && selectedFiles.length < docs.length
            }
            onChange={bulkActions.select}
          >
            <span style={{ paddingLeft: '8px', fontSize: '11px' }}>
              Select all
            </span>
          </Checkbox>
          <p>Selected: {`${selectedFiles.length} / ${docs.length}`}</p>
        </FilesHeading>
        <FilesList
          accept={filesToAccept}
          customRequest={handleFileChange}
          multiple
        >
          {noFilesNotUploads && (
            <p style={{ padding: '20% 0' }}>
              Upload your first document to the knowledge base
            </p>
          )}
          <FilesToUploadMap
            fileBeingUploaded={fileBeingUploaded}
            filesToUpload={filesToUpload}
            handleUpload={handleUpload}
            setFilesToUpload={setFilesToUpload}
          />
          <FilesMap
            documents={docs}
            remove={deleteDocument}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
          />
        </FilesList>
      </MainSection>
      <ActionsSidebar>
        <strong>BULK ACTIONS:</strong>
        <StyledButton
          disabled={filesToUpload.length < 1}
          onClick={filesToUpload.length > 0 ? bulkActions.upload : () => {}}
          type="button"
        >
          Upload all pending files
        </StyledButton>
        <StyledButton
          disabled={selectedFiles.length < 1}
          onClick={bulkActions.delete}
          style={{ color: selectedFiles.length < 1 ? '' : 'red' }}
          type="button"
        >
          Remove selected files from list
        </StyledButton>
      </ActionsSidebar>
    </Root>
  )
}

export default KnowledgeBasePage
