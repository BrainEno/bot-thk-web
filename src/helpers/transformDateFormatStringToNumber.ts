export function transformDateFormatStringToNumber(dateString: string): number {
    // Parse the date string to a Date object.
    const date = new Date(dateString)

    // Convert the Date object to a number.
    const dateNumber = date.getTime()

    // Return the date number.
    return dateNumber
}
