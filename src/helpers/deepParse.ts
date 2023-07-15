const isNumString = (str: string) => !isNaN(Number(str))
type IDic<V = any> = Record<string, V>

export function deepParse(jsonStr: any): any {
    if (typeof jsonStr === 'string') {
        if (isNumString(jsonStr)) {
            return jsonStr
        }

        try {
            return deepParse(JSON.parse(jsonStr))
        } catch (error) {
            return jsonStr
        }
    } else if (Array.isArray(jsonStr)) {
        return jsonStr.map((val) => deepParse(val))
    } else if (typeof jsonStr === 'object' && jsonStr !== null) {
        return Object.keys(jsonStr as IDic).reduce((obj, key) => {
            const val = jsonStr[key]
            obj[key] = isNumString(val) ? val : deepParse(val)
            return obj
        }, {} as IDic<object>)
    } else {
        return jsonStr
    }
}
