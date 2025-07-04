import { evaluateXPathToBoolean, evaluateXPathToString } from 'fontoxpath'
import { Node } from 'slimdom'

import { Result } from './Result'
import { FontoxpathOptions } from './types'

export class Assert {
    id: string | null
    test: string
    message: (string | object)[]
    isReport: boolean

    constructor(id: string | null, test: string, message: (string | object)[], isReport: boolean) {
        this.id = id
        this.test = test
        this.message = message
        this.isReport = isReport
    }

    createMessageString(
        contextNode: Node,
        variables: object,
        fontoxpathOptions: FontoxpathOptions,
        chunks: (string | any)[]
    ): string {
        return chunks
            .map((chunk): string => {
                if (typeof chunk === 'string') {
                    return chunk
                }

                // <sch:name />
                if (chunk.$type === 'name') {
                    return evaluateXPathToString(
                        'name(' + (chunk.path || '') + ')',
                        contextNode,
                        null,
                        variables,
                        fontoxpathOptions
                    )
                }

                // <sch:value-of />
                if (chunk.$type === 'value-of') {
                    return evaluateXPathToString(chunk.select, contextNode, null, variables, fontoxpathOptions)
                }

                console.log(chunk)
                throw new Error('Unsupported element in <sch:message>')
            })
            .join('')
    }

    validateNode(context: Node, variables: object, fontoxpathOptions: FontoxpathOptions): Result | null {
        //console.log('Assertion Check: ' + `${this.test}`)
        const outcome = evaluateXPathToBoolean(this.test, context, null, variables, fontoxpathOptions)
        //console.log(outcome)
        return (!this.isReport && outcome) || (this.isReport && !outcome)
            ? null
            : new Result(context, this, this.createMessageString(context, variables, fontoxpathOptions, this.message))
    }

    static QUERY = `map {
		'id': if (@id) then string(@id) else (),
		'test': @test/string(),
		'message': array { (./text()|./element())/local:json(.) },
		'isReport': boolean(local-name() = 'report')
	}`

    static fromJson(json: AssertJson): Assert {
        return new Assert(json.id, json.test, json.message, json.isReport)
    }
}

export interface AssertJson {
    id: string | null
    test: string
    message: (string | object)[]
    isReport: boolean
}
