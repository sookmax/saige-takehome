import { expect, test } from 'vitest'
import { getPageIndices } from '../src/lib/pagination'

const testCases: [number, (number | '...')[]][] = [
  [0, [0, 1, 2, 3, 4, '...', 13]],
  [1, [0, 1, 2, 3, 4, '...', 13]],
  [2, [0, 1, 2, 3, 4, '...', 13]],
  [3, [0, 1, 2, 3, 4, 5, '...', 13]],
  [4, [0, '...', 2, 3, 4, 5, 6, '...', 13]],
  [5, [0, '...', 3, 4, 5, 6, 7, '...', 13]],
  [6, [0, '...', 4, 5, 6, 7, 8, '...', 13]],
  [7, [0, '...', 5, 6, 7, 8, 9, '...', 13]],
  [8, [0, '...', 6, 7, 8, 9, 10, '...', 13]],
  [9, [0, '...', 7, 8, 9, 10, 11, '...', 13]],
  [10, [0, '...', 8, 9, 10, 11, 12, 13]],
  [11, [0, '...', 9, 10, 11, 12, 13]],
  [12, [0, '...', 9, 10, 11, 12, 13]],
  [13, [0, '...', 9, 10, 11, 12, 13]],
]

testCases.forEach(([currentIndex, expected]) => {
  test(`should produce the correct list of page indices when current page index is ${currentIndex}`, () => {
    const pageIndices = getPageIndices(0, 13, currentIndex, 5)
    expect(pageIndices).toEqual(expected)
  })
})
