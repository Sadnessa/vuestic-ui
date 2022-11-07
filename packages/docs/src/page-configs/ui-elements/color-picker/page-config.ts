import { ApiDocsBlock } from '@/types/configTypes'
import { PageGenerationHelper } from '@/helpers/DocsHelper'
import VaColorPicker from 'vuestic-ui/src/components/va-color-picker/VaColorPicker.vue'
import apiOptions from './api-options'

const block = new PageGenerationHelper(__dirname)

const config: ApiDocsBlock[] = [
  block.title('colorPicker.title'),

  block.subtitle('all.examples'),

  // examples
  // ...block.exampleBlock(
  //   'colorPicker.examples.yourExample.title',
  //   'colorPicker.examples.yourExample.text',
  //   'Example',
  // ),

  block.api(VaColorPicker, apiOptions),
]

export default config
