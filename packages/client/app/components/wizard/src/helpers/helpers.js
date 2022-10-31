import findIndex from 'lodash/findIndex'
// import cloneDeep from 'lodash/cloneDeep'

const uuid = require('uuid/v4')

const levelIndexExtractor = (levels, levelId) =>
  findIndex(levels, { id: levelId })

const cloneOutlineItem = (
  levels,
  levelId,
  item,
  thirdLevelParentId = undefined,
) => {
  const levelIndex = levelIndexExtractor(levels, levelId)
  if (levelIndex === -1) {
    throw new Error('level id does not exist')
  }
  const clonedItem = JSON.parse(JSON.stringify(item))
  if (levelIndex === 0) {
    const topParentId = uuid()
    clonedItem.id = topParentId
    clonedItem.children.forEach(child => {
      child.parentId = topParentId
      const itemId = uuid()
      child.id = itemId

      if (levels.length > 2) {
        child.children.forEach(levelThreeItem => {
          levelThreeItem.parentId = itemId
          levelThreeItem.id = uuid()
        })
      }
    })
  }
  if (levelIndex === 1) {
    const itemId = uuid()
    clonedItem.id = itemId
    if (levels.length > 2) {
      clonedItem.children.forEach(child => {
        child.parentId = itemId
        child.id = uuid()
      })
    }
  }
  if (levelIndex === 2) {
    const itemId = uuid()
    clonedItem.id = itemId
    clonedItem.parentId = thirdLevelParentId
    // if (levels.length > 2) {
    //   clonedItem.children.forEach(child => {
    //     child.parentId = itemId
    //     child.id = uuid()
    //   })
    // }
  }

  return clonedItem
}

const outlineItemGenerator = (
  levels,
  levelId,
  parentId = undefined,
  topId = undefined,
) => {
  const levelIndex = levelIndexExtractor(levels, levelId)
  if (levelIndex === -1) {
    console.error('level id does not exist')
    return undefined
  }

  const numberOfLevels = bookStructureLevelsNormalizer(levels).length

  switch (levelIndex) {
    case 1: {
      if (!parentId) {
        console.error('parentId is undefined')
        return undefined
      }
      const outlineIdLevelTwo = uuid()
      if (numberOfLevels === 2) {
        const outlineIdLevelThree = uuid()
        return {
          id: outlineIdLevelTwo,
          title: null,
          parentId,
          type: levels[levelIndex].type,
          children: [
            {
              id: outlineIdLevelThree,
              parentId: outlineIdLevelTwo,
              title: null,
              type: levels[2].type,
              children: [],
            },
          ],
        }
      }
      return {
        id: outlineIdLevelTwo,
        title: null,
        parentId,
        type: levels[levelIndex].type,
        children: [],
      }
    }
    case 2: {
      if (!parentId) {
        console.error('parentId is undefined')
        return undefined
      }
      return {
        id: uuid(),
        parentId,
        title: null,
        type: levels[levelIndex].type,
        children: [],
      }
    }
    default: {
      const outlineIdLevelOne = uuid()
      const outlineIdLevelTwo = uuid()

      if (numberOfLevels === 2) {
        const outlineIdLevelThree = uuid()

        return {
          id: outlineIdLevelOne,
          title: null,
          parentId: outlineIdLevelOne,
          type: levels[levelIndex].type,
          children: [
            {
              id: outlineIdLevelTwo,
              parentId: outlineIdLevelOne,
              title: null,
              type: levels[1].type,
              children: [
                {
                  id: outlineIdLevelThree,
                  parentId: outlineIdLevelTwo,
                  title: null,
                  type: levels[2].type,
                },
              ],
            },
          ],
        }
      }

      return {
        id: outlineIdLevelOne,
        title: null,
        parentId: outlineIdLevelOne,
        type: levels[levelIndex].type,
        children: [
          {
            id: outlineIdLevelTwo,
            parentId: outlineIdLevelOne,
            title: null,
            type: levels[1].type,
            children: [],
          },
        ],
      }
    }
  }
}

const reorderArrayItems = (array, from, to) => {
  // Make sure a valid array is provided
  if (Object.prototype.toString.call(array) !== '[object Array]') {
    throw new Error('Please provide a valid array')
  }

  // Delete the item from it's current position
  const item = array.splice(from, 1)

  // Make sure there's an item to move
  if (!item.length) {
    throw new Error(`There is no item in the array at index ${from}`)
  }
  array.splice(to, 0, item[0])
  // Move the item to its new position
  return array
}

// This method normalize conceptually the number of book structure levels
// as the Section level is always present and considered content it should be removed
// the same applies also to Chapter Closers level
// The output will be either 1 or 2 corresponding to only Chapters (1) or Parts and Chapters (2)
const bookStructureLevelsNormalizer = levels => {
  const clonedLevels = JSON.parse(JSON.stringify(levels))
  if (levels.length === 3) {
    clonedLevels.splice(2, 1)
    clonedLevels.splice(1, 1)
  }
  if (levels.length === 4) {
    clonedLevels.splice(3, 1)
    clonedLevels.splice(2, 1)
  }
  return clonedLevels
}

export {
  outlineItemGenerator,
  levelIndexExtractor,
  reorderArrayItems,
  cloneOutlineItem,
  bookStructureLevelsNormalizer,
}
