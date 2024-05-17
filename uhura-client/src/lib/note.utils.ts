import { Note } from '../common/types'

/**
 * Utility functions for notes.
 */
export class NoteUtils {
  /**
   * Generates the metadata text for the given note.
   *
   * @param note the note for which to generate the text
   *
   * @returns the metadata text
   */
  public static getMetadataText({ type, direction, address }: Note) {
    let title = `${direction ? `${direction} ` : ''}${type}`

    if (address) {
      switch (type) {
        case 'call':
        case 'fax':
        case 'email':
        case 'mail':
        case 'submission':
          title += ` ${direction === 'inbound' ? 'from ' : 'to '}`
          break

        case 'meeting':
          title += ` at `
          break

        case 'other':
          title += ` for `
          break
      }
    }

    return title
  }

  /**
   * Generates the address URL for the given note.
   *
   * @param note the note for which to generate the URL
   *
   * @returns the address URL
   */
  public static getAddressUrl({ type, address }: Note) {
    let url

    switch (type) {
      case 'mail':
      case 'meeting':
        url = `https://maps.google.com/?q=${address}`
        break

      case 'call':
        url = `tel:${address}`
        break

      case 'fax':
        url = `fax:${address}`
        break

      case 'email':
        url = `mailto:${address}`
        break

      default:
        break
    }

    return url
  }
}
