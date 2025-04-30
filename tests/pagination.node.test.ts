import { expect, test } from 'vitest'

function getPageIndices(
  startIdx: number,
  endIdx: number,
  currentIdx: number,
  show: number = 5
) {
  const halfShow = Math.floor(show / 2)
  const lowerbound = Math.max(startIdx, currentIdx - halfShow)
  const upperbound = Math.min(endIdx, currentIdx + halfShow)

  const pageIndices: (number | '...')[] = []

  for (let i = lowerbound; i <= upperbound; i++) {
    pageIndices.push(i)
  }

  let i = lowerbound - 1
  while (i >= startIdx && pageIndices.length < show) {
    pageIndices.unshift(i--)
  }

  i = upperbound + 1
  while (i <= endIdx && pageIndices.length < show) {
    pageIndices.push(i++)
  }

  const firstIndex = pageIndices[0]
  if (typeof firstIndex === 'number' && firstIndex > startIdx) {
    if (firstIndex > startIdx + 1) {
      pageIndices.unshift('...')
    }
    pageIndices.unshift(startIdx)
  }

  const lastIndex = pageIndices[pageIndices.length - 1]
  if (typeof lastIndex === 'number' && lastIndex < endIdx) {
    if (lastIndex < endIdx - 1) {
      pageIndices.push('...')
    }
    pageIndices.push(endIdx)
  }

  return pageIndices
}

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
