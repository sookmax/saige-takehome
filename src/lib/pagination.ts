export function getPageIndices(
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
