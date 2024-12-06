import { Converter, SimpleMappingItem } from '../convert.js'
import type { MinimumProfile } from './MinimumProfile.js'
import type { MinimumProfileXml } from './MinimumProfileXml.js'
import mapping from './mapping.js'

export class MinimumProfileConverter extends Converter<MinimumProfile, MinimumProfileXml> {
    protected readonly map: SimpleMappingItem[] = mapping
}
