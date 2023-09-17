type CodeIsPredicate = (code: string) => boolean
type CodeIsGetter = (code: string) => string

type CodeIsKeys = 'letter' | 'alt' | 'arrow' | 'control' | 'shift' | 'meta' | 'digit'

const codeIs: Record<CodeIsKeys, CodeIsPredicate> = {
    letter: (code) =>  code.startsWith("Key"),
    alt: (code) => code === "AltLeft" || code === "AltRight",
    arrow: (code) => code === "ArrowUp" || code === "ArrowRight" || code === "ArrowDown" || code === "ArrowLeft",
    control: (code) => code === "ControlLeft" || code === "ControlRight",
    shift: (code) => code === "ShiftLeft" || code === "ShiftRight",
    meta:   (code) => code === "MetaLeft" || code === "MetaRight",
    digit: (code) => code.startsWith("Digit") || code.startsWith("Numpad")
}

const codeGet: Record<CodeIsKeys | 'unknown', CodeIsGetter> = {
    letter: (code) => code.replace("Key", "").toLowerCase(),
    alt: () => 'Alt',
    arrow: (code) => code.replace("Arrow", "").toLowerCase(),
    control: () => 'Ctrl',
    shift: () => 'Shift',
    meta:   () => 'Meta',
    digit: (code) => code.replace(/Digit|Numpad/, ""),
    unknown: (code) => {
        const {0: key} = Object.entries(codeIs).find(({1: predicate}) => predicate(code)) as [CodeIsKeys, CodeIsPredicate] | null ?? []
        if(!key || !codeGet[key]) return code

        return codeGet[key](code)
    }
}

export const CODE = {
    is: codeIs,
    get: codeGet
}

const getModifiersCode = (str: string) => `${str.toLowerCase()}Key`
const MODIFIERS = new Set(['Alt', 'Ctrl', 'Shift', 'Space', 'Meta']);

const prepareEventCode = (code: string) => CODE.get.unknown(code)

const getModifiers = (event: KeyboardEvent) =>
    [...MODIFIERS].reduce((acc, cur) => {
        if(MODIFIERS.has(prepareEventCode(event.code))) return acc

        const code = getModifiersCode(cur) as keyof KeyboardEvent

        if(event[code]) acc.push(cur)
        return acc
    }, [] as string[])

export const getEventCodeWithModifiers = (event: KeyboardEvent, sep = '+') => {
    const mod = getModifiers(event)
    return mod.concat(prepareEventCode(event.code)).join(sep)
}