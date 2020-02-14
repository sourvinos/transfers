import { Injectable } from '@angular/core'
import { NgZone } from '@angular/core'

type Terminal = boolean | 'match'

interface ListenerOptions {
    priority: number
    terminal?: Terminal
    terminalWhitelist?: string[]
    inputs?: boolean
}

interface Listener {
    priority: number
    terminal: Terminal
    terminalWhitelist: TerminalWhitelist
    inputs: boolean
    bindings: Bindings
}

type Handler = (event: KeyboardEvent) => boolean | void

interface Bindings {
    [key: string]: Handler
}

interface NormalizedKeys {
    [key: string]: string
}

interface TerminalWhitelist {
    [key: string]: boolean
}

export type Unlisten = () => void

const KEY_MAP = {
    '\b': 'Backspace',
    '\t': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    'Del': 'Delete',
    'Esc': 'Escape',
    'Left': 'ArrowLeft',
    'Right': 'ArrowRight',
    'Up': 'ArrowUp',
    'Down': 'ArrowDown',
    'Menu': 'ContextMenu',
    'Scroll': 'ScrollLock',
    'Win': 'OS',
    ' ': 'Space',
    '.': 'Dot'
}

const KEY_ALIAS = {
    command: 'meta',
    ctrl: 'control',
    del: 'delete',
    down: 'arrowdown',
    esc: 'escape',
    left: 'arrowleft',
    right: 'arrowright',
    up: 'arrowup'
}

@Injectable({ providedIn: 'root' })

export class KeyboardShortcuts {

    private listeners: Listener[]
    private normalizedKeys: NormalizedKeys
    private zone: NgZone

    constructor(zone: NgZone) {
        this.zone = zone
        this.listeners = []
        this.normalizedKeys = Object.create(null)
        this.zone.runOutsideAngular(
            (): void => {
                window.addEventListener('keydown', this.handleKeyboardEvent)
            }
        )
    }

    public listen(bindings: Bindings, options: ListenerOptions): Unlisten {
        const listener = this.addListener({
            priority: options.priority,
            terminal: this.normalizeTerminal(options.terminal),
            terminalWhitelist: this.normalizeTerminalWhitelist(options.terminalWhitelist),
            inputs: this.normalizeInputs(options.inputs),
            bindings: this.normalizeBindings(bindings)
        })
        const unlisten = (): void => {
            this.removeListener(listener)
        }
        return (unlisten)
    }

    private addListener(listener: Listener): Listener {
        this.listeners.push(listener)
        this.listeners.sort(
            (a: Listener, b: Listener): number => {
                if (a.priority < b.priority) {
                    return (1)
                } else if (a.priority > b.priority) {
                    return (-1)
                } else {
                    return (0)
                }
            }
        )

        return (listener)

    }

    private getKeyFromEvent(event: KeyboardEvent): string {
        let key = (event.key || event['keyIdentifier'] || 'Unidentified')
        if (key.startsWith('U+')) {
            key = String.fromCharCode(parseInt(key.slice(2), 16))
        }
        const parts = [KEY_MAP[key] || key]
        if (event.altKey) { parts.push('Alt') }
        if (event.ctrlKey) { parts.push('Control') }
        if (event.metaKey) { parts.push('Meta') }
        if (event.shiftKey) { parts.push('Shift') }
        return (this.normalizeKey(parts.join('.')))
    }

    private handleKeyboardEvent = (event: KeyboardEvent): void => {
        const key = this.getKeyFromEvent(event)
        const isInputEvent = this.isEventFromInput(event)
        let handler: Handler
        for (const listener of this.listeners) {
            if (handler = listener.bindings[key]) {
                if (!isInputEvent || listener.inputs) {
                    const result = this.zone.runGuarded(
                        (): boolean | void => {
                            return (handler(event))
                        }
                    )
                    if (result === false) {
                        return
                    } else if (result === true) {
                        continue
                    }
                }
                if (listener.terminal === 'match') {
                    return
                }
            }
            if ((listener.terminal === true) && !listener.terminalWhitelist[key]) {
                return
            }
        }
    }

    private isEventFromInput(event: KeyboardEvent): boolean {
        if (event.target instanceof Node) {
            switch (event.target.nodeName) {
                case 'INPUT':
                case 'SELECT':
                case 'TEXTAREA':
                    return (true)
                default:
                    return (false)
            }
        }
        return (false)
    }

    private normalizeBindings(bindings: Bindings): Bindings {
        const normalized = Object.create(null)
        for (const key in bindings) {
            normalized[this.normalizeKey(key)] = bindings[key]
        }
        return (normalized)
    }

    private normalizeInputs(inputs: boolean | undefined): boolean {
        if (inputs === undefined) {
            return (false)
        }
        return (inputs)
    }

    private normalizeKey(key: string): string {
        if (!this.normalizedKeys[key]) {
            this.normalizedKeys[key] = key
                .toLowerCase()
                .split('.')
                .map(
                    (segment): string => {
                        return (KEY_ALIAS[segment] || segment)
                    }
                )
                .sort()
                .join('.')
        }
        return (this.normalizedKeys[key])
    }

    private normalizeTerminal(terminal: Terminal | undefined): Terminal {
        if (terminal === undefined) {
            return (true)
        }
        return (terminal)
    }

    private normalizeTerminalWhitelist(keys: string[] | undefined): TerminalWhitelist {
        const normalized = Object.create(null)
        if (keys) {
            for (const key of keys) {
                normalized[this.normalizeKey(key)] = true
            }
        }
        return (normalized)
    }

    private removeListener(listenerToRemove: Listener): void {
        this.listeners = this.listeners.filter(
            (listener: Listener): boolean => {
                return (listener !== listenerToRemove)
            }
        )
    }

}
