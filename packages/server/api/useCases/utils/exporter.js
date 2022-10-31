const cheerio = require('cheerio')
const fs = require('fs-extra')
// const path = require('path')
const config = require('config')
const get = require('lodash/get')
const findIndex = require('lodash/findIndex')
const { epubArchiver } = require('./epubArchiver')
// const crypto = require('crypto')

const {
  cleanHTML,
  cleanDataIdAttributes,
  // vivliostyleDecorator,
} = require('./converters')

const { generateContainer } = require('./htmlGenerators')

const { htmlToEPUB } = require('./htmlToEPUB')
const bookConstructor = require('./bookConstructor')
const { pagednation } = require('./pagednation')
const { icmlArchiver } = require('./icmlArchiver')
const { icmlPreparation } = require('./icmlPreparation')
const { pagedArchiver } = require('./pagedArchiver')
const { scriptsRunner } = require('./scriptsRunner')

const { Template } = require('../../../data-model/src').models

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

const { epubcheckerHandler, icmlHandler, pdfHandler } = require('../services')

const levelMapper = { 0: 'one', 1: 'two', 2: 'three' }

const ExporterService = async (
  bookId,
  mode,
  templateId,
  previewer,
  fileExtension,
  icmlNotes,
  ctx,
) => {
  try {
    let template
    let notesType
    let templateHasEndnotes

    const featureBookStructure =
      config.has('featureBookStructure') &&
      ((config.get('featureBookStructure') &&
        JSON.parse(config.get('featureBookStructure'))) ||
        false)

    if (fileExtension !== 'icml') {
      template = await Template.findById(templateId)
      const { notes } = template
      notesType = notes
      templateHasEndnotes = notesType === 'endnotes'
    } else {
      notesType = icmlNotes
    }

    let resultPath

    // The produced representation of the book holds two Map data types one
    // for the division and one for the book components of each division to
    // ensure the order of things
    const book = await bookConstructor(bookId, templateHasEndnotes, ctx)

    const frontDivision = book.divisions.get('front')
    const backDivision = book.divisions.get('back')

    const tocComponent = frontDivision.bookComponents.get('toc')

    if (featureBookStructure) {
      tocComponent.content = generateContainer(tocComponent, false, 'one')
    } else {
      tocComponent.content = generateContainer(tocComponent, false)
    }

    let endnotesComponent

    if (
      templateHasEndnotes ||
      (fileExtension === 'icml' && icmlNotes === 'endnotes')
    ) {
      endnotesComponent = backDivision.bookComponents.get('endnotes')

      if (featureBookStructure) {
        endnotesComponent.content = generateContainer(
          endnotesComponent,
          false,
          'one',
        )
      } else {
        endnotesComponent.content = generateContainer(endnotesComponent, false)
      }
    }

    const shouldMathML = fileExtension === 'epub'
    book.divisions.forEach((division, divisionId) => {
      let counter = 0
      division.bookComponents.forEach((bookComponent, bookComponentId) => {
        const { componentType } = bookComponent
        const isTheFirstInBody = division.type === 'body' && counter === 0

        if (componentType === 'toc') return

        let container
        let cleanedContent

        if (featureBookStructure) {
          const levelIndex = findIndex(book.bookStructure.levels, {
            type: componentType,
          })

          if (levelIndex !== -1) {
            container = generateContainer(
              bookComponent,
              isTheFirstInBody,
              levelMapper[levelIndex],
            )
            cleanedContent = cleanHTML(
              container,
              bookComponent,
              notesType,
              tocComponent,
              endnotesComponent,
              shouldMathML,
              levelMapper[levelIndex],
            )
          } else {
            container = generateContainer(bookComponent, isTheFirstInBody)
            cleanedContent = cleanHTML(
              container,
              bookComponent,
              notesType,
              tocComponent,
              endnotesComponent,
              shouldMathML,
            )
          }
        } else {
          container = generateContainer(bookComponent, isTheFirstInBody)
          cleanedContent = cleanHTML(
            container,
            bookComponent,
            notesType,
            tocComponent,
            endnotesComponent,
            shouldMathML,
          )
        }

        const { hasMath, content } = cleanedContent
        bookComponent.hasMath = hasMath
        bookComponent.content = cleanDataIdAttributes(content)
        counter += 1
      })
    })

    // Gathering and executing scripts defined by user
    if (fileExtension === 'epub') {
      if (template.exportScripts.length > 0) {
        const bbWithConvertedContent = await scriptsRunner(book, template)
        book.divisions.forEach(division => {
          division.bookComponents.forEach(bookComponent => {
            const { id } = bookComponent

            if (bbWithConvertedContent[id]) {
              bookComponent.content = bbWithConvertedContent[id]
            }
          })
        })
      }
    }

    // Check if notes exist, else remove the book component
    if (templateHasEndnotes) {
      const $endnotes = cheerio.load(endnotesComponent.content)
      const $toc = cheerio.load(tocComponent.content)

      if ($endnotes('ol').length === 0) {
        backDivision.bookComponents.delete('endnotes')

        $toc('.toc-endnotes').remove()

        tocComponent.content = $toc('body').html()
      }
    }

    // if (previewer === 'vivliostyle' || fileExtension === 'epub') {
    if (fileExtension === 'epub') {
      // if (previewer === 'vivliostyle') {
      //   book.divisions.forEach((division, divisionId) => {
      //     division.bookComponents.forEach((bookComponent, bookComponentId) => {
      //       bookComponent.content = vivliostyleDecorator(
      //         bookComponent,
      //         book.title,
      //       )
      //     })
      //   })
      // }

      const tempFolder = await htmlToEPUB(book, template)

      const epubFilePath = await epubArchiver(
        tempFolder,
        `${process.cwd()}/${uploadsDir}/epubs`,
      )

      const epubAbsolutePath = `${process.cwd()}`.concat(epubFilePath)
      resultPath = getResultPath(epubFilePath)
      const { outcome, messages } = await epubcheckerHandler(epubAbsolutePath)

      if (outcome === 'not valid') {
        let errors = ''

        for (let i = 0; i < messages.length; i += 1) {
          const { message } = messages[i]
          errors += `${message} - `
        }

        throw new Error(errors)
      }

      // if (previewer === 'vivliostyle') {
      //   const vivliostyleRoot = `${process.cwd()}/${uploadsDir}/vivliostyle/`
      //   const destination = path.join(
      //     vivliostyleRoot,
      //     `${crypto.randomBytes(32).toString('hex')}`,
      //   )
      //   await fs.ensureDir(destination)
      //   await fs.copy(tempFolder, destination)
      //   await fs.remove(epubFilePath)
      //   resultPath = destination.replace(`${process.cwd()}`, '')
      // }
      await fs.remove(tempFolder)

      return { path: resultPath }
    }

    if (previewer === 'pagedjs' || fileExtension === 'pdf') {
      if (fileExtension === 'pdf') {
        const { hash } = await pagednation(book, template, true)
        const path = require('path')

        await fs.emptyDir(`${process.cwd()}/uploads/pdfs`)
        await fs.ensureDir(`${process.cwd()}/uploads/tmp/${hash}/`)
        const pdfPath = '/uploads/pdfs'
        const resultPath = getResultPath(pdfPath)
        const pdfAbsolutePath = path.join(`${process.cwd()}`, `/uploads/pdfs`)

        const zipFilePath = await pagedArchiver(
          `${process.cwd()}/uploads/paged/${hash}/`,
          `${process.cwd()}/uploads/tmp/${hash}/`,
        )

        await pdfHandler(zipFilePath, pdfAbsolutePath, `${hash}.pdf`)
        await fs.remove(`${process.cwd()}/uploads/tmp/${hash}/`)
        await fs.remove(`${process.cwd()}/uploads/paged/${hash}/`)
        // pagedjs-cli
        return {
          path: `${resultPath}/${hash}.pdf`,
          validationResult: undefined,
        }
      }

      const { clientPath } = await pagednation(book, template)
      return { path: clientPath, validationResult: undefined }
    }

    if (fileExtension === 'icml') {
      const { path: icmlTempFolder } = await icmlPreparation(book)
      await icmlHandler(icmlTempFolder)
      await fs.remove(`${icmlTempFolder}/index.html`)

      const icmlFilePath = await icmlArchiver(
        icmlTempFolder,
        `${process.cwd()}/${uploadsDir}/icmls`,
      )

      const resultPath = getResultPath(icmlFilePath)
      await fs.remove(icmlTempFolder)
      return {
        path: resultPath,
        validationResult: undefined,
      }
    }

    return null
  } catch (e) {
    throw new Error(e)
  }
}

const getResultPath = absolutePath => {
  const serverProtocol = process.env.SERVER_PROTOCOL
  const serverHost = process.env.SERVER_HOST
  const serverPort = process.env.SERVER_PORT

  const serverUrl = `${serverProtocol}://${serverHost}${
    serverPort ? `:${serverPort}` : ''
  }`

  return serverUrl.concat(absolutePath)
}

module.exports = ExporterService
